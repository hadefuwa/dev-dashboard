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
function exportToCSV(tasks) {
    if (!tasks || tasks.length === 0) {
        return 'No tasks to export';
    }

    // CSV headers - Teams Planner format
    const headers = [
        'Task ID',
        'Task Name',
        'Bucket Name',
        'Progress',
        'Priority',
        'Assigned To',
        'Created By',
        'Created Date',
        'Start Date',
        'Due Date',
        'Is Recurring',
        'Late',
        'Completed Date',
        'Completed By',
        'Completed Checklist Items',
        'Checklist Items',
        'Labels',
        'Description'
    ];

    // Convert tasks to CSV rows
    const rows = tasks.map(task => {
        return [
            task.taskId || '',
            task.taskName || '',
            task.bucketName || '',
            task.progress || '',
            task.priority || '',
            task.assignedTo || '',
            task.createdBy || '',
            task.createdDate || '',
            task.startDate || '',
            task.dueDate || '',
            task.isRecurring || 'false',
            task.late || 'false',
            task.completedDate || '',
            task.completedBy || '',
            task.completedChecklistItems || '',
            task.checklistItems || '',
            task.labels || '',
            task.description || ''
        ];
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

        // Parse headers. Newer Planner files use slightly different names
        // (Bucket instead of Bucket Name, Status instead of Progress).
        const headers = parseCSVLine(lines[0]);
        const taskIdColumn = findColumn(headers, ['task id']);
        const taskNameColumn = findColumn(headers, ['task name']);

        if (taskIdColumn === -1 || taskNameColumn === -1) {
            throw new Error('This doesn\'t appear to be a Teams Planner export. Expected columns: Task ID, Task Name, Bucket Name, etc.');
        }

        const bucketColumn = findColumn(headers, ['bucket name', 'bucket']);
        const progressColumn = findColumn(headers, ['progress', 'status']);
        const priorityColumn = findColumn(headers, ['priority']);
        const assignedColumn = findColumn(headers, ['assigned to']);
        const createdByColumn = findColumn(headers, ['created by']);
        const createdDateColumn = findColumn(headers, ['created date']);
        const startDateColumn = findColumn(headers, ['start date']);
        const dueDateColumn = findColumn(headers, ['due date']);
        const recurringColumn = findColumn(headers, ['is recurring']);
        const lateColumn = findColumn(headers, ['late']);
        const completedDateColumn = findColumn(headers, ['completed date']);
        const completedByColumn = findColumn(headers, ['completed by']);
        const completedChecklistColumn = findColumn(headers, ['completed checklist items']);
        const checklistColumn = findColumn(headers, ['checklist items']);
        const labelsColumn = findColumn(headers, ['labels']);
        const descriptionColumn = findColumn(headers, ['description', 'notes']);

        // Parse data rows
        const tasks = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);

            // Parse Teams Planner task data
            const task = {
                taskId: readColumn(values, taskIdColumn),
                taskName: readColumn(values, taskNameColumn),
                bucketName: readColumn(values, bucketColumn),
                progress: readColumn(values, progressColumn),
                priority: readColumn(values, priorityColumn),
                assignedTo: readColumn(values, assignedColumn),
                createdBy: readColumn(values, createdByColumn),
                createdDate: readColumn(values, createdDateColumn),
                startDate: readColumn(values, startDateColumn),
                dueDate: readColumn(values, dueDateColumn),
                isRecurring: readColumn(values, recurringColumn) || 'false',
                late: readColumn(values, lateColumn) || 'false',
                completedDate: readColumn(values, completedDateColumn),
                completedBy: readColumn(values, completedByColumn),
                completedChecklistItems: readColumn(values, completedChecklistColumn),
                checklistItems: readColumn(values, checklistColumn),
                labels: readColumn(values, labelsColumn),
                description: readColumn(values, descriptionColumn)
            };

            // Only add tasks with a task name
            if (task.taskName.trim()) {
                tasks.push(task);
            }
        }

        return tasks;
    } catch (error) {
        if (String(error.message).indexOf('Import failed:') === 0) {
            throw error;
        }
        throw new Error('Import failed: ' + error.message);
    }
}

// Find a column by its header name. Names are compared in lower case.
function findColumn(headers, possibleNames) {
    for (let i = 0; i < headers.length; i++) {
        const header = String(headers[i] || '').toLowerCase().trim();
        for (let n = 0; n < possibleNames.length; n++) {
            if (header === possibleNames[n]) {
                return i;
            }
        }
    }
    return -1;
}

// Read one cell. Missing columns come back as an empty string.
function readColumn(values, index) {
    if (index < 0 || index >= values.length) {
        return '';
    }
    return values[index] || '';
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
