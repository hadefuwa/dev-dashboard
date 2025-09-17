// Data Management Utilities for R&D Dashboard
// TODO: Replace with shared database integration (JSONBin.io, Firebase, Supabase)

// Data validation functions
function validateProjectData(projectData) {
    const errors = [];
    
    if (!projectData.name || projectData.name.trim().length === 0) {
        errors.push('Project name is required');
    }
    
    if (!projectData.projectType || !['large', 'small'].includes(projectData.projectType)) {
        errors.push('Project type must be "large" or "small"');
    }
    
    if (!projectData.status || !['active', 'paused', 'completed'].includes(projectData.status)) {
        errors.push('Project status must be "active", "paused", or "completed"');
    }
    
    if (!projectData.startDate) {
        errors.push('Start date is required');
    }
    
    if (!projectData.endDate) {
        errors.push('End date is required');
    }
    
    if (projectData.startDate && projectData.endDate) {
        const startDate = new Date(projectData.startDate);
        const endDate = new Date(projectData.endDate);
        if (endDate <= startDate) {
            errors.push('End date must be after start date');
        }
    }
    
    if (projectData.progress < 0 || projectData.progress > 100) {
        errors.push('Progress must be between 0 and 100');
    }
    
    return errors;
}

// Data sanitization functions
function sanitizeProjectData(projectData) {
    return {
        ...projectData,
        name: projectData.name ? projectData.name.trim() : '',
        description: projectData.description ? projectData.description.trim() : '',
        notes: projectData.notes ? projectData.notes.trim() : '',
        teamMembers: projectData.teamMembers ? 
            projectData.teamMembers.map(m => m.trim()).filter(m => m.length > 0) : [],
        milestones: projectData.milestones ? 
            projectData.milestones.filter(m => m.name && m.name.trim().length > 0) : []
    };
}

// Data export/import functions
function exportToCSV(projects) {
    if (!projects || projects.length === 0) {
        return 'No projects to export';
    }

    // CSV headers - Excel friendly format
    const headers = [
        'ID',
        'Name', 
        'Description',
        'Project Type',
        'Status',
        'Start Date',
        'End Date',
        'Progress (%)',
        'Team Members',
        'Notes',
        'Milestone 1 Name',
        'Milestone 1 Due Date',
        'Milestone 1 Completed',
        'Milestone 2 Name',
        'Milestone 2 Due Date',
        'Milestone 2 Completed',
        'Milestone 3 Name',
        'Milestone 3 Due Date',
        'Milestone 3 Completed',
        'Milestone 4 Name',
        'Milestone 4 Due Date',
        'Milestone 4 Completed',
        'Milestone 5 Name',
        'Milestone 5 Due Date',
        'Milestone 5 Completed'
    ];

    // Convert projects to CSV rows
    const rows = projects.map(project => {
        const teamMembers = project.teamMembers ? project.teamMembers.join('; ') : '';
        const milestones = project.milestones || [];
        
        // Create row with all milestone columns
        const row = [
            project.id,
            project.name,
            project.description,
            project.projectType,
            project.status,
            project.startDate,
            project.endDate,
            project.progress,
            teamMembers,
            project.notes || ''
        ];

        // Add milestone data (up to 5 milestones)
        for (let i = 0; i < 5; i++) {
            if (milestones[i]) {
                row.push(milestones[i].name);
                row.push(milestones[i].dueDate);
                row.push(milestones[i].completed ? 'Yes' : 'No');
            } else {
                row.push('');
                row.push('');
                row.push('');
            }
        }

        return row;
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    return csvContent;
}

function importFromCSV(csvContent) {
    try {
        const lines = csvContent.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV file must contain headers and at least one data row');
        }

        // Parse headers
        const headers = parseCSVLine(lines[0]);
        const expectedHeaders = [
            'ID', 'Name', 'Description', 'Project Type', 'Status',
            'Start Date', 'End Date', 'Progress (%)', 'Team Members', 'Notes'
        ];

        // Validate headers
        for (let i = 0; i < expectedHeaders.length; i++) {
            if (!headers[i] || headers[i].toLowerCase() !== expectedHeaders[i].toLowerCase()) {
                throw new Error(`Invalid header: expected "${expectedHeaders[i]}", found "${headers[i]}"`);
            }
        }

        // Parse data rows
        const projects = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            
            if (values.length < 10) {
                console.warn(`Skipping row ${i + 1}: insufficient data`);
                continue;
            }

            // Parse basic project data
            const project = {
                id: parseInt(values[0]) || Date.now() + i,
                name: values[1],
                description: values[2],
                projectType: values[3] || 'small',
                status: values[4] || 'active',
                startDate: values[5],
                endDate: values[6],
                progress: parseInt(values[7]) || 0,
                teamMembers: values[8] ? values[8].split(';').map(m => m.trim()).filter(m => m) : [],
                notes: values[9] || '',
                milestones: []
            };

            // Parse milestones (columns 10-24)
            for (let j = 0; j < 5; j++) {
                const milestoneIndex = 10 + (j * 3);
                if (values[milestoneIndex] && values[milestoneIndex].trim()) {
                    project.milestones.push({
                        name: values[milestoneIndex],
                        dueDate: values[milestoneIndex + 1] || '',
                        completed: values[milestoneIndex + 2] === 'Yes'
                    });
                }
            }

            projects.push(project);
        }

        return projects;
    } catch (error) {
        throw new Error(`Import failed: ${error.message}`);
    }
}

// Helper function to parse CSV line
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++; // Skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    values.push(current);
    return values.map(v => v.trim().replace(/^"(.*)"$/, '$1'));
}

function importFromJSON(jsonData) {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        if (!data.projects || !Array.isArray(data.projects)) {
            throw new Error('Invalid data format: projects array not found');
        }
        
        // Validate each project
        const validProjects = [];
        data.projects.forEach((project, index) => {
            const errors = validateProjectData(project);
            if (errors.length === 0) {
                validProjects.push(sanitizeProjectData(project));
            } else {
                console.warn(`Skipping invalid project at index ${index}:`, errors);
            }
        });
        
        return validProjects;
    } catch (error) {
        throw new Error(`Failed to import data: ${error.message}`);
    }
}

// Data backup and restore functions
function createBackup() {
    const projects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
    const backup = {
        projects: projects,
        exportDate: new Date().toISOString(),
        version: '1.0',
        totalProjects: projects.length,
        metadata: {
            browser: navigator.userAgent,
            timestamp: Date.now()
        }
    };
    
    return backup;
}

function restoreBackup(backupData) {
    try {
        const backup = typeof backupData === 'string' ? JSON.parse(backupData) : backupData;
        
        if (!backup.projects || !Array.isArray(backup.projects)) {
            throw new Error('Invalid backup: projects array not found');
        }
        
        // Validate all projects in backup
        const validProjects = backup.projects.filter(project => {
            const errors = validateProjectData(project);
            return errors.length === 0;
        });
        
        if (validProjects.length === 0) {
            throw new Error('No valid projects found in backup');
        }
        
        // Store the validated projects
        localStorage.setItem('rdProjects', JSON.stringify(validProjects));
        
        return {
            success: true,
            importedCount: validProjects.length,
            skippedCount: backup.projects.length - validProjects.length
        };
    } catch (error) {
        throw new Error(`Failed to restore backup: ${error.message}`);
    }
}

// Data statistics functions
function calculateProjectStats(projects) {
    const stats = {
        total: projects.length,
        byType: { large: 0, small: 0 },
        byStatus: { active: 0, paused: 0, completed: 0 },
        avgProgress: 0,
        totalTeamMembers: 0,
        totalMilestones: 0,
        overdueProjects: 0
    };
    
    if (projects.length === 0) return stats;
    
    const today = new Date();
    let totalProgress = 0;
    const uniqueTeamMembers = new Set();
    
    projects.forEach(project => {
        // Count by type
        stats.byType[project.projectType] = (stats.byType[project.projectType] || 0) + 1;
        
        // Count by status
        stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1;
        
        // Calculate progress
        totalProgress += project.progress || 0;
        
        // Count team members
        if (project.teamMembers) {
            project.teamMembers.forEach(member => uniqueTeamMembers.add(member));
        }
        
        // Count milestones
        if (project.milestones) {
            stats.totalMilestones += project.milestones.length;
        }
        
        // Check for overdue projects
        if (project.endDate) {
            const endDate = new Date(project.endDate);
            if (endDate < today && project.status !== 'completed') {
                stats.overdueProjects++;
            }
        }
    });
    
    stats.avgProgress = Math.round(totalProgress / projects.length);
    stats.totalTeamMembers = uniqueTeamMembers.size;
    
    return stats;
}

// Data cleanup functions
function cleanupOrphanedData() {
    // Remove projects with invalid data
    const projects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
    const validProjects = projects.filter(project => {
        const errors = validateProjectData(project);
        return errors.length === 0;
    });
    
    if (validProjects.length !== projects.length) {
        localStorage.setItem('rdProjects', JSON.stringify(validProjects));
        console.log(`Cleaned up ${projects.length - validProjects.length} invalid projects`);
    }
    
    return validProjects.length;
}

// Export functions for use in main script
window.DataUtils = {
    validateProjectData,
    sanitizeProjectData,
    exportToCSV,
    importFromCSV,
    importFromJSON,
    createBackup,
    restoreBackup,
    calculateProjectStats,
    cleanupOrphanedData
};
