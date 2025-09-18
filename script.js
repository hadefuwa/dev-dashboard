// R&D Dashboard JavaScript
// TODO: Implement shared database integration
// Options: JSONBin.io, Firebase, or Supabase for shared data storage
// For now, using LocalStorage for development/testing

// Sample data with more projects to populate KPIs with realistic numbers
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
        teamMembers: ["Jack", "Ben", "Maciej"],
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
        teamMembers: ["Abdullah", "Paul", "Hamed"],
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
        teamMembers: ["Jack", "Abdullah", "Ben"],
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
        teamMembers: ["Maciej", "Paul", "Hamed"],
        notes: "Currently on hold pending funding approval for next phase",
        milestones: [
            { name: "Concept Design", dueDate: "2024-01-31", completed: true },
            { name: "Component Development", dueDate: "2024-05-31", completed: false },
            { name: "Integration Testing", dueDate: "2024-08-31", completed: false }
        ]
    },
    // COMPLETED PROJECTS (to show in "Completed This Year" KPI)
    {
        id: 5,
        name: "Smart Sensors Network",
        description: "Development of wireless sensor network for industrial monitoring",
        projectType: "large",
        status: "completed",
        startDate: "2023-09-01",
        endDate: "2024-05-15",
        progress: 100,
        teamMembers: ["Ben", "Maciej", "Jack"],
        notes: "Successfully deployed across 3 manufacturing facilities",
        completedDate: "2024-05-15",
        milestones: [
            { name: "PI Form Submission", dueDate: "2023-10-15", completed: true },
            { name: "Prototype Testing", dueDate: "2024-01-31", completed: true },
            { name: "Final Deployment", dueDate: "2024-05-15", completed: true }
        ]
    },
    {
        id: 6,
        name: "Energy Efficiency Audit",
        description: "Comprehensive energy audit and optimization recommendations",
        projectType: "small",
        status: "completed",
        startDate: "2024-01-10",
        endDate: "2024-07-30",
        progress: 100,
        teamMembers: ["Abdullah", "Paul"],
        notes: "Achieved 15% energy reduction across all facilities",
        completedDate: "2024-07-30",
        milestones: [
            { name: "Data Collection", dueDate: "2024-03-15", completed: true },
            { name: "Analysis Report", dueDate: "2024-06-30", completed: true },
            { name: "Implementation Plan", dueDate: "2024-07-30", completed: true }
        ]
    },
    {
        id: 7,
        name: "Process Automation Study",
        description: "Analysis of automation opportunities in manufacturing processes",
        projectType: "small",
        status: "completed",
        startDate: "2024-03-01",
        endDate: "2024-08-15",
        progress: 100,
        teamMembers: ["Hamed", "Jack"],
        notes: "Identified 12 key automation opportunities with ROI projections",
        completedDate: "2024-08-15",
        milestones: [
            { name: "PI Documentation", dueDate: "2024-03-15", completed: true },
            { name: "Process Mapping", dueDate: "2024-05-30", completed: true },
            { name: "Final Recommendations", dueDate: "2024-08-15", completed: true }
        ]
    },
    // OVERDUE PROJECTS (to show in "Overdue Projects" KPI)
    {
        id: 8,
        name: "Legacy System Migration",
        description: "Migration of legacy control systems to modern platforms",
        projectType: "large",
        status: "active",
        startDate: "2023-10-01",
        endDate: "2024-06-30", // This is overdue
        progress: 75,
        teamMembers: ["Paul", "Ben", "Abdullah"],
        notes: "Delayed due to compatibility issues with existing hardware",
        milestones: [
            { name: "System Analysis", dueDate: "2023-12-31", completed: true },
            { name: "Migration Plan", dueDate: "2024-03-31", completed: true },
            { name: "Testing Phase", dueDate: "2024-05-31", completed: false },
            { name: "Final Deployment", dueDate: "2024-06-30", completed: false }
        ]
    },
    {
        id: 9,
        name: "Quality Control Improvement",
        description: "Implementation of advanced quality control measures",
        projectType: "small",
        status: "active",
        startDate: "2024-01-01",
        endDate: "2024-07-31", // This is overdue
        progress: 60,
        teamMembers: ["Maciej", "Hamed"],
        notes: "Waiting for new equipment delivery to complete implementation",
        milestones: [
            { name: "Current State Analysis", dueDate: "2024-02-29", completed: true },
            { name: "New Procedures Design", dueDate: "2024-05-31", completed: true },
            { name: "Implementation", dueDate: "2024-07-31", completed: false }
        ]
    },
    // UNSTARTED PROJECTS (to show in "Unstarted Projects" KPI)
    {
        id: 10,
        name: "Next-Gen Materials Research",
        description: "Research into advanced composite materials for aerospace applications",
        projectType: "large",
        status: "active",
        startDate: "2024-10-01", // Future start date
        endDate: "2025-08-31",
        progress: 0,
        teamMembers: ["Jack", "Ben", "Abdullah"],
        notes: "Waiting for lab equipment installation and team expansion",
        milestones: [
            { name: "Lab Setup", dueDate: "2024-11-30", completed: false },
            { name: "Initial Testing", dueDate: "2025-02-28", completed: false },
            { name: "Material Validation", dueDate: "2025-06-30", completed: false },
            { name: "Final Report", dueDate: "2025-08-31", completed: false }
        ]
    },
    {
        id: 11,
        name: "Digital Twin Development",
        description: "Development of digital twin models for manufacturing processes",
        projectType: "large",
        status: "active",
        startDate: "2024-11-15", // Future start date
        endDate: "2025-12-31",
        progress: 0,
        teamMembers: ["Maciej", "Paul", "Hamed"],
        notes: "Project approved, waiting for resource allocation",
        milestones: [
            { name: "PI Form Completion", dueDate: "2024-12-15", completed: false },
            { name: "Modeling Framework", dueDate: "2025-04-30", completed: false },
            { name: "Integration Testing", dueDate: "2025-09-30", completed: false },
            { name: "Production Deployment", dueDate: "2025-12-31", completed: false }
        ]
    },
    // ADDITIONAL PROJECTS WITH PI FORMS (to show in "PI Forms Completed" KPI)
    {
        id: 12,
        name: "Safety Protocol Enhancement",
        description: "Enhancement of workplace safety protocols and training programs",
        projectType: "small",
        status: "active",
        startDate: "2024-04-01",
        endDate: "2024-12-15",
        progress: 70,
        teamMembers: ["Abdullah", "Paul"],
        notes: "New safety protocols showing 25% reduction in incidents",
        milestones: [
            { name: "PI Risk Assessment", dueDate: "2024-04-15", completed: true },
            { name: "Protocol Development", dueDate: "2024-07-31", completed: true },
            { name: "Training Implementation", dueDate: "2024-10-31", completed: false },
            { name: "Final Evaluation", dueDate: "2024-12-15", completed: false }
        ]
    },
    {
        id: 13,
        name: "Environmental Impact Study",
        description: "Comprehensive study of environmental impact and sustainability measures",
        projectType: "small",
        status: "active",
        startDate: "2024-05-01",
        endDate: "2024-11-30",
        progress: 55,
        teamMembers: ["Hamed", "Ben"],
        notes: "Preliminary results show potential for 20% waste reduction",
        milestones: [
            { name: "PI Environmental Assessment", dueDate: "2024-05-15", completed: true },
            { name: "Data Collection", dueDate: "2024-08-31", completed: true },
            { name: "Impact Analysis", dueDate: "2024-10-31", completed: false },
            { name: "Recommendations Report", dueDate: "2024-11-30", completed: false }
        ]
    },
    // NEW PROJECTS REQUESTED
    {
        id: 14,
        name: "Wind Tunnel",
        description: "Design and construction of advanced wind tunnel facility for aerodynamic testing",
        projectType: "large",
        status: "active",
        startDate: "2024-03-01",
        endDate: "2025-06-30",
        progress: 35,
        teamMembers: ["Jack", "Ben", "Maciej", "Paul"],
        notes: "Subsonic wind tunnel with 2m x 1.5m test section, max speed 80 m/s. Critical for aerospace component testing.",
        milestones: [
            { name: "Design Phase", dueDate: "2024-06-30", completed: true },
            { name: "Foundation Construction", dueDate: "2024-09-30", completed: true },
            { name: "Fan System Installation", dueDate: "2024-12-31", completed: false },
            { name: "Calibration & Testing", dueDate: "2025-03-31", completed: false },
            { name: "Facility Commissioning", dueDate: "2025-06-30", completed: false }
        ]
    },
    {
        id: 15,
        name: "Smart Factory 2",
        description: "Next generation smart manufacturing system with AI-driven production optimization",
        projectType: "large",
        status: "active",
        startDate: "2024-06-01",
        endDate: "2025-11-30",
        progress: 25,
        teamMembers: ["Abdullah", "Hamed", "Paul", "Ben"],
        notes: "Industry 4.0 implementation with IoT sensors, digital twins, and predictive maintenance across entire production line.",
        milestones: [
            { name: "System Architecture Design", dueDate: "2024-08-31", completed: true },
            { name: "IoT Sensor Deployment", dueDate: "2024-11-30", completed: false },
            { name: "AI Algorithm Development", dueDate: "2025-03-31", completed: false },
            { name: "Integration Testing", dueDate: "2025-08-31", completed: false },
            { name: "Full Production Rollout", dueDate: "2025-11-30", completed: false }
        ]
    },
    {
        id: 16,
        name: "AU0205 HMI",
        description: "Human Machine Interface development for AU0205 control system upgrade",
        projectType: "small",
        status: "active",
        startDate: "2024-07-15",
        endDate: "2024-12-20",
        progress: 60,
        teamMembers: ["Maciej", "Hamed"],
        notes: "Touch screen interface replacement for legacy AU0205 system. Improved operator experience and diagnostic capabilities.",
        milestones: [
            { name: "Requirements Analysis", dueDate: "2024-08-15", completed: true },
            { name: "UI/UX Design", dueDate: "2024-09-30", completed: true },
            { name: "Software Development", dueDate: "2024-11-15", completed: false },
            { name: "System Integration", dueDate: "2024-12-20", completed: false }
        ]
    },
    {
        id: 17,
        name: "EM Test Jig",
        description: "Electromagnetic compatibility test jig for electronic component validation",
        projectType: "small",
        status: "active",
        startDate: "2024-08-01",
        endDate: "2025-01-31",
        progress: 40,
        teamMembers: ["Jack", "Abdullah"],
        notes: "Custom test fixture for EMC compliance testing per IEC 61000 standards. Supports frequency range 10 kHz to 40 GHz.",
        milestones: [
            { name: "Mechanical Design", dueDate: "2024-09-30", completed: true },
            { name: "Electrical Integration", dueDate: "2024-11-30", completed: false },
            { name: "Calibration & Validation", dueDate: "2025-01-15", completed: false },
            { name: "Documentation Complete", dueDate: "2025-01-31", completed: false }
        ]
    }
];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
});

// Initialize dashboard with sample data
async function initializeDashboard() {
    // Always load the correct sample projects with proper team members
    // This ensures team member names are always correct
    localStorage.setItem('rdProjects', JSON.stringify(sampleProjects));
    
    // Load and display projects
    const projects = await loadProjects();
    displayProjects(projects);
    updateKPIs();
    
    // Enable horizontal scrolling animation
    enableProjectScrolling();
    
    // Add navigation arrows (optional - can be removed if not wanted)
    addScrollNavigation();
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
    return projects; // Return the projects array
}

// Get projects without displaying them (for export/import)
function getProjects() {
    return JSON.parse(localStorage.getItem('rdProjects') || '[]');
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
                <div class="progress-percentage">${project.progress}%</div>
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
        
        <div class="project-checklist">
            <div class="checklist-label">Project Checklist</div>
            <div class="checklist-items">
                <div class="checklist-item">
                    <input type="checkbox" ${getChecklistStatus(project, 'engineering-docs') ? 'checked' : ''} disabled>
                    <label>Engineering Docs</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" ${getChecklistStatus(project, 'alpha-prototype') ? 'checked' : ''} disabled>
                    <label>Alpha Prototype</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" ${getChecklistStatus(project, 'beta-prototype') ? 'checked' : ''} disabled>
                    <label>Beta Prototype</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" ${getChecklistStatus(project, 'production') ? 'checked' : ''} disabled>
                    <label>Production</label>
                </div>
            </div>
        </div>
        
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
    
    // Update KPIs
    updateKPIs();
    
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
        updateKPIs();
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
// Export data function
function exportData() {
    try {
        const projects = getProjects();
        
        // Ensure projects is an array
        if (!Array.isArray(projects)) {
            throw new Error('No valid projects data found');
        }
        
        // Create Excel-compatible CSV export
        const csvContent = DataUtils.exportToCSV(projects);
        const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const csvUrl = URL.createObjectURL(csvBlob);
        const csvLink = document.createElement('a');
        csvLink.href = csvUrl;
        csvLink.download = `rd-dashboard-projects-${new Date().toISOString().split('T')[0]}.csv`;
        csvLink.click();
        URL.revokeObjectURL(csvUrl);
        
        showNotification('Data exported to Excel format! You can now edit it in Excel and import it back.', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification(`Export failed: ${error.message}`, 'error');
    }
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
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            
            // Check file type
            if (file.name.toLowerCase().endsWith('.csv')) {
                importFromCSV(content);
            } else {
                showNotification('Please use CSV files for import. Excel files (.xlsx, .xls) are not supported yet.', 'error');
                return;
            }
        } catch (error) {
            showNotification(`Import failed: ${error.message}`, 'error');
        }
    };
    
    reader.readAsText(file);
}

// Import from CSV content
function importFromCSV(csvContent) {
    try {
        const importedProjects = DataUtils.importFromCSV(csvContent);
        
        if (importedProjects.length === 0) {
            showNotification('No valid projects found in the CSV file.', 'error');
            return;
        }
        
        // Validate imported data
        const validProjects = [];
        const errors = [];
        
        importedProjects.forEach((project, index) => {
            const validationErrors = DataUtils.validateProjectData(project);
            if (validationErrors.length === 0) {
                validProjects.push(DataUtils.sanitizeProjectData(project));
            } else {
                errors.push(`Row ${index + 2}: ${validationErrors.join(', ')}`);
            }
        });
        
        if (validProjects.length === 0) {
            showNotification('No valid projects found. Please check your CSV format.', 'error');
            return;
        }
        
        // Confirm import
        const confirmMessage = `Import ${validProjects.length} projects?${errors.length > 0 ? `\n\n${errors.length} rows had errors and will be skipped.` : ''}`;
        if (confirm(confirmMessage)) {
            // Save imported projects
            localStorage.setItem('rdProjects', JSON.stringify(validProjects));
            
            // Refresh dashboard
            initializeDashboard();
            
            const message = `Successfully imported ${validProjects.length} projects.${errors.length > 0 ? ` ${errors.length} rows were skipped due to errors.` : ''}`;
            showNotification(message, 'success');
        }
        
    } catch (error) {
        showNotification(`Import failed: ${error.message}`, 'error');
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

// KPI Functions
function updateKPIs() {
    const projects = JSON.parse(localStorage.getItem('rdProjects') || '[]');
    
    // Calculate KPIs
    const runningProjects = projects.filter(p => p.status === 'active').length;
    const completedThisYear = projects.filter(p => {
        if (p.status !== 'completed') return false;
        // Use completedDate if available, otherwise use endDate
        const completedDate = new Date(p.completedDate || p.endDate);
        const currentYear = new Date().getFullYear();
        return completedDate.getFullYear() === currentYear;
    }).length;
    
    const overdueProjects = projects.filter(p => {
        if (p.status === 'completed') return false;
        const endDate = new Date(p.endDate);
        const today = new Date();
        return endDate < today;
    }).length;
    
    const unstartedProjects = projects.filter(p => {
        if (p.status === 'completed') return false;
        const startDate = new Date(p.startDate);
        const today = new Date();
        return startDate > today;
    }).length;
    
    const piFormsCompleted = projects.filter(p => {
        // Count projects that have milestones with "PI" in the name
        return p.milestones && p.milestones.some(m => 
            m.name.toLowerCase().includes('pi') && m.completed
        );
    }).length;
    
    // Update KPI displays
    document.getElementById('kpi-running-projects').textContent = runningProjects;
    document.getElementById('kpi-completed-this-year').textContent = completedThisYear;
    document.getElementById('kpi-overdue-projects').textContent = overdueProjects;
    document.getElementById('kpi-unstarted-projects').textContent = unstartedProjects;
    document.getElementById('kpi-pi-forms-completed').textContent = piFormsCompleted;
    
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

// Reset data function (for development/testing)
function resetData() {
    if (confirm('This will reset all data to the default sample projects. Continue?')) {
        localStorage.removeItem('rdProjects');
        initializeDashboard();
        showNotification('Data reset to default sample projects', 'success');
    }
}

// Notification system for user feedback
function showNotification(message, type = 'info') {
    // Simple notification - can be enhanced with a proper notification library later
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: Inter, sans-serif;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 4000);
}

// Enable horizontal scrolling animation for project grids
function enableProjectScrolling() {
    const projectGrids = document.querySelectorAll('.projects-grid');
    
    projectGrids.forEach(grid => {
        // Add auto-scroll class for animation
        grid.classList.add('auto-scroll');
        
        // Pause animation when user manually scrolls
        let scrollTimeout;
        grid.addEventListener('scroll', function() {
            grid.classList.remove('auto-scroll');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                grid.classList.add('auto-scroll');
            }, 3000); // Resume animation after 3 seconds of no manual scrolling
        });
        
        // Pause animation on mouse enter, resume on mouse leave
        grid.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        grid.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    });
}

// Add navigation arrows for better UX (optional enhancement)
function addScrollNavigation() {
    const sections = document.querySelectorAll('.large-projects-section, .small-projects-section');
    
    sections.forEach(section => {
        const grid = section.querySelector('.projects-grid');
        if (!grid) return;
        
        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.style.cssText = `
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;
        
        // Create left arrow
        const leftArrow = document.createElement('button');
        leftArrow.innerHTML = '←';
        leftArrow.style.cssText = `
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid rgba(99, 102, 241, 0.4);
            color: #6366f1;
            padding: 10px 15px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 18px;
            transition: all 0.2s ease;
        `;
        
        // Create right arrow
        const rightArrow = document.createElement('button');
        rightArrow.innerHTML = '→';
        rightArrow.style.cssText = leftArrow.style.cssText;
        
        // Add hover effects
        [leftArrow, rightArrow].forEach(arrow => {
            arrow.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(99, 102, 241, 0.4)';
                this.style.transform = 'scale(1.1)';
            });
            
            arrow.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(99, 102, 241, 0.2)';
                this.style.transform = 'scale(1)';
            });
        });
        
        // Add click functionality
        leftArrow.addEventListener('click', () => {
            grid.scrollBy({ left: -370, behavior: 'smooth' });
        });
        
        rightArrow.addEventListener('click', () => {
            grid.scrollBy({ left: 370, behavior: 'smooth' });
        });
        
        // Insert navigation
        const header = section.querySelector('.section-header');
        if (header) {
            navContainer.appendChild(leftArrow);
            navContainer.appendChild(rightArrow);
            header.parentNode.insertBefore(navContainer, grid);
        }
    });
}

// Future: Real-time updates when database changes
// TODO: Implement WebSocket or polling for real-time updates
