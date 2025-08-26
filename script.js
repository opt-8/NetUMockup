// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Tab switching functionality
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Form validation and interactions
    setupFormValidation();
    setupInteractiveElements();
    setupSaveFunctionality();
    setupNavigation();
});

// Navigation Functions
function setupNavigation() {
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

function switchToPublicView() {
    window.location.href = 'group-public.html';
}

function switchToAdminView() {
    window.location.href = 'group-admin.html';
}

function openSettings() {
    window.location.href = 'index.html';
}

function goBack() {
    // Go back to admin dashboard page
    window.location.href = 'group-admin.html';
}

function saveSettings() {
    // Show loading state
    const saveButton = document.querySelector('.btn-primary');
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveButton.disabled = true;
    
    // Simulate save operation
    setTimeout(() => {
        showNotification('Settings saved successfully!', 'success');
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
    }, 2000);
}

// Form validation
function setupFormValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Add validation on blur
        input.addEventListener('blur', validateField);
        
        // Add real-time validation for required fields
        if (input.hasAttribute('required')) {
            input.addEventListener('input', validateField);
        }
    });
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
    
    // Clear error message if validation passes
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    // Remove existing error message
    clearFieldError(field);
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc2626;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    // Insert error message after the field
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Interactive elements
function setupInteractiveElements() {
    // Toggle switches
    const toggles = document.querySelectorAll('.toggle input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.toggle-item').querySelector('span').textContent;
            console.log(`${settingName}: ${this.checked ? 'enabled' : 'disabled'}`);
            
            // Add visual feedback
            const slider = this.nextElementSibling;
            if (this.checked) {
                slider.style.backgroundColor = '#3b82f6';
            } else {
                slider.style.backgroundColor = '#d1d5db';
            }
        });
    });

    // Radio buttons
    const radioGroups = document.querySelectorAll('.radio-group');
    radioGroups.forEach(group => {
        const radios = group.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                const settingName = this.closest('.setting-card').querySelector('h3').textContent;
                console.log(`${settingName}: ${this.value} selected`);
            });
        });
    });

    // File upload buttons
    const uploadButtons = document.querySelectorAll('.btn-upload');
    uploadButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    const uploadArea = button.closest('.upload-area');
                    const icon = uploadArea.querySelector('i');
                    const text = uploadArea.querySelector('p');
                    
                    // Update UI to show selected file
                    icon.className = 'fas fa-check';
                    icon.style.color = '#059669';
                    text.textContent = `Selected: ${file.name}`;
                    text.style.color = '#059669';
                    
                    console.log(`File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
                }
            });
            
            fileInput.click();
        });
    });

    // Small action buttons
    const smallButtons = document.querySelectorAll('.btn-small');
    smallButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const action = this.textContent.trim() || this.querySelector('i')?.className;
            const itemName = this.closest('.member-item, .organizer-item, .file-item')?.querySelector('.member-name, .organizer-name, .file-name')?.textContent;
            
            if (action.includes('danger') || action.includes('trash')) {
                if (confirm(`Are you sure you want to remove "${itemName}"?`)) {
                    console.log(`Removing: ${itemName}`);
                    // Add removal animation
                    this.closest('.member-item, .organizer-item, .file-item').style.opacity = '0.5';
                }
            } else {
                console.log(`Action: ${action} for ${itemName}`);
            }
        });
    });
}

// Save functionality
function setupSaveFunctionality() {
    const saveButton = document.querySelector('.btn-primary');
    
    saveButton.addEventListener('click', function() {
        // Show loading state
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        this.disabled = true;
        
        // Simulate save operation
        setTimeout(() => {
            // Show success message
            showNotification('Settings saved successfully!', 'success');
            
            // Restore button
            this.innerHTML = originalText;
            this.disabled = false;
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#059669';
        case 'error': return '#dc2626';
        case 'warning': return '#d97706';
        default: return '#3b82f6';
    }
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Add CSS for error states
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc2626;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.2s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(errorStyles);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.querySelector('.btn-primary').click();
    }
    
    // Escape to close notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => removeNotification(notification));
    }
});

// Auto-save functionality
let autoSaveTimeout;
const formElements = document.querySelectorAll('input, textarea, select');

formElements.forEach(element => {
    element.addEventListener('input', function() {
        // Clear existing timeout
        clearTimeout(autoSaveTimeout);
        
        // Set new timeout for auto-save
        autoSaveTimeout = setTimeout(() => {
            console.log('Auto-saving changes...');
            showNotification('Changes auto-saved', 'info');
        }, 3000); // Auto-save after 3 seconds of inactivity
    });
});

// Responsive navigation enhancement
function setupResponsiveNav() {
    const navContainer = document.querySelector('.admin-nav');
    const navTabs = document.querySelectorAll('.nav-tab');
    
    // Add scroll indicators for mobile
    if (window.innerWidth <= 768) {
        navContainer.addEventListener('scroll', function() {
            const scrollLeft = this.scrollLeft;
            const scrollWidth = this.scrollWidth;
            const clientWidth = this.clientWidth;
            
            // Add scroll indicators
            if (scrollLeft > 0) {
                this.classList.add('scrolled-left');
            } else {
                this.classList.remove('scrolled-left');
            }
            
            if (scrollLeft < scrollWidth - clientWidth - 1) {
                this.classList.add('scrolled-right');
            } else {
                this.classList.remove('scrolled-right');
            }
        });
    }
}

// Initialize responsive navigation
setupResponsiveNav();

// Window resize handler
window.addEventListener('resize', setupResponsiveNav); 