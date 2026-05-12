// Admin panel functionality
let uploadedImages = [];
let promotionsEnabled = true;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadStoredData();
    updatePromotionsStatus();
    displayCurrentPromotions();
});

// Handle file upload
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imageData = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    src: e.target.result,
                    uploadDate: new Date().toLocaleString()
                };
                
                uploadedImages.push(imageData);
                displayUploadedImages();
                saveToLocalStorage();
                showNotification('Image uploaded successfully!', 'success');
            };
            
            reader.readAsDataURL(file);
        } else {
            showNotification('Please upload only image files', 'error');
        }
    });
    
    // Clear the file input
    e.target.value = '';
});

// Display uploaded images
function displayUploadedImages() {
    const container = document.getElementById('uploadedImages');
    container.innerHTML = '';
    
    uploadedImages.forEach(image => {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'uploaded-image';
        imageDiv.innerHTML = `
            <img src="${image.src}" alt="${image.name}">
            <button class="remove-btn" onclick="removeImage(${image.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(imageDiv);
    });
}

// Remove uploaded image
function removeImage(imageId) {
    uploadedImages = uploadedImages.filter(img => img.id !== imageId);
    displayUploadedImages();
    saveToLocalStorage();
    displayCurrentPromotions();
    showNotification('Image removed', 'info');
}

// Handle promotion toggle
document.getElementById('promoToggle').addEventListener('change', function(e) {
    promotionsEnabled = e.target.checked;
    updatePromotionsStatus();
    saveToLocalStorage();
    
    if (promotionsEnabled) {
        showNotification('Promotions activated', 'success');
    } else {
        showNotification('Promotions deactivated', 'warning');
    }
});

// Update promotions status display
function updatePromotionsStatus() {
    const statusDiv = document.getElementById('toggleStatus');
    const toggle = document.getElementById('promoToggle');
    
    toggle.checked = promotionsEnabled;
    
    if (promotionsEnabled) {
        statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Promotions are currently active';
        statusDiv.classList.remove('inactive');
    } else {
        statusDiv.innerHTML = '<i class="fas fa-times-circle"></i> Promotions are currently inactive';
        statusDiv.classList.add('inactive');
    }
}

// Display current promotions
function displayCurrentPromotions() {
    const container = document.getElementById('currentPromotions');
    container.innerHTML = '';
    
    if (uploadedImages.length === 0) {
        container.innerHTML = '<p style="color: rgba(255,255,255,0.7); text-align: center;">No promotions uploaded yet</p>';
        return;
    }
    
    uploadedImages.forEach((image, index) => {
        const promotionDiv = document.createElement('div');
        promotionDiv.className = 'promotion-item';
        promotionDiv.innerHTML = `
            <img src="${image.src}" alt="${image.name}">
            <h4>Promotion ${index + 1}</h4>
            <p>${image.name}</p>
            <small style="opacity: 0.6;">${image.uploadDate}</small>
        `;
        container.appendChild(promotionDiv);
    });
}

// Save data to localStorage
function saveToLocalStorage() {
    const data = {
        uploadedImages: uploadedImages,
        promotionsEnabled: promotionsEnabled
    };
    localStorage.setItem('promoDisplayData', JSON.stringify(data));
}

// Load data from localStorage
function loadStoredData() {
    const storedData = localStorage.getItem('promoDisplayData');
    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            uploadedImages = data.uploadedImages || [];
            promotionsEnabled = data.promotionsEnabled !== undefined ? data.promotionsEnabled : true;
            
            displayUploadedImages();
            updatePromotionsStatus();
        } catch (e) {
            console.error('Error loading stored data:', e);
        }
    }
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#4CAF50';
            break;
        case 'error':
            notification.style.background = '#f44336';
            break;
        case 'warning':
            notification.style.background = '#ff9800';
            break;
        case 'info':
            notification.style.background = '#2196F3';
            break;
        default:
            notification.style.background = '#666';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Drag and drop functionality
const uploadBox = document.querySelector('.upload-box');

uploadBox.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = 'rgba(255, 255, 255, 0.8)';
    this.style.background = 'rgba(255, 255, 255, 0.15)';
});

uploadBox.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    this.style.background = 'rgba(255, 255, 255, 0.05)';
});

uploadBox.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    this.style.background = 'rgba(255, 255, 255, 0.05)';
    
    const files = Array.from(e.dataTransfer.files);
    const imageInput = document.getElementById('imageUpload');
    
    // Create a new DataTransfer object to hold the files
    const dataTransfer = new DataTransfer();
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            dataTransfer.items.add(file);
        }
    });
    
    // Set the files to the input
    imageInput.files = dataTransfer.files;
    
    // Trigger the change event
    const event = new Event('change', { bubbles: true });
    imageInput.dispatchEvent(event);
});
