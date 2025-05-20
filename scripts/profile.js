// Handle profile image upload
document.getElementById('avatar-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-image').src = e.target.result;
            // In a real application, you would upload this to a server
        };
        reader.readAsDataURL(file);
    }
});

// Save changes
function saveChanges() {
    // Get all form data
    const userData = {
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        language: document.getElementById('language').value,
        currency: document.getElementById('currency').value,
        emailNotifications: document.getElementById('email-notifications').checked
    };

    // Get password data if changed
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (currentPassword || newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        if (!currentPassword) {
            alert('Please enter your current password to change it.');
            return;
        }
        userData.passwordChange = {
            current: currentPassword,
            new: newPassword
        };
    }

    // In a real application, you would send this data to a server
    console.log('Saving user data:', userData);
    
    // Show success message
    showNotification('Changes saved successfully!');

    // Clear password fields
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

// Delete account
function deleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
        // In a real application, you would send a request to delete the account
        console.log('Deleting account...');
        // Redirect to login page
        window.location.href = 'index.html';
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add styles dynamically
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.3s';

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Form validation
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('invalid', (e) => {
        e.preventDefault();
        input.classList.add('error');
    });

    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            input.classList.remove('error');
        }
    });
}); 