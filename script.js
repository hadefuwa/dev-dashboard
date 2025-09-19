// R&D Dashboard JavaScript
// TODO: Implement shared database integration
// Options: JSONBin.io, Firebase, or Supabase for shared data storage
// For now, using LocalStorage for development/testing

// No sample data - dashboard starts empty, ready for Teams Planner import
const sampleProjects = [];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    setupTitleAnimation();
});

// Initialize dashboard (starts empty, ready for import)
async function initializeDashboard() {
    // Load and display tasks
    const tasks = await loadTasks();
    displayTasks(tasks);
    updateKPIs();
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Apply filter
            applyFilter(this.dataset.filter);
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const detailsModal = document.getElementById('project-details-modal');
        
        if (event.target === detailsModal) {
            hideProjectDetails();
        }
    });
}

// Future: Load all tasks from shared database
async function loadTasks() {
    // TODO: Replace with actual database call
    // For now, load from LocalStorage for development
    const tasks = JSON.parse(localStorage.getItem('rdTasks') || '[]');
    return tasks; // Return the tasks array
}

// Get tasks without displaying them (for export/import)
function getTasks() {
    return JSON.parse(localStorage.getItem('rdTasks') || '[]');
}

// Display tasks on the dashboard
function displayTasks(tasks) {
    const projectsGrid = document.getElementById('projects-grid');
    
    // Clear existing tasks
    projectsGrid.innerHTML = '';
    
    
    // If no tasks, show empty state message
    if (!tasks || tasks.length === 0) {
        const emptyMessage = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h3>No Tasks Found</h3>
                <p>Your dashboard is empty and ready for your Teams Planner data!</p>
                <div class="empty-state-actions">
                    <button class="btn btn-primary" onclick="importData()">Import from Teams Planner</button>
                </div>
            </div>
        `;
        projectsGrid.innerHTML = emptyMessage;
        return;
    }
    
    // Display all tasks in unified grid
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        projectsGrid.appendChild(taskCard);
    });
}

// Create a task card element for Teams Planner tasks
function createTaskCard(task) {
    const card = document.createElement('div');
    
    // Determine task status and styling
    let statusClass = 'not-started';
    let statusText = 'Not Started';
    
    if (task.progress === 'Completed') {
        statusClass = 'completed';
        statusText = 'Completed';
    } else if (task.progress === 'In progress') {
        statusClass = 'active';
        statusText = 'In Progress';
    }
    
    // Determine priority styling
    let priorityClass = 'medium';
    if (task.priority === 'Urgent') priorityClass = 'urgent';
    else if (task.priority === 'Low') priorityClass = 'low';
    
    card.className = `task-card ${statusClass}`;
    
    // Calculate if task is late
    const isLate = task.late === 'true' || task.late === true;
    const lateIndicator = isLate ? '<span class="late-indicator">⚠️ LATE</span>' : '';
    
    // Format dates
    const dueDate = task.dueDate ? formatDate(task.dueDate) : 'No due date';
    const createdDate = task.createdDate ? formatDate(task.createdDate) : '';
    
    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${task.taskName}</div>
            <div class="task-status ${statusClass}">${statusText}</div>
        </div>
        
        ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
        
        <div class="task-bucket">
            <span class="bucket-label">Bucket:</span>
            <span class="bucket-name">${task.bucketName}</span>
        </div>
        
        <div class="task-priority priority-${priorityClass}">
            Priority: ${task.priority}
        </div>
        
        <div class="task-assignment">
            <span class="assigned-label">Assigned to:</span>
            <span class="assigned-to">${task.assignedTo || 'Unassigned'}</span>
        </div>
        
        <div class="task-dates">
            <div class="task-date">
                <span class="date-label">Created:</span>
                <span class="date-value">${createdDate}</span>
            </div>
            <div class="task-date">
                <span class="date-label">Due:</span>
                <span class="date-value ${isLate ? 'late' : ''}">${dueDate}</span>
                ${lateIndicator}
            </div>
        </div>
        
        ${task.checklistItems ? `
        <div class="task-checklist">
            <div class="checklist-label">Checklist:</div>
            <div class="checklist-progress">
                <span class="checklist-text">${task.completedChecklistItems || '0'}/${task.checklistItems.split(';').length || '0'}</span>
                <div class="checklist-items">${task.checklistItems}</div>
            </div>
        </div>
        ` : ''}
        
        ${task.labels ? `
        <div class="task-labels">
            <span class="labels-label">Labels:</span>
            <span class="labels-text">${task.labels}</span>
        </div>
        ` : ''}
        
        <div class="task-actions">
            <button class="action-btn view" onclick="viewTaskDetails('${task.taskId}')">View Details</button>
        </div>
    `;
    
    return card;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}


// View project details
function viewProjectDetails(projectId) {
    const projects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    document.getElementById('details-project-name').textContent = project.name;
    
    const detailsContent = document.getElementById('project-details-content');
    detailsContent.innerHTML = `
        <div style="padding: 20px;">
            <div style="margin-bottom: 20px;">
                <h3 style="color: #87CEEB; margin-bottom: 10px;">Description</h3>
                <p style="color: rgba(255,255,255,0.8);">${project.description}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h3 style="color: #87CEEB; margin-bottom: 10px;">Project Info</h3>
                    <p><strong>Type:</strong> ${project.projectType}</p>
                    <p><strong>Status:</strong> ${project.status}</p>
                    <p><strong>Progress:</strong> ${project.progress}%</p>
                </div>
                <div>
                    <h3 style="color: #87CEEB; margin-bottom: 10px;">Timeline</h3>
                    <p><strong>Start Date:</strong> ${formatDate(project.startDate)}</p>
                    <p><strong>End Date:</strong> ${formatDate(project.endDate)}</p>
                </div>
            </div>
            
            ${project.teamMembers && project.teamMembers.length > 0 ? `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #87CEEB; margin-bottom: 10px;">Team Members</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${project.teamMembers.map(member => `<span class="team-member">${member}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${project.notes ? `
            <div>
                <h3 style="color: #87CEEB; margin-bottom: 10px;">Notes</h3>
                <p style="color: rgba(255,255,255,0.8);">${project.notes}</p>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('project-details-modal').style.display = 'block';
}

// Hide project details modal
function hideProjectDetails() {
    document.getElementById('project-details-modal').style.display = 'none';
}


// Apply filter
function applyFilter(filter) {
    const tasks = JSON.parse(localStorage.getItem('rdTasks') || '[]');
    let filteredTasks = tasks;
    
    switch(filter) {
        case 'active':
            filteredTasks = tasks.filter(t => t.progress === 'In progress');
            break;
        case 'completed':
            filteredTasks = tasks.filter(t => t.progress === 'Completed');
            break;
        case 'not-started':
            filteredTasks = tasks.filter(t => t.progress === 'Not started');
            break;
        case 'all':
        default:
            filteredTasks = tasks;
            break;
    }
    
    displayTasks(filteredTasks);
}

// Enhanced export data with multiple formats
// Export data function
function exportData() {
    try {
        const tasks = getTasks();
        
        // Ensure tasks is an array
        if (!Array.isArray(tasks)) {
            throw new Error('No valid tasks data found');
        }
        
        // Check if XLSX library is available for Excel export
        if (typeof XLSX !== 'undefined') {
            exportToExcel(tasks);
        } else {
            // Fallback to CSV if Excel library not available
            exportToCSV(tasks);
        }
        
    } catch (error) {
        console.error('Export error:', error);
        showNotification(`Export failed: ${error.message}`, 'error');
    }
}

// Export to Excel format (.xlsx)
function exportToExcel(tasks) {
    try {
        // Create CSV content first
        const csvContent = DataUtils.exportToCSV(tasks);
        
        // Convert CSV to Excel workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(
            csvContent.split('\n').map(row => 
                row.split(',').map(cell => 
                    cell.replace(/^"(.*)"$/, '$1').replace(/""/g, '"')
                )
            )
        );
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'R&D Tasks');
        
        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Download the file
        const url = URL.createObjectURL(excelBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rd-dashboard-tasks-${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
        
        showNotification('Data exported to Excel format (.xlsx)! You can now edit it in Excel and import it back.', 'success');
        
    } catch (error) {
        // Fallback to CSV if Excel export fails
        exportToCSV(tasks);
    }
}

// Export to CSV format (fallback)
function exportToCSV(tasks) {
    const csvContent = DataUtils.exportToCSV(tasks);
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `rd-dashboard-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    csvLink.click();
    URL.revokeObjectURL(csvUrl);
    
    showNotification('Data exported to CSV format! You can now edit it in Excel and import it back.', 'success');
}

// Import data function
function importData() {
    // Trigger file input
    document.getElementById('import-file-input').click();
}

// Handle file import
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileExtension = file.name.toLowerCase().split('.').pop();
    
    if (fileExtension === 'csv') {
        // Handle CSV files
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                importFromCSV(content);
            } catch (error) {
                showNotification(`Import failed: ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Handle Excel files
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                importFromExcel(e.target.result, fileExtension);
            } catch (error) {
                showNotification(`Excel import failed: ${error.message}`, 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    } else {
        showNotification('Please use CSV, XLS, or XLSX files for import.', 'error');
    }
}

// Import from Excel files (XLS/XLSX)
function importFromExcel(arrayBuffer, fileExtension) {
    try {
        // Check if XLSX library is available
        if (typeof XLSX === 'undefined') {
            throw new Error('Excel parsing library not loaded. Please refresh the page.');
        }
        
        // Parse the Excel file
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Check if workbook has any sheets
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error('Excel file contains no worksheets.');
        }
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Check if worksheet has data
        if (!worksheet || Object.keys(worksheet).length === 0) {
            throw new Error('The first worksheet in the Excel file is empty.');
        }
        
        // Convert worksheet to CSV format
        const csvContent = XLSX.utils.sheet_to_csv(worksheet);
        
        // Check if CSV content is empty
        if (!csvContent || csvContent.trim().length === 0) {
            throw new Error('No data found in the Excel file. Please check if the file contains project data.');
        }
        
        // Use the existing CSV import function
        importFromCSV(csvContent);
        
    } catch (error) {
        // Show specific error message
        showNotification(`Excel import failed: ${error.message}`, 'error');
        throw error;
    }
}

// Import from CSV content
function importFromCSV(csvContent) {
    try {
        const importedTasks = DataUtils.importFromCSV(csvContent);
        
        if (importedTasks.length === 0) {
            showNotification('No valid tasks found in the CSV file.', 'error');
            return;
        }
        
        // Confirm import - warn about replacing all data
        const confirmMessage = `This will REPLACE ALL current data with ${importedTasks.length} tasks from Teams Planner.\n\nAre you sure you want to continue?`;
        if (confirm(confirmMessage)) {
            // Clear all existing data and save only imported tasks
            localStorage.setItem('rdTasks', JSON.stringify(importedTasks));
            
            
            // Refresh dashboard with new data
            initializeDashboard();
            
            const message = `Successfully imported ${importedTasks.length} tasks from Teams Planner!`;
            showNotification(message, 'success');
        }
        
    } catch (error) {
        showNotification(`Import failed: ${error.message}`, 'error');
    }
}


// Reports Functions
function showReports() {
    const modal = document.getElementById('reports-modal');
    modal.style.display = 'block';
    generateReports();
}

function hideReports() {
    document.getElementById('reports-modal').style.display = 'none';
}

function generateReports() {
    const projects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
    
    // Calculate detailed statistics using DataUtils
    const stats = DataUtils.calculateProjectStats(projects);
    
    // Update statistics display
    document.getElementById('total-projects').textContent = stats.total;
    document.getElementById('active-projects').textContent = stats.byStatus.active;
    document.getElementById('completed-projects').textContent = stats.byStatus.completed;
    document.getElementById('avg-progress').textContent = stats.avgProgress + '%';
    
    // Generate timeline chart
    generateTimelineChart(projects);
    
    // Generate team statistics
    generateTeamStats(projects);
    
    // Add additional statistics to the reports
    addDetailedStats(stats);
}

function addDetailedStats(stats) {
    // Add more detailed statistics to the reports modal
    const reportsContent = document.querySelector('.reports-content');
    
    // Check if detailed stats section already exists
    let detailedStatsSection = document.getElementById('detailed-stats-section');
    if (!detailedStatsSection) {
        detailedStatsSection = document.createElement('div');
        detailedStatsSection.id = 'detailed-stats-section';
        detailedStatsSection.className = 'report-section';
        detailedStatsSection.innerHTML = `
            <h3>Detailed Statistics</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${stats.byType.large}</div>
                    <div class="stat-label">Large Projects</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.byType.small}</div>
                    <div class="stat-label">Small Projects</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.totalTeamMembers}</div>
                    <div class="stat-label">Team Members</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.totalMilestones}</div>
                    <div class="stat-label">Total Milestones</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.byStatus.paused}</div>
                    <div class="stat-label">Paused Projects</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.overdueProjects}</div>
                    <div class="stat-label">Overdue Projects</div>
                </div>
            </div>
        `;
        
        // Insert before the timeline section
        const timelineSection = document.querySelector('.report-section:nth-child(2)');
        timelineSection.parentNode.insertBefore(detailedStatsSection, timelineSection);
    } else {
        // Update existing detailed stats
        detailedStatsSection.querySelector('.stat-card:nth-child(1) .stat-number').textContent = stats.byType.large;
        detailedStatsSection.querySelector('.stat-card:nth-child(2) .stat-number').textContent = stats.byType.small;
        detailedStatsSection.querySelector('.stat-card:nth-child(3) .stat-number').textContent = stats.totalTeamMembers;
        detailedStatsSection.querySelector('.stat-card:nth-child(4) .stat-number').textContent = stats.totalMilestones;
        detailedStatsSection.querySelector('.stat-card:nth-child(5) .stat-number').textContent = stats.byStatus.paused;
        detailedStatsSection.querySelector('.stat-card:nth-child(6) .stat-number').textContent = stats.overdueProjects;
    }
}

function generateTimelineChart(projects) {
    const chartContainer = document.getElementById('timeline-chart');
    
    // Simple timeline visualization
    let timelineHTML = '<div class="timeline-simple">';
    
    projects.forEach(project => {
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        const today = new Date();
        
        // Calculate progress position
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const daysPassed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
        const progressPercent = Math.max(0, Math.min(100, (daysPassed / totalDays) * 100));
        
        timelineHTML += `
            <div class="timeline-item">
                <div class="timeline-project-name">${project.name}</div>
                <div class="timeline-bar">
                    <div class="timeline-progress" style="width: ${progressPercent}%"></div>
                    <div class="progress-percentage">${Math.round(progressPercent)}%</div>
                </div>
                <div class="timeline-dates">${formatDate(project.startDate)} - ${formatDate(project.endDate)}</div>
            </div>
        `;
    });
    
    timelineHTML += '</div>';
    chartContainer.innerHTML = timelineHTML;
}

function generateTeamStats(projects) {
    const teamContainer = document.getElementById('team-stats');
    const teamStats = {};
    
    // Count projects per team member
    projects.forEach(project => {
        if (project.teamMembers) {
            project.teamMembers.forEach(member => {
                teamStats[member] = (teamStats[member] || 0) + 1;
            });
        }
    });
    
    // Sort by project count
    const sortedTeams = Object.entries(teamStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10); // Show top 10 team members
    
    let teamHTML = '';
    if (sortedTeams.length === 0) {
        teamHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6);">No team data available</div>';
    } else {
        sortedTeams.forEach(([member, count]) => {
            teamHTML += `
                <div class="team-member-stat">
                    <span class="member-name">${member}</span>
                    <span class="member-projects">${count} project${count !== 1 ? 's' : ''}</span>
                </div>
            `;
        });
    }
    
    teamContainer.innerHTML = teamHTML;
}

// Enhanced project details with milestones
function viewProjectDetails(projectId) {
    const projects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    document.getElementById('details-project-name').textContent = project.name;
    
    const detailsContent = document.getElementById('project-details-content');
    detailsContent.innerHTML = `
        <div style="padding: 20px;">
            <div style="margin-bottom: 20px;">
                <h3 style="color: #87CEEB; margin-bottom: 10px;">Description</h3>
                <p style="color: rgba(255,255,255,0.8);">${project.description}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h3 style="color: #87CEEB; margin-bottom: 10px;">Project Info</h3>
                    <p><strong>Type:</strong> ${project.projectType}</p>
                    <p><strong>Status:</strong> ${project.status}</p>
                    <p><strong>Progress:</strong> ${project.progress}%</p>
                </div>
                <div>
                    <h3 style="color: #87CEEB; margin-bottom: 10px;">Timeline</h3>
                    <p><strong>Start Date:</strong> ${formatDate(project.startDate)}</p>
                    <p><strong>End Date:</strong> ${formatDate(project.endDate)}</p>
                </div>
            </div>
            
            ${project.teamMembers && project.teamMembers.length > 0 ? `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #87CEEB; margin-bottom: 10px;">Team Members</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${project.teamMembers.map(member => `<span class="team-member">${member}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${project.milestones && project.milestones.length > 0 ? `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #87CEEB; margin-bottom: 10px;">Milestones</h3>
                <div style="background: rgba(47, 27, 77, 0.6); border-radius: 8px; padding: 15px;">
                    ${project.milestones.map(milestone => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(135, 206, 235, 0.2);">
                            <div>
                                <span style="color: ${milestone.completed ? '#2ecc71' : '#f39c12'};">
                                    ${milestone.completed ? '✓' : '○'}
                                </span>
                                <span style="color: ${milestone.completed ? 'rgba(255,255,255,0.6)' : '#87CEEB'}; margin-left: 10px;">
                                    ${milestone.name}
                                </span>
                            </div>
                            <span style="color: rgba(255,255,255,0.6); font-size: 0.9rem;">
                                ${formatDate(milestone.dueDate)}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${project.notes ? `
            <div>
                <h3 style="color: #87CEEB; margin-bottom: 10px;">Notes</h3>
                <p style="color: rgba(255,255,255,0.8);">${project.notes}</p>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('project-details-modal').style.display = 'block';
}

// Enhanced form submission with milestones
function handleProjectSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Collect milestones
    const milestones = [];
    const milestoneNames = formData.getAll('milestone-name');
    const milestoneDates = formData.getAll('milestone-date');
    
    for (let i = 0; i < milestoneNames.length; i++) {
        if (milestoneNames[i] && milestoneDates[i]) {
            milestones.push({
                name: milestoneNames[i],
                dueDate: milestoneDates[i],
                completed: false
            });
        }
    }
    
    const projectData = {
        id: Date.now(), // Simple unique ID
        name: formData.get('name'),
        description: formData.get('description'),
        projectType: formData.get('projectType'),
        status: formData.get('status'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        progress: parseInt(formData.get('progress')),
        teamMembers: formData.get('teamMembers') ? 
            formData.get('teamMembers').split(',').map(m => m.trim()).filter(m => m) : [],
        milestones: milestones,
        notes: formData.get('notes'),
        createdAt: new Date().toISOString()
    };
    
    saveProject(projectData);
    hideAddProjectForm();
}

// KPI Functions - Real metrics from Teams Planner task data
function updateKPIs() {
    const tasks = JSON.parse(localStorage.getItem('rdTasks') || '[]');
    
    if (!tasks || tasks.length === 0) {
        // Reset all KPIs to 0 when no data
        document.getElementById('kpi-total-tasks').textContent = '0';
        document.getElementById('kpi-in-progress').textContent = '0';
        document.getElementById('kpi-completed-tasks').textContent = '0';
        document.getElementById('kpi-overdue-tasks').textContent = '0';
        document.getElementById('kpi-urgent-tasks').textContent = '0';
        return;
    }
    
    // Calculate real KPIs from Teams Planner task data
    const totalTasks = tasks.length;
    
    const inProgressTasks = tasks.filter(task => 
        task.progress === 'In progress'
    ).length;
    
    const completedTasks = tasks.filter(task => 
        task.progress === 'Completed'
    ).length;
    
    // Count overdue tasks (tasks with due dates that have passed and are not completed)
    const overdueTasks = tasks.filter(task => {
        if (task.progress === 'Completed') return false;
        if (!task.dueDate) return false;
        
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        
        return dueDate < today;
    }).length;
    
    // Count urgent priority tasks
    const urgentTasks = tasks.filter(task => 
        task.priority === 'Urgent'
    ).length;
    
    // Update KPI displays
    document.getElementById('kpi-total-tasks').textContent = totalTasks;
    document.getElementById('kpi-in-progress').textContent = inProgressTasks;
    document.getElementById('kpi-completed-tasks').textContent = completedTasks;
    document.getElementById('kpi-overdue-tasks').textContent = overdueTasks;
    document.getElementById('kpi-urgent-tasks').textContent = urgentTasks;
    
    // Add animation effect
    animateKPIUpdates();
}

function animateKPIUpdates() {
    const kpiNumbers = document.querySelectorAll('.kpi-number');
    kpiNumbers.forEach(number => {
        const finalValue = parseInt(number.textContent);
        let currentValue = 0;
        const increment = Math.ceil(finalValue / 20);
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            number.textContent = currentValue;
        }, 50);
    });
}

// Checklist Status Functions
function getChecklistStatus(project, checklistType) {
    const progress = project.progress || 0;
    
    switch (checklistType) {
        case 'engineering-docs':
            return progress >= 25;
        case 'alpha-prototype':
            return progress >= 50;
        case 'beta-prototype':
            return progress >= 75;
        case 'production':
            return progress >= 100 || project.status === 'completed';
        default:
            return false;
    }
}

// Clear all data function (for development/testing)
function resetData() {
    if (confirm('This will clear all data from the dashboard. Continue?')) {
        localStorage.removeItem('rdProjects');
        initializeDashboard();
        showNotification('All data cleared from dashboard', 'success');
    }
}

// Notification system for user feedback
function showNotification(message, type = 'info') {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: Inter, sans-serif;
        max-width: 350px;
        font-size: 14px;
        line-height: 1.4;
        border: 1px solid ${type === 'success' ? 'rgba(46, 204, 113, 0.3)' : type === 'error' ? 'rgba(231, 76, 60, 0.3)' : 'rgba(52, 152, 219, 0.3)'};
        animation: slideInNotification 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInNotification {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds (longer for error messages)
    const timeout = type === 'error' ? 6000 : 4000;
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInNotification 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, timeout);
}


// Future: Real-time updates when database changes
// TODO: Implement WebSocket or polling for real-time updates
