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
    startAutoRefresh();
});

// Initialize dashboard (starts empty, ready for import)
async function initializeDashboard() {
    // Load existing tasks first
    const tasks = await loadTasks();
    
    // Only try to auto-load Excel file if no existing data
    if (!tasks || tasks.length === 0) {
        const autoLoaded = await tryAutoLoadExcelFile();
        
        // If auto-load succeeded, reload tasks
        if (autoLoaded) {
            const newTasks = await loadTasks();
            displayTasks(newTasks);
            updateKPIs();
            
            // Start auto-rotation if tasks exist
            if (newTasks && newTasks.length > 0) {
                startAutoRotation(newTasks);
            } else {
                updateProgressIndicator(0, 0, 0);
            }
            return;
        }
    }
    
    // Display existing tasks or empty state
    displayTasks(tasks);
    updateKPIs();
    
    // Start auto-rotation if tasks exist
    if (tasks && tasks.length > 0) {
        startAutoRotation(tasks);
    } else {
        // Update progress indicator for empty state
        updateProgressIndicator(0, 0, 0);
    }
}

// Setup complex title animation
function setupTitleAnimation() {
    const titleLetters = document.querySelectorAll('.title-letter');
    
    // Set CSS custom property for each letter to create staggered animation
    titleLetters.forEach((letter, index) => {
        letter.style.setProperty('--letter-index', index);
        
        // Add random particle generation on hover
        letter.addEventListener('mouseenter', function() {
            createParticleBurst(this);
        });
        
        // Add click effect
        letter.addEventListener('click', function() {
            createClickRipple(this);
        });
    });
    
    // Create floating particles around the title
    createFloatingParticles();
}

// Create particle burst effect on letter hover
function createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'burst-particle';
        particle.style.cssText = `
            position: fixed;
            width: 3px;
            height: 3px;
            background: linear-gradient(45deg, #6366f1, #8b5cf6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${centerX}px;
            top: ${centerY}px;
            animation: burstParticle 1s ease-out forwards;
        `;
        
        // Random direction and distance
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        particle.style.setProperty('--end-x', `${endX}px`);
        particle.style.setProperty('--end-y', `${endY}px`);
        
        document.body.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
}

// Create click ripple effect
function createClickRipple(element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(99, 102, 241, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${rect.left + rect.width / 2 - 10}px;
        top: ${rect.top + rect.height / 2 - 10}px;
        animation: rippleExpand 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Create floating particles around the title
function createFloatingParticles() {
    const title = document.querySelector('.dashboard-title');
    if (!title) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'floating-particles';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    `;
    
    // Create multiple floating particles
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, #6366f1, #8b5cf6);
            border-radius: 50%;
            opacity: 0.6;
            animation: floatAround 8s linear infinite;
            animation-delay: ${i * 1.6}s;
        `;
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        particleContainer.appendChild(particle);
    }
    
    title.appendChild(particleContainer);
}

// Auto-rotation system for kiosk mode
let currentTaskIndex = 0;
let rotationInterval = null;
let rotationSpeed = 20000; // 20 seconds per task

function startAutoRotation(tasks) {
    // Clear any existing rotation
    stopAutoRotation();
    
    // Show 6 tasks at a time
    displayTaskSet(tasks, 0);
    
    // Start the rotation timer
    rotationInterval = setInterval(() => {
        currentTaskIndex = (currentTaskIndex + 6) % tasks.length;
        displayTaskSet(tasks, currentTaskIndex);
    }, rotationSpeed);
}

function stopAutoRotation() {
    if (rotationInterval) {
        clearInterval(rotationInterval);
        rotationInterval = null;
    }
}

function displayTaskSet(tasks, startIndex) {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!tasks || tasks.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h3>No Tasks Found</h3>
                <p>Your dashboard is empty and ready for your Teams Planner data!</p>
            </div>
        `;
        updateProgressIndicator(0, 0, 0);
        return;
    }
    
    // Clear grid
    projectsGrid.innerHTML = '';
    
    // Show 6 tasks starting from the current index
    for (let i = 0; i < 6; i++) {
        const taskIndex = (startIndex + i) % tasks.length;
        const task = tasks[taskIndex];
        
        if (task) {
            const taskCard = createTaskCard(task);
            taskCard.style.opacity = '0';
            taskCard.style.transform = 'translateY(20px)';
            projectsGrid.appendChild(taskCard);
            
            // Staggered animation for each card
            setTimeout(() => {
                taskCard.style.transition = 'all 0.5s ease-out';
                taskCard.style.opacity = '1';
                taskCard.style.transform = 'translateY(0)';
            }, i * 100);
        }
    }
    
    // Update progress indicator
    updateProgressIndicator(tasks.length, startIndex, 6);
}

function updateProgressIndicator(totalTasks, startIndex, tasksPerSet) {
    // Update the current range display
    const currentRange = document.getElementById('current-range');
    const totalTasksCount = document.getElementById('total-tasks-count');
    const progressDots = document.getElementById('progress-dots');
    
    if (!totalTasks || totalTasks === 0) {
        currentRange.textContent = 'No Tasks';
        totalTasksCount.textContent = '0';
        progressDots.innerHTML = '';
        return;
    }
    
    // Calculate the current range
    const startTask = startIndex + 1;
    const endTask = Math.min(startIndex + tasksPerSet, totalTasks);
    currentRange.textContent = `Tasks ${startTask}-${endTask}`;
    
    // Update total tasks count
    totalTasksCount.textContent = totalTasks.toString();
    
    // Calculate number of sets
    const totalSets = Math.ceil(totalTasks / tasksPerSet);
    const currentSet = Math.floor(startIndex / tasksPerSet);
    
    // Generate progress dots
    progressDots.innerHTML = '';
    for (let i = 0; i < totalSets; i++) {
        const dot = document.createElement('div');
        dot.className = `progress-dot ${i === currentSet ? 'active' : ''}`;
        progressDots.appendChild(dot);
    }
}


// Kiosk Mode Toggle
function toggleKioskMode() {
    const body = document.body;
    const isKioskMode = body.classList.contains('kiosk-mode-active');
    
    if (isKioskMode) {
        // Exit kiosk mode
        body.classList.remove('kiosk-mode-active');
        document.exitFullscreen?.();
        showNotification('Exited Kiosk Mode', 'info');
    } else {
        // Enter kiosk mode
        body.classList.add('kiosk-mode-active');
        
        // Try to enter fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        
        showNotification('Entered Kiosk Mode - Auto-rotating through tasks', 'success');
        
        // Start auto-rotation if not already running
        const tasks = getTasks();
        if (tasks.length > 0 && !rotationInterval) {
            startAutoRotation(tasks);
        }
    }
}

// Auto-refresh data every 5 minutes
function startAutoRefresh() {
    setInterval(async () => {
        const tasks = await loadTasks();
        if (tasks.length > 0) {
            // Update display if rotation is active
            if (rotationInterval) {
                displaySingleTask(tasks, currentTaskIndex);
                updateKPIs();
            }
        }
    }, 5 * 60 * 1000); // 5 minutes
}

// Setup event listeners
function setupEventListeners() {
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
    
    // Calculate completion percentage based on bucket
    const completionPercentage = getCompletionPercentage(task.bucketName);
    
    card.innerHTML = `
        ${completionPercentage !== null ? `
        <div class="card-progress-bar" style="--progress: ${completionPercentage}%">
            <div class="card-progress-fill"></div>
        </div>
        ` : ''}
        
        <div class="task-header">
            <div class="task-title">${task.taskName}</div>
            <div class="task-status ${statusClass}">${statusText}</div>
        </div>
        
        
        <div class="task-bucket">
            <span class="bucket-label">Bucket:</span>
            <span class="bucket-name">${task.bucketName}</span>
        </div>
        
        ${completionPercentage !== null ? `
        <div class="task-progress-text">
            <span class="progress-text">Progress: ${completionPercentage}%</span>
        </div>
        ` : ''}
        
        <div class="task-priority priority-${priorityClass}">
            Priority: ${task.priority}
            </div>
        
        <div class="task-assignment">
            <span class="assigned-label">Assigned to:</span>
            <span class="assigned-to">${task.assignedTo || 'Unassigned'}</span>
        </div>
        
        <div class="task-due-date">
            <span class="due-label">Due:</span>
            <span class="due-value ${isLate ? 'late' : ''}">${dueDate}</span>
            ${lateIndicator}
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
        
    `;
    
    return card;
}

// Get completion percentage based on bucket name
function getCompletionPercentage(bucketName) {
    if (!bucketName) return null;
    
    const bucket = bucketName.toLowerCase();
    
    // Check for N/A cases first
    if (bucket.includes('production based') || bucket.includes('in house')) {
        return null; // N/A - don't show progress bar
    }
    
    // Map bucket names to completion percentages
    if (bucket.includes('all potential') || bucket.includes('potential')) {
        return 0;
    } else if (bucket.includes('research')) {
        return 10;
    } else if (bucket.includes('in progress') || bucket.includes('progress')) {
        return 30;
    } else if (bucket.includes('production handover') || bucket.includes('handover')) {
        return 80;
    }
    
    // Default fallback
    return null;
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

// Flag to prevent multiple simultaneous auto-load attempts
let autoLoadInProgress = false;

// Try to auto-load the Excel file from the same folder as index.html (works locally and on GitHub Pages)
async function tryAutoLoadExcelFile() {
    // Prevent multiple simultaneous attempts
    if (autoLoadInProgress) {
        console.log('Auto-load: Already in progress, skipping');
        return false;
    }
    
    autoLoadInProgress = true;
    
    try {
        // Build a URL-encoded path so spaces and & are handled correctly
        const fileName = 'R&D Project Management .xlsx';
        const fileUrl = './' + encodeURIComponent(fileName);

        // Attempt to fetch the Excel file sitting next to index.html
        const response = await fetch(fileUrl, { cache: 'no-cache' });

        if (!response.ok) {
            console.log('Auto-load: Excel file not found at', fileUrl);
            return false;
        }

        // Convert response to array buffer
        const arrayBuffer = await response.arrayBuffer();

        // Import the Excel file
        await importFromExcel(arrayBuffer, '.xlsx');

        console.log('Auto-load: Successfully loaded Excel file');
        return true;

    } catch (error) {
        console.log('Auto-load: Could not load Excel file:', error.message);
        return false;
    } finally {
        autoLoadInProgress = false;
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
        
        // Confirm import - warn about replacing all data (disabled per request)
        // const confirmMessage = `This will REPLACE ALL current data with ${importedTasks.length} tasks from Teams Planner.\n\nAre you sure you want to continue?`;
        // if (confirm(confirmMessage)) {
        // Clear all existing data and save only imported tasks
        localStorage.setItem('rdTasks', JSON.stringify(importedTasks));

        // Refresh dashboard with new data
        initializeDashboard();

        // Start auto-rotation with new data
        if (importedTasks.length > 0) {
            startAutoRotation(importedTasks);
        }

        const message = `Successfully imported ${importedTasks.length} tasks from Teams Planner! Auto-rotation started.`;
        showNotification(message, 'success');
        // }
        
    } catch (error) {
        showNotification(`Import failed: ${error.message}`, 'error');
    }
}


// Reports Functions
function showReports() {
    // Navigate to the reports page
    window.location.href = 'reports.html';
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
        document.getElementById('kpi-not-started').textContent = '0';
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
    
    // Count not started tasks
    const notStartedTasks = tasks.filter(task => 
        task.progress === 'Not started'
    ).length;
    
    // Update KPI displays
    document.getElementById('kpi-total-tasks').textContent = totalTasks;
    document.getElementById('kpi-in-progress').textContent = inProgressTasks;
    document.getElementById('kpi-completed-tasks').textContent = completedTasks;
    document.getElementById('kpi-overdue-tasks').textContent = overdueTasks;
    document.getElementById('kpi-urgent-tasks').textContent = urgentTasks;
    document.getElementById('kpi-not-started').textContent = notStartedTasks;
    
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
