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
    const headers = [
        'Name', 'Type', 'Status', 'Progress', 'Start Date', 'End Date', 
        'Team Members', 'Milestones', 'Notes'
    ];
    
    const csvContent = [
        headers.join(','),
        ...projects.map(project => [
            `"${project.name}"`,
            project.projectType,
            project.status,
            project.progress,
            project.startDate,
            project.endDate,
            `"${project.teamMembers ? project.teamMembers.join('; ') : ''}"`,
            `"${project.milestones ? project.milestones.map(m => m.name).join('; ') : ''}"`,
            `"${project.notes || ''}"`
        ].join(','))
    ].join('\n');
    
    return csvContent;
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
    importFromJSON,
    createBackup,
    restoreBackup,
    calculateProjectStats,
    cleanupOrphanedData
};
