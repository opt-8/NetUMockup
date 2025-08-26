// Global state management
let currentView = 'public';
let isAdmin = true; // For demo purposes, assume user is admin

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupFormHandlers();
    setupInteractiveElements();
    setupNotifications();
});

// Navigation Functions
function setupNavigation() {
    // Handle admin toggle button
    const adminToggle = document.querySelector('.admin-toggle');
    if (adminToggle) {
        adminToggle.addEventListener('click', toggleAdminView);
    }

    // Handle admin navigation tabs
    const adminTabs = document.querySelectorAll('.admin-tab');
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const action = this.getAttribute('onclick');
            if (action) {
                eval(action);
            }
        });
    });
}

function toggleAdminView() {
    // Show a quick notification about the floating navigation
    showNotification('Use the floating navigation bar at the bottom to switch between views!', 'info');
    
    // Scroll to show the floating navigation
    const floatingNav = document.querySelector('.floating-admin-nav');
    if (floatingNav) {
        floatingNav.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}

function switchToPublicView() {
    window.location.href = 'group-public.html';
}

function switchToAdminView() {
    window.location.href = 'group-admin.html';
}

function openSettings() {
    window.location.href = 'index.html';
}

function openAdminNav() {
    const overlay = document.getElementById('adminNavOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }
}

function closeAdminNav() {
    const overlay = document.getElementById('adminNavOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

// Form Handlers
function setupFormHandlers() {
    // Post type selector
    const postTypes = document.querySelectorAll('.post-type');
    postTypes.forEach(type => {
        type.addEventListener('click', function() {
            postTypes.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const postType = this.querySelector('input').value;
            handlePostTypeChange(postType);
        });
    });

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Real-time validation
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function handlePostTypeChange(postType) {
    const postForm = document.querySelector('.post-form');
    const eventForm = document.querySelector('.event-creator');
    
    if (postType === 'event') {
        if (postForm) postForm.style.display = 'none';
        if (eventForm) eventForm.style.display = 'block';
    } else {
        if (postForm) postForm.style.display = 'block';
        if (eventForm) eventForm.style.display = 'none';
    }
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // URL validation
    if (field.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            field.classList.add('error');
            showFieldError(field, 'Please enter a valid URL');
            return false;
        }
    }
    
    // Number validation
    if (field.type === 'number' && value) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            field.classList.add('error');
            showFieldError(field, 'Please enter a valid number');
            return false;
        }
        
        if (field.hasAttribute('min') && num < parseFloat(field.getAttribute('min'))) {
            field.classList.add('error');
            showFieldError(field, `Value must be at least ${field.getAttribute('min')}`);
            return false;
        }
        
        if (field.hasAttribute('max') && num > parseFloat(field.getAttribute('max'))) {
            field.classList.add('error');
            showFieldError(field, `Value must be at most ${field.getAttribute('max')}`);
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc2626;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Form submitted successfully!', 'success');
}

// Post and Event Functions
function openCreatePost() {
    const postSection = document.querySelector('.post-creator');
    if (postSection) {
        postSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function openCreateEvent() {
    const eventSection = document.querySelector('.event-creator');
    if (eventSection) {
        eventSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function clearPostForm() {
    const postForm = document.querySelector('.post-form');
    if (postForm) {
        const inputs = postForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.value = '';
        });
        
        const checkboxes = postForm.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        showNotification('Post form cleared', 'info');
    }
}

function clearEventForm() {
    const eventForm = document.querySelector('.event-creator');
    if (eventForm) {
        const inputs = eventForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.value = '';
        });
        
        const checkboxes = eventForm.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        showNotification('Event form cleared', 'info');
    }
}

function saveDraft() {
    const postTitle = document.getElementById('post-title')?.value;
    const postContent = document.getElementById('post-content')?.value;
    
    if (!postContent.trim()) {
        showNotification('Please enter some content to save as draft', 'warning');
        return;
    }
    
    // Simulate saving draft
    showNotification('Draft saved successfully!', 'success');
}

function publishPost() {
    const postTitle = document.getElementById('post-title')?.value;
    const postContent = document.getElementById('post-content')?.value;
    const postType = document.querySelector('.post-type.active input')?.value;
    
    if (!postContent.trim()) {
        showNotification('Please enter post content', 'warning');
        return;
    }
    
    // Simulate publishing post
    showNotification('Post published successfully!', 'success');
    
    // Clear form
    clearPostForm();
}

function saveEventDraft() {
    const eventTitle = document.getElementById('event-title')?.value;
    const eventDescription = document.getElementById('event-description')?.value;
    
    if (!eventTitle.trim() || !eventDescription.trim()) {
        showNotification('Please enter event title and description to save as draft', 'warning');
        return;
    }
    
    // Simulate saving draft
    showNotification('Event draft saved successfully!', 'success');
}

function publishEvent() {
    const eventTitle = document.getElementById('event-title')?.value;
    const eventDescription = document.getElementById('event-description')?.value;
    const eventDate = document.getElementById('event-date')?.value;
    const eventTime = document.getElementById('event-time')?.value;
    
    if (!eventTitle.trim() || !eventDescription.trim() || !eventDate || !eventTime) {
        showNotification('Please fill in all required event fields', 'warning');
        return;
    }
    
    // Simulate creating event
    showNotification('Event created successfully!', 'success');
    
    // Clear form
    clearEventForm();
}

// Admin Functions
function openMemberManagement() {
    showNotification('Member management feature coming soon!', 'info');
}

function openAnalytics() {
    showNotification('Analytics dashboard coming soon!', 'info');
}

// Interactive Elements
function setupInteractiveElements() {
    // Post actions
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span')?.textContent;
            const post = this.closest('.post');
            
            if (action === 'Like') {
                this.classList.toggle('liked');
                const icon = this.querySelector('i');
                if (this.classList.contains('liked')) {
                    icon.className = 'fas fa-thumbs-up';
                    icon.style.color = '#3b82f6';
                } else {
                    icon.className = 'fas fa-thumbs-up';
                    icon.style.color = '#64748b';
                }
            }
        });
    });

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.textContent;
            filterPosts(filter);
        });
    });

    // Post menu
    const postMenus = document.querySelectorAll('.post-menu');
    postMenus.forEach(menu => {
        menu.addEventListener('click', function() {
            const post = this.closest('.post');
            showPostMenu(post);
        });
    });

    // Approval actions
    const approvalButtons = document.querySelectorAll('.approval-actions button');
    approvalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent;
            const approvalItem = this.closest('.approval-item');
            
            if (action === 'Approve') {
                approvalItem.style.opacity = '0.5';
                showNotification('Request approved', 'success');
            } else if (action === 'Decline') {
                approvalItem.style.opacity = '0.5';
                showNotification('Request declined', 'info');
            }
        });
    });

    // Activity actions
    const activityButtons = document.querySelectorAll('.activity-actions button');
    activityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent;
            showNotification(`${action} action performed`, 'info');
        });
    });
}

function filterPosts(filter) {
    const posts = document.querySelectorAll('.post');
    
    posts.forEach(post => {
        if (filter === 'All Posts') {
            post.style.display = 'block';
        } else {
            // Simple filtering logic - in real app, you'd check post metadata
            const isVisible = Math.random() > 0.3; // Simulate filtering
            post.style.display = isVisible ? 'block' : 'none';
        }
    });
    
    showNotification(`Showing ${filter}`, 'info');
}

function showPostMenu(post) {
    // Create context menu
    const menu = document.createElement('div');
    menu.className = 'post-context-menu';
    menu.innerHTML = `
        <div class="menu-item">
            <i class="fas fa-edit"></i>
            <span>Edit Post</span>
        </div>
        <div class="menu-item">
            <i class="fas fa-pin"></i>
            <span>Pin Post</span>
        </div>
        <div class="menu-item">
            <i class="fas fa-flag"></i>
            <span>Report</span>
        </div>
        <div class="menu-item danger">
            <i class="fas fa-trash"></i>
            <span>Delete</span>
        </div>
    `;
    
    // Position menu
    const rect = post.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + 10}px`;
    menu.style.left = `${rect.right - 200}px`;
    menu.style.zIndex = '1000';
    
    // Add styles
    menu.style.cssText += `
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        padding: 0.5rem;
        min-width: 180px;
    `;
    
    // Add menu items styles
    const menuItems = menu.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            cursor: pointer;
            border-radius: 0.375rem;
            transition: background-color 0.2s ease;
            color: #374151;
        `;
        
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = this.classList.contains('danger') ? '#fef2f2' : '#f8fafc';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        item.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            showNotification(`${action} action performed`, 'info');
            document.body.removeChild(menu);
        });
    });
    
    // Add to page
    document.body.appendChild(menu);
    
    // Remove menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function removeMenu(e) {
            if (!menu.contains(e.target)) {
                document.body.removeChild(menu);
                document.removeEventListener('click', removeMenu);
            }
        });
    }, 100);
}

// Notification System
function setupNotifications() {
    // Add notification styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: #1e293b;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            border-left: 4px solid #3b82f6;
        }
        
        .notification.success {
            border-left-color: #059669;
        }
        
        .notification.error {
            border-left-color: #dc2626;
        }
        
        .notification.warning {
            border-left-color: #d97706;
        }
        
        .notification.info {
            border-left-color: #3b82f6;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .field-error {
            color: #dc2626;
            font-size: 0.75rem;
            margin-top: 0.25rem;
        }
        
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: #dc2626;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
    `;
    document.head.appendChild(notificationStyles);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Auto-save functionality
const autoSave = debounce(() => {
    showNotification('Changes auto-saved', 'info');
}, 3000);

// Add auto-save to form inputs
document.addEventListener('input', function(e) {
    if (e.target.matches('input, textarea, select')) {
        autoSave();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const saveButton = document.querySelector('.btn-primary');
        if (saveButton && saveButton.textContent.includes('Save')) {
            saveButton.click();
        }
    }
    
    // Escape to close modals/menus
    if (e.key === 'Escape') {
        closeAdminNav();
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
});

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('mobile-open');
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize
    const nav = document.querySelector('.main-nav');
    if (window.innerWidth > 768) {
        nav.classList.remove('mobile-open');
    }
}, 250));

// Initialize tooltips and other UI enhancements
function initializeUI() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('button[onclick]');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('Save') || this.textContent.includes('Publish') || this.textContent.includes('Create')) {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeUI); 