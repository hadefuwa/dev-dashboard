// R&D Dashboard JavaScript
// TODO: Implement shared database integration
// Options: JSONBin.io, Firebase, or Supabase for shared data storage
// For now, using LocalStorage for development/testing

// Sample data for the 4 large projects with milestones
const sampleProjects = [
    {
        id: 1,
        name: "Thermal Dynamics",
        description: "Advanced thermal analysis and optimization research for industrial applications",
        projectType: "large",
        status: "active",
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        progress: 65,
        teamMembers: ["Dr. Sarah Johnson", "Mike Chen", "Alex Rodriguez"],
        notes: "Focus on heat transfer optimization and energy efficiency improvements",
        milestones: [
            { name: "Initial Research Phase", dueDate: "2024-03-31", completed: true },
            { name: "Prototype Development", dueDate: "2024-06-30", completed: true },
            { name: "Testing & Validation", dueDate: "2024-09-30", completed: false },
            { name: "Final Report", dueDate: "2024-12-31", completed: false }
        ]
    },
    {
        id: 2,
        name: "Structures",
        description: "Structural engineering and material science projects for next-generation construction",
        projectType: "large",
        status: "active",
        startDate: "2024-02-01",
        endDate: "2024-11-30",
        progress: 45,
        teamMembers: ["Dr. Emily Watson", "James Liu", "Maria Garcia"],
        notes: "Investigating new composite materials and structural integrity testing",
        milestones: [
            { name: "Material Analysis", dueDate: "2024-04-30", completed: true },
            { name: "Design Phase", dueDate: "2024-07-31", completed: false },
            { name: "Construction Testing", dueDate: "2024-10-31", completed: false }
        ]
    },
    {
        id: 3,
        name: "Industrial Maintenance",
        description: "Maintenance optimization and predictive analytics for industrial equipment",
        projectType: "large",
        status: "active",
        startDate: "2024-07-01",
        endDate: "2025-10-15",
        progress: 80,
        teamMembers: ["Robert Kim", "Lisa Thompson", "David Park"],
        notes: "Implementing AI-driven predictive maintenance algorithms",
        milestones: [
            { name: "Algorithm Development", dueDate: "2024-03-31", completed: true },
            { name: "System Integration", dueDate: "2024-06-30", completed: true },
            { name: "Field Testing", dueDate: "2024-09-30", completed: false },
            { name: "Deployment", dueDate: "2024-10-15", completed: false }
        ]
    },
    {
        id: 4,
        name: "Eblocks 3",
        description: "Next generation electronic building blocks development for modular systems",
        projectType: "large",
        status: "paused",
        startDate: "2023-11-01",
        endDate: "2024-08-31",
        progress: 30,
        teamMembers: ["Dr. Alan Foster", "Jennifer Lee", "Tom Wilson"],
        notes: "Currently on hold pending funding approval for next phase",
        milestones: [
            { name: "Concept Design", dueDate: "2024-01-31", completed: true },
            { name: "Component Development", dueDate: "2024-05-31", completed: false },
            { name: "Integration Testing", dueDate: "2024-08-31", completed: false }
        ]
    }
];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadProjects();
});

// Initialize dashboard with sample data
function initializeDashboard() {
    // Check if we have any projects stored, if not, load sample data
    const storedProjects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
    if (storedProjects.length === 0) {
        localStorage.setItem('rdProjects', JSON.stringify(sampleProjects));
    }
}

// Setup event listeners
function setupEventListeners() {
    // Project form submission
    document.getElementById('project-form').addEventListener('submit', handleProjectSubmit);
    
    // Progress slider
    document.getElementById('progress').addEventListener('input', function() {
        document.getElementById('progress-value').textContent = this.value + '%';
    });
    
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
        const projectModal = document.getElementById('project-form-modal');
        const detailsModal = document.getElementById('project-details-modal');
        
        if (event.target === projectModal) {
            hideAddProjectForm();
        }
        if (event.target === detailsModal) {
            hideProjectDetails();
        }
    });
}

// Future: Load all projects from shared database
async function loadProjects() {
    // TODO: Replace with actual database call
    // For now, load from LocalStorage for development
    const projects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
    displayProjects(projects);
}

// Display projects on the dashboard
function displayProjects(projects) {
    const largeGrid = document.getElementById('large-projects-grid');
    const smallGrid = document.getElementById('small-projects-grid');
    
    // Clear existing projects
    largeGrid.innerHTML = '';
    smallGrid.innerHTML = '';
    
    // Separate large and small projects
    const largeProjects = projects.filter(p => p.projectType === 'large');
    const smallProjects = projects.filter(p => p.projectType === 'small');
    
    // Display large projects
    largeProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        largeGrid.appendChild(projectCard);
    });
    
    // Display small projects
    smallProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        smallGrid.appendChild(projectCard);
    });
}

// Create a project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = `project-card ${project.projectType}`;
    
    // Calculate days remaining
    const endDate = new Date(project.endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    card.innerHTML = `
        <div class="project-header">
            <div>
                <div class="project-name">${project.name}</div>
                <div class="project-type-badge ${project.projectType}">${project.projectType}</div>
            </div>
            <div class="project-status status-${project.status}">${project.status}</div>
        </div>
        
        <div class="project-description">${project.description}</div>
        
        <div class="project-dates">
            <span>Start: ${formatDate(project.startDate)}</span>
            <span>End: ${formatDate(project.endDate)}</span>
        </div>
        
        <div class="progress-container">
            <div class="progress-label">
                <span>Progress</span>
                <span>${project.progress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.progress}%"></div>
            </div>
        </div>
        
        ${project.teamMembers && project.teamMembers.length > 0 ? `
        <div class="team-members">
            <div class="team-label">Team Members</div>
            <div class="team-list">
                ${project.teamMembers.map(member => `<span class="team-member">${member}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="project-actions">
            <button class="action-btn edit" onclick="viewProjectDetails(${project.id})">View Details</button>
            <button class="action-btn edit" onclick="editProject(${project.id})">Edit</button>
            <button class="action-btn delete" onclick="deleteProject(${project.id})">Delete</button>
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

// Show add project form
function showAddProjectForm() {
    document.getElementById('project-form-modal').style.display = 'block';
    // Set default start date to today
    document.getElementById('start-date').value = new Date().toISOString().split('T')[0];
}

// Hide add project form
function hideAddProjectForm() {
    document.getElementById('project-form-modal').style.display = 'none';
    document.getElementById('project-form').reset();
    document.getElementById('progress-value').textContent = '0%';
}

// Handle project form submission
function handleProjectSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
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
        notes: formData.get('notes'),
        createdAt: new Date().toISOString()
    };
    
    saveProject(projectData);
    hideAddProjectForm();
}

// Future: Save project to shared database
async function saveProject(projectData) {
    // TODO: Replace with actual database call
    // For now, save to LocalStorage for development
    const projects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
    projects.push(projectData);
    localStorage.setItem('rdProjects', JSON.stringify(projects));
    
    // Reload and display projects
    loadProjects();
    
    // Show success message
    alert('Project saved successfully!');
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

// Edit project (placeholder)
function editProject(projectId) {
    alert('Edit functionality will be implemented in the next version!');
}

// Delete project
function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        const projects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
        const filteredProjects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('rdProjects', JSON.stringify(filteredProjects));
        loadProjects();
        alert('Project deleted successfully!');
    }
}

// Apply filter
function applyFilter(filter) {
    const projects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
    let filteredProjects = projects;
    
    switch(filter) {
        case 'large':
            filteredProjects = projects.filter(p => p.projectType === 'large');
            break;
        case 'small':
            filteredProjects = projects.filter(p => p.projectType === 'small');
            break;
        case 'active':
            filteredProjects = projects.filter(p => p.status === 'active');
            break;
        case 'completed':
            filteredProjects = projects.filter(p => p.status === 'completed');
            break;
        case 'all':
        default:
            filteredProjects = projects;
            break;
    }
    
    displayProjects(filteredProjects);
}

// Enhanced export data with multiple formats
function exportData() {
    const projects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
    
    // Show export options
    const exportType = confirm('Click OK for JSON backup, Cancel for CSV export');
    
    if (exportType) {
        // JSON Export
        const data = DataUtils.createBackup();
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rd-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert('JSON backup exported successfully!');
    } else {
        // CSV Export
        const csvContent = DataUtils.exportToCSV(projects);
        const blob = new Blob([csvContent], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rd-dashboard-projects-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        alert('CSV export completed successfully!');
    }
}

// Milestone Management Functions
function addMilestone() {
    const container = document.getElementById('milestones-container');
    const milestoneItem = document.createElement('div');
    milestoneItem.className = 'milestone-item';
    milestoneItem.innerHTML = `
        <input type="text" name="milestone-name" placeholder="Milestone name" class="milestone-input">
        <input type="date" name="milestone-date" class="milestone-date">
        <button type="button" class="btn-remove-milestone" onclick="removeMilestone(this)">×</button>
    `;
    container.appendChild(milestoneItem);
}

function removeMilestone(button) {
    button.parentElement.remove();
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

// Future: Real-time updates when database changes
// TODO: Implement WebSocket or polling for real-time updates
