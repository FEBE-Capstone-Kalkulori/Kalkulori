const createProfileTemplate = (userData, isEditMode = false) => {
  return `
    <div class="profile-content">
      <h2 class="profile-title">User Profile</h2>
      
      <div class="profile-main">
        <div class="profile-avatar-container">
          <div class="profile-avatar">
            <img src="${userData.avatar || './public/image/default-avatar.png'}" alt="User Avatar" id="user-avatar">
            ${isEditMode ? `
              <div class="avatar-edit-button" id="edit-avatar-btn">
                <i class="fas fa-pencil-alt"></i>
              </div>
              <div class="avatar-options" id="avatar-options">
                <div class="avatar-option" id="camera-option">
                  <i class="fas fa-camera"></i> Take photo
                </div>
                <div class="avatar-option" id="gallery-option">
                  <i class="fas fa-images"></i> Choose from gallery
                </div>
              </div>
              <!-- Hidden file input untuk gallery -->
              <input type="file" id="file-input" accept="image/*" style="display: none;">
              <!-- Hidden canvas untuk camera capture -->
              <canvas id="camera-canvas" style="display: none;"></canvas>
            ` : ''}
          </div>
          ${!isEditMode ? `
            <button class="btn sign-out-btn" id="sign-out-btn">Sign Out</button>
          ` : ''}
        </div>
        
        <div class="profile-details">
          <div class="profile-form">
            <div class="form-group">
              <label for="name">Name</label>
              ${isEditMode ? 
                `<input type="text" id="name" class="form-control" value="${userData.name || ''}" placeholder="Enter your name">` : 
                `<div class="form-control-static">${userData.name || ''}</div>`
              }
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Gender</label>
                ${isEditMode ? `
                  <div class="gender-options">
                    <button class="gender-option ${userData.gender === 'male' ? 'active' : ''}" id="male-option">
                      <i class="fas fa-male"></i> I am Male
                    </button>
                    <button class="gender-option ${userData.gender === 'female' ? 'active' : ''}" id="female-option">
                      <i class="fas fa-female"></i> I am Female
                    </button>
                  </div>
                ` : `
                  <div class="form-control-static">${userData.gender === 'male' ? 'I am Male' : userData.gender === 'female' ? 'I am Female' : ''}</div>
                `}
              </div>
              
              <div class="form-group">
                <label for="age">Age</label>
                ${isEditMode ? 
                  `<div class="number-input-container">
                    <input type="number" id="age" class="form-control" value="${userData.age || ''}" min="1" max="120">
                    <div class="number-controls">
                      <button class="number-control-up" data-input="age"><i class="fas fa-chevron-up"></i></button>
                      <button class="number-control-down" data-input="age"><i class="fas fa-chevron-down"></i></button>
                    </div>
                  </div>` : 
                  `<div class="form-control-static">${userData.age || ''}</div>`
                }
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="weight">Weight</label>
                ${isEditMode ? 
                  `<div class="number-input-container">
                    <input type="number" id="weight" class="form-control" value="${userData.weight || ''}" min="1" max="500">
                    <span class="unit">kg</span>
                    <div class="number-controls">
                      <button class="number-control-up" data-input="weight"><i class="fas fa-chevron-up"></i></button>
                      <button class="number-control-down" data-input="weight"><i class="fas fa-chevron-down"></i></button>
                    </div>
                  </div>` : 
                  `<div class="form-control-static">${userData.weight || ''} kg</div>`
                }
              </div>
              
              <div class="form-group">
                <label for="height">Height</label>
                ${isEditMode ? 
                  `<div class="number-input-container">
                    <input type="number" id="height" class="form-control" value="${userData.height || ''}" min="1" max="300">
                    <span class="unit">cm</span>
                    <div class="number-controls">
                      <button class="number-control-up" data-input="height"><i class="fas fa-chevron-up"></i></button>
                      <button class="number-control-down" data-input="height"><i class="fas fa-chevron-down"></i></button>
                    </div>
                  </div>` : 
                  `<div class="form-control-static">${userData.height || ''} cm</div>`
                }
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="targetWeight">Target Weight</label>
                ${isEditMode ? 
                  `<div class="number-input-container">
                    <input type="number" id="targetWeight" class="form-control" value="${userData.targetWeight || ''}" min="1" max="500">
                    <span class="unit">kg</span>
                    <div class="number-controls">
                      <button class="number-control-up" data-input="targetWeight"><i class="fas fa-chevron-up"></i></button>
                      <button class="number-control-down" data-input="targetWeight"><i class="fas fa-chevron-down"></i></button>
                    </div>
                  </div>` : 
                  `<div class="form-control-static">${userData.targetWeight || ''} kg</div>`
                }
              </div>
              
              <div class="form-group">
                <label for="activityLevel">Activity Level</label>
                ${isEditMode ? `
                  <div class="select-container">
                    <select id="activityLevel" class="form-control">
                      <option value="" disabled ${!userData.activityLevel ? 'selected' : ''}>Select level</option>
                      <option value="daily" ${userData.activityLevel === 'daily' ? 'selected' : ''}>Daily</option>
                      <option value="regularly" ${userData.activityLevel === 'regularly' ? 'selected' : ''}>Regularly</option>
                      <option value="occasionally" ${userData.activityLevel === 'occasionally' ? 'selected' : ''}>Occasionally</option>
                      <option value="rarely" ${userData.activityLevel === 'rarely' ? 'selected' : ''}>Rarely</option>
                      <option value="never" ${userData.activityLevel === 'never' ? 'selected' : ''}>Never</option>
                    </select>
                    <div class="select-arrow"><i class="fas fa-chevron-down"></i></div>
                  </div>
                ` : `
                  <div class="form-control-static">${userData.activityLevel ? userData.activityLevel.charAt(0).toUpperCase() + userData.activityLevel.slice(1) : 'Never'}</div>
                `}
              </div>
            </div>
          </div>
          
          <div class="profile-actions">
            ${isEditMode ? `
              <button class="btn save-btn" id="save-data-btn">Save Data</button>
            ` : `
              <button class="btn update-btn" id="update-data-btn">Update Data</button>
            `}
          </div>
        </div>
      </div>
    </div>

    <!-- Camera Modal (akan ditambahkan ketika camera option diklik) -->
    <div id="camera-modal" class="camera-modal" style="display: none;">
      <div class="camera-modal-content">
        <div class="camera-modal-header">
          <h3>Take Photo</h3>
          <button class="camera-close-btn" id="camera-close-btn">&times;</button>
        </div>
        <div class="camera-modal-body">
          <video id="camera-video" autoplay playsinline></video>
          <canvas id="camera-preview-canvas" style="display: none;"></canvas>
        </div>
        <div class="camera-modal-footer">
          <button class="btn camera-btn" id="camera-capture-btn">
            <i class="fas fa-camera"></i> Capture
          </button>
          <button class="btn camera-btn secondary" id="camera-retake-btn" style="display: none;">
            <i class="fas fa-redo"></i> Retake
          </button>
          <button class="btn camera-btn primary" id="camera-use-btn" style="display: none;">
            <i class="fas fa-check"></i> Use Photo
          </button>
        </div>
      </div>
    </div>
  `;
};

export default {
  render(container, userData, isEditMode = false) {
    container.innerHTML = createProfileTemplate(userData, isEditMode);
  },
  
  // Method untuk membuat header khusus profile
  createProfileHeader() {
    return `
      <div class="profile-header-container">
        <div class="profile-navbar">
          <div class="profile-logo">
            <span class="green-text">kalku</span>lori
          </div>
          <nav>
            <ul class="profile-nav-menu">
              <li><a href="#/">Home</a></li>
              <li><a href="#/history">History</a></li>
              <li><a href="#/profile" class="active">Profile</a></li>
            </ul>
          </nav>
        </div>
      </div>
    `;
  },

  // Method untuk hide/show header
  toggleHeaders(showProfileHeader = true) {
    const homeHeader = document.querySelector('header');
    const existingProfileHeader = document.querySelector('.profile-header-container');
    
    if (showProfileHeader) {
      // Sembunyikan header home
      if (homeHeader) {
        homeHeader.style.display = 'none';
      }
      
      // Tampilkan header profile jika belum ada
      if (!existingProfileHeader) {
        const profileHeaderHTML = this.createProfileHeader();
        document.body.insertAdjacentHTML('afterbegin', profileHeaderHTML);
      }
    } else {
      // Tampilkan header home
      if (homeHeader) {
        homeHeader.style.display = 'block';
      }
      
      // Hapus header profile
      if (existingProfileHeader) {
        existingProfileHeader.remove();
      }
    }
  },
  
  showAvatarOptions() {
    const avatarOptions = document.getElementById('avatar-options');
    if (avatarOptions) {
      avatarOptions.style.display = 'block';
    }
  },
  
  hideAvatarOptions() {
    const avatarOptions = document.getElementById('avatar-options');
    if (avatarOptions) {
      avatarOptions.style.display = 'none';
    }
  },

  // Method untuk validasi file image
  validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return false;
    }

    if (file.size > maxSize) {
      alert('Image size should be less than 5MB');
      return false;
    }

    return true;
  },

  // Method untuk resize image
  resizeImage(file, maxWidth = 300, maxHeight = 300, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  },

  // Method untuk convert blob to base64
  blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  },

  // Method untuk show camera modal
  showCameraModal() {
    const modal = document.getElementById('camera-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  },

  // Method untuk hide camera modal
  hideCameraModal() {
    const modal = document.getElementById('camera-modal');
    const video = document.getElementById('camera-video');
    
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    // Stop camera stream
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  },
  
  toggleGenderOption(gender) {
    const maleOption = document.getElementById('male-option');
    const femaleOption = document.getElementById('female-option');
    
    if (gender === 'male') {
      maleOption.classList.add('active');
      femaleOption.classList.remove('active');
    } else if (gender === 'female') {
      femaleOption.classList.add('active');
      maleOption.classList.remove('active');
    }
  },
  
  getUserData() {
    if (!document.getElementById('name')) return null;
    
    let gender = 'male';
    if (document.getElementById('female-option') && document.getElementById('female-option').classList.contains('active')) {
      gender = 'female';
    }
    
    return {
      name: document.getElementById('name').value,
      gender,
      age: document.getElementById('age').value,
      weight: document.getElementById('weight').value,
      height: document.getElementById('height').value,
      targetWeight: document.getElementById('targetWeight').value,
      activityLevel: document.getElementById('activityLevel').value
    };
  },
  
  attachEventHandlers(handlers) {
    const editAvatarBtn = document.getElementById('edit-avatar-btn');
    const cameraOption = document.getElementById('camera-option');
    const galleryOption = document.getElementById('gallery-option');
    const fileInput = document.getElementById('file-input');
    const maleOption = document.getElementById('male-option');
    const femaleOption = document.getElementById('female-option');
    const updateDataBtn = document.getElementById('update-data-btn');
    const saveDataBtn = document.getElementById('save-data-btn');
    const signOutBtn = document.getElementById('sign-out-btn');
    const numberControlsUp = document.querySelectorAll('.number-control-up');
    const numberControlsDown = document.querySelectorAll('.number-control-down');
    
    // Camera modal elements
    const cameraCloseBtn = document.getElementById('camera-close-btn');
    const cameraCaptureBtn = document.getElementById('camera-capture-btn');
    const cameraRetakeBtn = document.getElementById('camera-retake-btn');
    const cameraUseBtn = document.getElementById('camera-use-btn');
    
    if (editAvatarBtn && handlers.onEditAvatarClicked) {
      editAvatarBtn.addEventListener('click', handlers.onEditAvatarClicked);
    }
    
    if (cameraOption && handlers.onCameraOptionClicked) {
      cameraOption.addEventListener('click', handlers.onCameraOptionClicked);
    }
    
    if (galleryOption && handlers.onGalleryOptionClicked) {
      galleryOption.addEventListener('click', handlers.onGalleryOptionClicked);
    }

    // File input handler
    if (fileInput && handlers.onFileSelected) {
      fileInput.addEventListener('change', handlers.onFileSelected);
    }

    // Camera modal handlers
    if (cameraCloseBtn && handlers.onCameraModalClose) {
      cameraCloseBtn.addEventListener('click', handlers.onCameraModalClose);
    }

    if (cameraCaptureBtn && handlers.onCameraCapture) {
      cameraCaptureBtn.addEventListener('click', handlers.onCameraCapture);
    }

    if (cameraRetakeBtn && handlers.onCameraRetake) {
      cameraRetakeBtn.addEventListener('click', handlers.onCameraRetake);
    }

    if (cameraUseBtn && handlers.onCameraUse) {
      cameraUseBtn.addEventListener('click', handlers.onCameraUse);
    }
    
    if (maleOption && handlers.onGenderOptionClicked) {
      maleOption.addEventListener('click', () => handlers.onGenderOptionClicked('male'));
    }
    
    if (femaleOption && handlers.onGenderOptionClicked) {
      femaleOption.addEventListener('click', () => handlers.onGenderOptionClicked('female'));
    }
    
    if (updateDataBtn && handlers.onUpdateDataClicked) {
      updateDataBtn.addEventListener('click', handlers.onUpdateDataClicked);
    }
    
    if (saveDataBtn && handlers.onSaveDataClicked) {
      saveDataBtn.addEventListener('click', handlers.onSaveDataClicked);
    }
    
    if (signOutBtn && handlers.onSignOutClicked) {
      signOutBtn.addEventListener('click', handlers.onSignOutClicked);
    }
    
    numberControlsUp.forEach(button => {
      if (handlers.onNumberIncrease) {
        button.addEventListener('click', () => {
          const inputId = button.getAttribute('data-input');
          handlers.onNumberIncrease(inputId);
        });
      }
    });
    
    numberControlsDown.forEach(button => {
      if (handlers.onNumberDecrease) {
        button.addEventListener('click', () => {
          const inputId = button.getAttribute('data-input');
          handlers.onNumberDecrease(inputId);
        });
      }
    });
    
    // Close avatar options when clicking outside
    document.addEventListener('click', (event) => {
      const avatarOptions = document.getElementById('avatar-options');
      const editAvatarBtn = document.getElementById('edit-avatar-btn');
      
      if (avatarOptions && editAvatarBtn) {
        if (!avatarOptions.contains(event.target) && !editAvatarBtn.contains(event.target)) {
          this.hideAvatarOptions();
        }
      }
    });

    // Close camera modal when clicking backdrop
    const cameraModal = document.getElementById('camera-modal');
    if (cameraModal && handlers.onCameraModalClose) {
      cameraModal.addEventListener('click', (event) => {
        if (event.target === cameraModal) {
          handlers.onCameraModalClose();
        }
      });
    }
  }
};