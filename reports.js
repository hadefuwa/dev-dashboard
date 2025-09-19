// Reports Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupTitleAnimation();
    generateReports();
});

// Setup complex title animation for reports page
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

// Generate comprehensive reports
function generateReports() {
    const tasks = JSON.parse(localStorage.getItem('rdTasks') || '[]');
    
    if (!tasks || tasks.length === 0) {
        showEmptyState();
        return;
    }
    
    // Generate all report sections
    generateSummaryStats(tasks);
    generatePriorityChart(tasks);
    generateStatusChart(tasks);
    generateBucketAnalysis(tasks);
    generateTeamStats(tasks);
    generateTimelineAnalysis(tasks);
    generateRecentActivity(tasks);
}

// Generate summary statistics
function generateSummaryStats(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.progress === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.progress === 'In progress').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    document.getElementById('total-tasks-report').textContent = totalTasks;
    document.getElementById('completed-tasks-report').textContent = completedTasks;
    document.getElementById('in-progress-report').textContent = inProgressTasks;
    document.getElementById('completion-rate').textContent = completionRate + '%';
}

// Generate priority breakdown chart
function generatePriorityChart(tasks) {
    const priorityCounts = {
        'Urgent': tasks.filter(t => t.priority === 'Urgent').length,
        'Medium': tasks.filter(t => t.priority === 'Medium').length,
        'Low': tasks.filter(t => t.priority === 'Low').length
    };
    
    const chartContainer = document.getElementById('priority-chart');
    chartContainer.innerHTML = '';
    
    Object.entries(priorityCounts).forEach(([priority, count]) => {
        const priorityItem = document.createElement('div');
        priorityItem.className = `priority-item ${priority.toLowerCase()}`;
        priorityItem.innerHTML = `
            <span class="priority-label">${priority}</span>
            <span class="priority-count">${count}</span>
        `;
        chartContainer.appendChild(priorityItem);
    });
}

// Generate status distribution chart
function generateStatusChart(tasks) {
    const statusCounts = {
        'Completed': tasks.filter(t => t.progress === 'Completed').length,
        'In progress': tasks.filter(t => t.progress === 'In progress').length,
        'Not started': tasks.filter(t => t.progress === 'Not started').length
    };
    
    const chartContainer = document.getElementById('status-chart');
    chartContainer.innerHTML = '';
    
    Object.entries(statusCounts).forEach(([status, count]) => {
        const statusItem = document.createElement('div');
        statusItem.className = 'status-item';
        statusItem.innerHTML = `
            <span class="status-label">${status}</span>
            <span class="status-count">${count}</span>
        `;
        chartContainer.appendChild(statusItem);
    });
}

// Generate bucket analysis
function generateBucketAnalysis(tasks) {
    const bucketCounts = {};
    
    tasks.forEach(task => {
        const bucket = task.bucketName || 'No Bucket';
        bucketCounts[bucket] = (bucketCounts[bucket] || 0) + 1;
    });
    
    // Sort buckets by task count
    const sortedBuckets = Object.entries(bucketCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10); // Show top 10 buckets
    
    const bucketContainer = document.getElementById('bucket-list');
    bucketContainer.innerHTML = '';
    
    sortedBuckets.forEach(([bucket, count]) => {
        const bucketItem = document.createElement('div');
        bucketItem.className = 'bucket-item';
        bucketItem.innerHTML = `
            <span class="bucket-name">${bucket}</span>
            <span class="bucket-count">${count}</span>
        `;
        bucketContainer.appendChild(bucketItem);
    });
}

// Generate team performance stats
function generateTeamStats(tasks) {
    const teamCounts = {};
    
    tasks.forEach(task => {
        const assignedTo = task.assignedTo || 'Unassigned';
        teamCounts[assignedTo] = (teamCounts[assignedTo] || 0) + 1;
    });
    
    // Sort team members by task count
    const sortedTeam = Object.entries(teamCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10); // Show top 10 team members
    
    const teamContainer = document.getElementById('team-stats');
    teamContainer.innerHTML = '';
    
    sortedTeam.forEach(([member, count]) => {
        const teamItem = document.createElement('div');
        teamItem.className = 'team-item';
        teamItem.innerHTML = `
            <span class="team-member">${member}</span>
            <span class="team-count">${count}</span>
        `;
        teamContainer.appendChild(teamItem);
    });
}

// Generate timeline analysis
function generateTimelineAnalysis(tasks) {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    const overdueTasks = tasks.filter(task => {
        if (!task.dueDate || task.progress === 'Completed') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < now;
    }).length;
    
    const dueThisWeek = tasks.filter(task => {
        if (!task.dueDate || task.progress === 'Completed') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= now && dueDate <= oneWeekFromNow;
    }).length;
    
    const dueNextWeek = tasks.filter(task => {
        if (!task.dueDate || task.progress === 'Completed') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate > oneWeekFromNow && dueDate <= twoWeeksFromNow;
    }).length;
    
    const noDueDate = tasks.filter(task => !task.dueDate || task.dueDate === '').length;
    
    document.getElementById('overdue-count').textContent = overdueTasks;
    document.getElementById('due-this-week').textContent = dueThisWeek;
    document.getElementById('due-next-week').textContent = dueNextWeek;
    document.getElementById('no-due-date').textContent = noDueDate;
}

// Generate recent activity
function generateRecentActivity(tasks) {
    // Sort tasks by creation date (most recent first)
    const recentTasks = tasks
        .filter(task => task.createdDate)
        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
        .slice(0, 5);
    
    const activityContainer = document.getElementById('activity-list');
    activityContainer.innerHTML = '';
    
    recentTasks.forEach(task => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const icon = getActivityIcon(task.progress);
        const timeAgo = getTimeAgo(task.createdDate);
        
        activityItem.innerHTML = `
            <span class="activity-icon">${icon}</span>
            <span class="activity-text">Task "${task.taskName}" created</span>
            <span class="activity-time">${timeAgo}</span>
        `;
        activityContainer.appendChild(activityItem);
    });
}

// Get activity icon based on task status
function getActivityIcon(status) {
    switch(status) {
        case 'Completed': return '✅';
        case 'In progress': return '🔄';
        case 'Not started': return '📋';
        default: return '📝';
    }
}

// Get time ago string
function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
}

// Show empty state when no data
function showEmptyState() {
    const reportsContent = document.querySelector('.reports-content');
    reportsContent.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📊</div>
            <h2>No Data Available</h2>
            <p>Import some Teams Planner tasks to see detailed reports and analytics.</p>
            <button class="btn btn-primary" onclick="window.location.href='index.html'">
                ← Back to Dashboard
            </button>
        </div>
    `;
}

// Add CSS animations for particle effects
const style = document.createElement('style');
style.textContent = `
    @keyframes burstParticle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
        }
    }

    @keyframes rippleExpand {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(10);
            opacity: 0;
        }
    }

    @keyframes floatAround {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.6;
        }
        25% {
            transform: translate(20px, -15px) rotate(90deg);
            opacity: 0.8;
        }
        50% {
            transform: translate(-10px, -30px) rotate(180deg);
            opacity: 0.4;
        }
        75% {
            transform: translate(-25px, 10px) rotate(270deg);
            opacity: 0.7;
        }
        100% {
            transform: translate(0, 0) rotate(360deg);
            opacity: 0.6;
        }
    }
`;
document.head.appendChild(style);
