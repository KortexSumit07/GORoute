// Navigation functions
function toggleNav() {
    const navSidebar = document.querySelector('.nav-sidebar');
    navSidebar.classList.toggle('active');
}

function closeNav() {
    const navSidebar = document.querySelector('.nav-sidebar');
    navSidebar.classList.remove('active');
}

// Close navigation when clicking outside
document.addEventListener('click', function(event) {
    const navSidebar = document.querySelector('.nav-sidebar');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (!navSidebar.contains(event.target) && !navToggle.contains(event.target)) {
        navSidebar.classList.remove('active');
    }
}); 