import Header from "../../components/header.js";

const createProfileTemplate = (userData, isEditMode = false) => {
  const getActivityLevelDisplay = (level) => {
    const mapping = {
      daily: "Daily",
      regularly: "Regularly",
      occasionally: "Occasionally",
      rarely: "Rarely",
      never: "Never",
    };
    return mapping[level] || level;
  };

  // Helper function to generate form fields (to avoid code duplication)
  const generateFormFields = (
    userData,
    isEditMode,
    getActivityLevelDisplay,
    layoutPrefix = ""
  ) => {
    return `
      <!-- Name Field -->
      <div class="flex flex-col">
        <label for="name${layoutPrefix}" class="text-base text-gray-800 mb-2 font-cal-sans">Name</label>
        ${
          isEditMode
            ? `<input type="text" id="name${layoutPrefix}" class="profile-name-input bg-white border-none rounded-full px-5 py-3 font-cal-sans text-base text-gray-400 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green" value="${
                userData.name || ""
              }" placeholder="Enter your name">`
            : `<div class="bg-white rounded-full px-5 py-3 font-cal-sans text-base text-gray-400 shadow-sm">${
                userData.name || ""
              }</div>`
        }
      </div>
      
      <!-- Gender and Age Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <!-- Gender Field -->
        <div class="flex flex-col">
          <label class="font-cal-sans text-base text-gray-800 mb-2">Gender</label>
          ${
            isEditMode
              ? `
            <div class="flex gap-2 sm:gap-4">
              <button class="flex-1 bg-white border-none rounded-full px-3 sm:px-5 py-3 font-cal-sans text-sm sm:text-base text-gray-400 cursor-pointer transition-all duration-200 shadow-sm profile-male-option ${
                userData.gender === "male"
                  ? "bg-blue-300 text-white"
                  : "hover:bg-blue-100 hover:text-blue-600"
              }" data-gender="male">
                <i class="fas fa-male mr-1 sm:mr-2"></i> I am Male
              </button>
              <button class="flex-1 bg-white border-none rounded-full px-3 sm:px-5 py-3 font-cal-sans text-sm sm:text-base text-gray-400 cursor-pointer transition-all duration-200 shadow-sm profile-female-option ${
                userData.gender === "female"
                  ? "bg-pink-300 text-white"
                  : "hover:bg-pink-100 hover:text-pink-600"
              }" data-gender="female">
                <i class="fas fa-female mr-1 sm:mr-2"></i> I am Female
              </button>
            </div>
          `
              : `
            <div class="bg-white rounded-full px-5 py-3 font-cal-sans text-base text-gray-400 shadow-sm">${
              userData.gender === "male"
                ? "I am Male"
                : userData.gender === "female"
                ? "I am Female"
                : ""
            }</div>
          `
          }
        </div>
        
        <!-- Age Field -->
        <div class="flex flex-col">
          <label for="age${layoutPrefix}" class="text-base text-gray-800 mb-2 font-cal-sans">Age</label>
          ${
            isEditMode
              ? `<div class="relative flex items-center">
              <input type="number" id="age${layoutPrefix}" class="profile-age-input bg-white border-none rounded-full px-5 py-3 pr-16 font-cal-sans text-base text-gray-400 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" value="${
                  userData.age || ""
                }" min="1" max="120">
              <div class="absolute right-2 flex flex-col gap-0.5">
                <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-300 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer profile-number-control" data-input="age" data-action="increment"><i class="fas fa-chevron-up text-xs"></i></button>
                <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-300 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer profile-number-control" data-input="age" data-action="decrement"><i class="fas fa-chevron-down text-xs"></i></button>
              </div>
            </div>`
              : `<div class="bg-white rounded-full px-5 py-3 font-cal-sans text-base text-gray-400 shadow-sm">${
                  userData.age || ""
                }</div>`
          }
        </div>
      </div>
      
      <!-- Weight and Height Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <!-- Weight Field -->
        <div class="flex flex-col">
          <label for="weight${layoutPrefix}" class="text-base text-gray-800 mb-2 font-cal-sans">Weight</label>
          ${
            isEditMode
              ? `<div class="relative flex items-center">
              <input type="number" id="weight${layoutPrefix}" class="profile-weight-input bg-white border-none rounded-full px-5 py-3 pr-16 font-cal-sans text-base text-gray-400 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" value="${
                  userData.weight || ""
                }" min="1" max="500">
              <span class="absolute right-14 font-cal-sans text-gray-400">kg</span>
              <div class="absolute right-2 flex flex-col gap-0.5">
                <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-300 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer profile-number-control" data-input="weight" data-action="increment"><i class="fas fa-chevron-up text-xs"></i></button>
                <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-300 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer profile-number-control" data-input="weight" data-action="decrement"><i class="fas fa-chevron-down text-xs"></i></button>
              </div>
            </div>`
              : `<div class="bg-white rounded-full px-5 py-3 font-cal-sans text-base text-gray-400 shadow-sm">${
                  userData.weight || ""
                } kg</div>`
          }
        </div>
        
        <!-- Height Field -->
        <div class="flex flex-col">
          <label for="height${layoutPrefix}" class="text-base text-gray-800 mb-2 font-cal-sans">Height</label>
          ${
            isEditMode
              ? `<div class="relative flex items-center">
              <input type="number" id="height${layoutPrefix}" class="profile-height-input bg-white border-none rounded-full px-5 py-3 pr-16 font-cal-sans text-base text-gray-400 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" value="${
                  userData.height || ""
                }" min="1" max="300">
              <span class="absolute right-14 font-cal-sans text-gray-400">cm</span>
              <div class="absolute right-2 flex flex-col gap-0.5">
                <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-300 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer profile-number-control" data-input="height" data-action="increment"><i class="fas fa-chevron-up text-xs"></i></button>
                <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-300 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer profile-number-control" data-input="height" data-action="decrement"><i class="fas fa-chevron-down text-xs"></i></button>
              </div>
            </div>`
              : `<div class="bg-white rounded-full px-5 py-3 font-cal-sans text-base text-gray-400 shadow-sm">${
                  userData.height || ""
                } cm</div>`
          }
        </div>
      </div>
      
      <!-- Target Weight and Activity Level Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <!-- Target Weight Field -->
        <div class="flex flex-col">
          <label for="targetWeight${layoutPrefix}" class="text-base text-gray-800 mb-2 font-cal-sans">Target Weight</label>
          ${
            isEditMode
              ? `<div class="relative flex items-center">
              <input type="number" id="targetWeight${layoutPrefix}" class="profile-target-weight-input bg-white border-none rounded-full px-5 py-3 pr-16 font-cal-sans text-base text-gray-400 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" value="${
                  userData.targetWeight || ""
                }" min="1" max="500">
              <span class="absolute right-14 font-cal-sans text-gray-400">kg</span>
              <div class="absolute right-2 flex flex-col gap-0.5">
                <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-300 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer profile-number-control" data-input="targetWeight" data-action="increment"><i class="fas fa-chevron-up text-xs"></i></button>
                <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-300 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer profile-number-control" data-input="targetWeight" data-action="decrement"><i class="fas fa-chevron-down text-xs"></i></button>
              </div>
            </div>`
              : `<div class="bg-white rounded-full px-5 py-3 font-cal-sans text-base text-gray-400 shadow-sm">${
                  userData.targetWeight || ""
                } ${userData.targetWeight ? "kg" : ""}</div>`
          }
        </div>
        
        <!-- Activity Level Field -->
        <div class="flex flex-col">
          <label for="activityLevel${layoutPrefix}" class="text-base text-gray-800 mb-2 font-cal-sans">Activity Level</label>
          ${
            isEditMode
              ? `
            <div class="relative">
              <select id="activityLevel${layoutPrefix}" class="profile-activity-level-input bg-white border-none rounded-full px-5 py-3 pr-10 font-cal-sans text-base text-gray-400 w-full shadow-sm cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-accent-green">
                <option value="" disabled ${
                  !userData.activityLevel ? "selected" : ""
                }>Select level</option>
                <option value="daily" ${
                  userData.activityLevel === "daily" ? "selected" : ""
                }>Daily</option>
                <option value="regularly" ${
                  userData.activityLevel === "regularly" ? "selected" : ""
                }>Regularly</option>
                <option value="occasionally" ${
                  userData.activityLevel === "occasionally" ? "selected" : ""
                }>Occasionally</option>
                <option value="rarely" ${
                  userData.activityLevel === "rarely" ? "selected" : ""
                }>Rarely</option>
                <option value="never" ${
                  userData.activityLevel === "never" ? "selected" : ""
                }>Never</option>
              </select>
              <div class="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-300 pointer-events-none"><i class="fas fa-chevron-down"></i></div>
            </div>
          `
              : `
            <div class="bg-white rounded-full px-5 py-3 font-cal-sans text-base text-gray-400 shadow-sm">${getActivityLevelDisplay(
              userData.activityLevel
            )}</div>
          `
          }
        </div>
      </div>
    `;
  };

  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Mobile Layout: Stack vertically -->
      <div class="block lg:hidden">
        <!-- Header with title centered -->
        <div class="text-center mb-8">
          <h2 class="text-3xl text-gray-800 font-cal-sans">User Profile</h2>
        </div>
        
        <!-- Avatar centered for mobile -->
        <div class="flex justify-center mb-8">
          <div class="relative w-48 h-48 sm:w-56 sm:h-56">
            <div class="w-full h-full bg-white rounded-full overflow-hidden shadow-lg border-4 border-accent-yellow transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img src="${
                userData.avatar || "./public/image/default-avatar.png"
              }" alt="User Avatar" id="user-avatar-mobile" class="profile-avatar w-full h-full object-cover transition-all duration-300">
            </div>
            ${
              isEditMode
                ? `
              <div class="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg text-amber-900 transition-all duration-200 hover:bg-accent-green hover:text-white z-10 border-2 border-accent-green profile-edit-avatar-btn" style="right: 0.375rem; bottom: 0.375rem;">
                <i class="fas fa-pencil-alt text-sm"></i>
              </div>
              <div class="absolute right-4 bottom-16 bg-white rounded-lg shadow-xl z-20 overflow-hidden hidden min-w-max profile-avatar-options">
                <div class="px-4 py-3 cursor-pointer transition-colors duration-200 whitespace-nowrap hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 profile-camera-option">
                  <i class="fas fa-camera w-4 text-amber-900"></i> 
                  <span class="font-cal-sans text-sm text-gray-500">Take photo</span>
                </div>
                <div class="px-4 py-3 cursor-pointer transition-colors duration-200 whitespace-nowrap hover:bg-gray-50 flex items-center gap-3 profile-gallery-option">
                  <i class="fas fa-images w-4 text-amber-900"></i> 
                  <span class="font-cal-sans text-sm text-gray-500">Choose from gallery</span>
                </div>
              </div>
              <input type="file" class="profile-file-input" accept="image/*" style="display: none;">
              <canvas class="profile-camera-canvas" style="display: none;"></canvas>
            `
                : ""
            }
          </div>
        </div>
        
        <!-- Sign Out Button for mobile (if not edit mode) -->
        ${
          !isEditMode
            ? `
          <div class="flex justify-center mb-8">
            <button class="px-8 py-3 rounded-full text-base cursor-pointer transition-all duration-200 border-none font-cal-sans bg-amber-900 text-white hover:bg-amber-800 profile-sign-out-btn">Sign Out</button>
          </div>
        `
            : ""
        }
        
        <!-- Form fields for mobile -->
        <div class="space-y-6">
          ${generateFormFields(
            userData,
            isEditMode,
            getActivityLevelDisplay,
            "-mobile"
          )}
        </div>
        
        <!-- Action button for mobile -->
        <div class="mt-8 flex justify-center">
          ${
            isEditMode
              ? `<button class="px-8 py-3 rounded-full text-base cursor-pointer transition-all duration-200 border-none bg-yellow-300 text-amber-900 font-cal-sans hover:bg-yellow-200 profile-save-data-btn">Save Data</button>`
              : `<button class="px-8 py-3 rounded-full text-base cursor-pointer transition-all duration-200 border-none bg-yellow-300 text-amber-900 font-cal-sans hover:bg-yellow-200 profile-update-data-btn">Update Data</button>`
          }
        </div>
      </div>

      <!-- Desktop Layout: Side by side -->
      <div class="hidden lg:flex gap-12">
        <!-- Left side - Avatar and title -->
        <div class="flex-shrink-0 w-64 flex flex-col items-center justify-start">
          <!-- Title centered above avatar -->
          <h2 class="text-3xl text-gray-800 mb-6 font-cal-sans text-center">User Profile</h2>
          
          <!-- Avatar -->
          <div class="relative w-56 h-56 mb-6">
            <div class="w-full h-full bg-white rounded-full overflow-hidden shadow-lg border-4 border-accent-yellow transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img src="${
                userData.avatar || "./public/image/default-avatar.png"
              }" alt="User Avatar" id="user-avatar-desktop" class="profile-avatar w-full h-full object-cover transition-all duration-300">
            </div>
            ${
              isEditMode
                ? `
              <div class="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg text-amber-900 transition-all duration-200 hover:bg-accent-green hover:text-white z-10 border-2 border-accent-green profile-edit-avatar-btn" style="right: 0.375rem; bottom: 0.375rem;">
                <i class="fas fa-pencil-alt text-sm"></i>
              </div>
              <div class="absolute right-4 bottom-16 bg-white rounded-lg shadow-xl z-20 overflow-hidden hidden min-w-max profile-avatar-options">
                <div class="px-4 py-3 cursor-pointer transition-colors duration-200 whitespace-nowrap hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 profile-camera-option">
                  <i class="fas fa-camera w-4 text-amber-900"></i> 
                  <span class="font-cal-sans text-sm text-gray-500">Take photo</span>
                </div>
                <div class="px-4 py-3 cursor-pointer transition-colors duration-200 whitespace-nowrap hover:bg-gray-50 flex items-center gap-3 profile-gallery-option">
                  <i class="fas fa-images w-4 text-amber-900"></i> 
                  <span class="font-cal-sans text-sm text-gray-500">Choose from gallery</span>
                </div>
              </div>
              <input type="file" class="profile-file-input" accept="image/*" style="display: none;">
              <canvas class="profile-camera-canvas" style="display: none;"></canvas>
            `
                : ""
            }
          </div>
          
          <!-- Sign Out Button for desktop -->
          ${
            !isEditMode
              ? `<button class="px-8 py-3 rounded-full text-base cursor-pointer transition-all duration-200 border-none font-cal-sans bg-amber-900 text-white w-4/5 hover:bg-amber-800 profile-sign-out-btn">Sign Out</button>`
              : ""
          }
        </div>
        
        <!-- Right side - Form fields -->
        <div class="flex-1 min-w-0">
          <div class="space-y-6">
            ${generateFormFields(
              userData,
              isEditMode,
              getActivityLevelDisplay,
              "-desktop"
            )}
          </div>
          
          <!-- Action button for desktop -->
          <div class="mt-8 flex justify-center">
            ${
              isEditMode
                ? `<button class="px-8 py-3 rounded-full text-base cursor-pointer transition-all duration-200 border-none bg-yellow-300 text-amber-900 font-cal-sans hover:bg-yellow-200 profile-save-data-btn">Save Data</button>`
                : `<button class="px-8 py-3 rounded-full text-base cursor-pointer transition-all duration-200 border-none bg-yellow-300 text-amber-900 font-cal-sans hover:bg-yellow-200 profile-update-data-btn">Update Data</button>`
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Camera Modal (same for both layouts) -->
    <div id="camera-modal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 justify-center items-center z-50 hidden">
      <div class="bg-white rounded-2xl max-w-[90%] max-h-[90%] w-[600px] shadow-2xl overflow-hidden">
        <div class="bg-accent-green text-white px-5 py-5 flex justify-between items-center">
          <h3 class="m-0 text-2xl font-cal-sans">Take Photo</h3>
          <button class="text-white text-3xl cursor-pointer w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-white hover:bg-opacity-20 bg-none border-none" id="camera-close-btn">&times;</button>
        </div>
        <div class="p-5 text-center bg-gray-50">
          <video id="camera-video" autoplay playsinline class="w-full max-w-lg h-auto rounded-lg shadow-lg"></video>
          <canvas id="camera-preview-canvas" style="display: none;" class="w-full max-w-lg h-auto rounded-lg shadow-lg"></canvas>
        </div>
        <div class="p-5 bg-white flex gap-4 justify-center border-t border-gray-200 flex-wrap">
          <button class="px-6 py-3 border-none rounded-full text-base font-cal-sans cursor-pointer transition-all duration-300 flex items-center gap-2 bg-yellow-300 text-amber-900 hover:bg-yellow-200 hover:-translate-y-0.5 hover:shadow-lg" id="camera-capture-btn">
            <i class="fas fa-camera"></i> Capture
          </button>
          <button class="px-6 py-3 border-none rounded-full text-base font-cal-sans cursor-pointer transition-all duration-300 items-center gap-2 bg-gray-600 text-white hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hidden" id="camera-retake-btn">
            <i class="fas fa-redo"></i> Retake
          </button>
          <button class="px-6 py-3 border-none rounded-full text-base font-cal-sans cursor-pointer transition-all duration-300 items-center gap-2 bg-accent-green text-white hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg hidden" id="camera-use-btn">
            <i class="fas fa-check"></i> Use Photo
          </button>
        </div>
      </div>
    </div>
  `;
};

export default {
  render(container, userData, isEditMode = false) {
    const header = new Header();
    const headerContainer =
      document.getElementById("header-container") ||
      document.querySelector("header");

    if (headerContainer) {
      headerContainer.innerHTML = header.render("page", "profile");
    }

    container.innerHTML = createProfileTemplate(userData, isEditMode);
  },

  createProfileHeader() {
    return `
      <div class="kalkulori-profile-header bg-yellow-200 py-4 shadow-lg sticky top-0 z-30 mb-0">
        <div class="max-w-6xl mx-auto flex justify-between items-center px-5 flex-col md:flex-row gap-4 md:gap-0">
          <div class="text-3xl md:text-4xl font-bold text-amber-900 font-cal-sans">
            <span class="text-lime-600">kalku</span>lori
          </div>
          <nav>
            <ul class="flex gap-6 md:gap-10 list-none m-0 p-0">
              <li class="text-lg font-medium">
                <a href="#/" class="no-underline text-amber-900 transition-all duration-300 px-4 py-2 rounded-2xl font-roboto-slab hover:text-lime-600 hover:bg-lime-600 hover:bg-opacity-10">Home</a>
              </li>
              <li class="text-lg font-medium">
                <a href="#/history" class="no-underline text-amber-900 transition-all duration-300 px-4 py-2 rounded-2xl font-roboto-slab hover:text-lime-600 hover:bg-lime-600 hover:bg-opacity-10">History</a>
              </li>
              <li class="text-lg font-medium">
                <a href="#/profile" class="no-underline text-lime-600 font-semibold bg-lime-600 bg-opacity-20 px-4 py-2 rounded-2xl font-roboto-slab">Profile</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    `;
  },

  toggleHeaders(showProfileHeader = true) {
    const existingProfileHeaders = document.querySelectorAll(
      ".kalkulori-profile-header"
    );
    existingProfileHeaders.forEach((header) => header.remove());

    const homeHeader = document.querySelector("header");

    if (showProfileHeader) {
      const header = new Header();
      const headerContainer =
        document.getElementById("header-container") || homeHeader;

      if (headerContainer) {
        headerContainer.innerHTML = header.render("page", "profile");
      }
    } else {
      if (homeHeader) {
        homeHeader.style.display = "block";
      }
    }
  },

  showAvatarOptions() {
    const avatarOptions = document.querySelectorAll(".profile-avatar-options");
    avatarOptions.forEach((option) => {
      option.classList.remove("hidden");
      option.style.display = "block";
    });
  },

  hideAvatarOptions() {
    const avatarOptions = document.querySelectorAll(".profile-avatar-options");
    avatarOptions.forEach((option) => {
      option.classList.add("hidden");
      option.style.display = "none";
    });
  },

  validateImageFile(file) {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return false;
    }

    if (file.size > maxSize) {
      alert("Image size should be less than 5MB");
      return false;
    }

    return true;
  },

  resizeImage(file, maxWidth = 300, maxHeight = 300, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
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

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, "image/jpeg", quality);
      };

      img.src = URL.createObjectURL(file);
    });
  },

  blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  },

  showCameraModal() {
    const modal = document.getElementById("camera-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.style.overflow = "hidden";
    }
  },

  hideCameraModal() {
    const modal = document.getElementById("camera-modal");
    const video = document.getElementById("camera-video");

    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "auto";
    }

    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  },

  toggleGenderOption(gender) {
    const maleOptions = document.querySelectorAll(".profile-male-option");
    const femaleOptions = document.querySelectorAll(".profile-female-option");

    if (gender === "male") {
      maleOptions.forEach((option) => {
        option.className =
          "flex-1 bg-accent-green text-white border-none rounded-full px-3 sm:px-5 py-3 font-cal-sans text-sm sm:text-base cursor-pointer transition-all duration-200 shadow-sm profile-male-option";
      });
      femaleOptions.forEach((option) => {
        option.className =
          "flex-1 bg-white text-gray-800 border-none rounded-full px-3 sm:px-5 py-3 font-cal-sans text-sm sm:text-base cursor-pointer transition-all duration-200 shadow-sm hover:bg-gray-50 profile-female-option";
      });
    } else if (gender === "female") {
      femaleOptions.forEach((option) => {
        option.className =
          "flex-1 bg-accent-green text-white border-none rounded-full px-3 sm:px-5 py-3 font-cal-sans text-sm sm:text-base cursor-pointer transition-all duration-200 shadow-sm profile-female-option";
      });
      maleOptions.forEach((option) => {
        option.className =
          "flex-1 bg-white text-gray-800 border-none rounded-full px-3 sm:px-5 py-3 font-cal-sans text-sm sm:text-base cursor-pointer transition-all duration-200 shadow-sm hover:bg-gray-50 profile-male-option";
      });
    }
  },

  getUserData() {
    // Try to get from visible inputs (mobile or desktop)
    const nameInput =
      document.querySelector(
        ".profile-name-input:not([style*='display: none'])"
      ) || document.querySelector(".profile-name-input");
    const ageInput =
      document.querySelector(
        ".profile-age-input:not([style*='display: none'])"
      ) || document.querySelector(".profile-age-input");
    const weightInput =
      document.querySelector(
        ".profile-weight-input:not([style*='display: none'])"
      ) || document.querySelector(".profile-weight-input");
    const heightInput =
      document.querySelector(
        ".profile-height-input:not([style*='display: none'])"
      ) || document.querySelector(".profile-height-input");
    const targetWeightInput =
      document.querySelector(
        ".profile-target-weight-input:not([style*='display: none'])"
      ) || document.querySelector(".profile-target-weight-input");
    const activityLevelInput =
      document.querySelector(
        ".profile-activity-level-input:not([style*='display: none'])"
      ) || document.querySelector(".profile-activity-level-input");

    if (!nameInput) return null;

    // Get gender from active option
    let gender = "male";
    const femaleOption = document.querySelector(
      ".profile-female-option.bg-accent-green"
    );
    if (femaleOption) {
      gender = "female";
    }

    return {
      name: nameInput.value,
      gender,
      age: ageInput.value,
      weight: weightInput.value,
      height: heightInput.value,
      targetWeight: targetWeightInput.value,
      activityLevel: activityLevelInput.value,
    };
  },

  attachEventHandlers(handlers) {
    // Use class selectors for elements that appear in both layouts
    const editAvatarBtns = document.querySelectorAll(
      ".profile-edit-avatar-btn"
    );
    const cameraOptions = document.querySelectorAll(".profile-camera-option");
    const galleryOptions = document.querySelectorAll(".profile-gallery-option");
    const fileInputs = document.querySelectorAll(".profile-file-input");
    const maleOptions = document.querySelectorAll(".profile-male-option");
    const femaleOptions = document.querySelectorAll(".profile-female-option");
    const updateDataBtns = document.querySelectorAll(
      ".profile-update-data-btn"
    );
    const saveDataBtns = document.querySelectorAll(".profile-save-data-btn");
    const signOutBtns = document.querySelectorAll(".profile-sign-out-btn");

    // Single elements (camera modal)
    const cameraCloseBtn = document.getElementById("camera-close-btn");
    const cameraCaptureBtn = document.getElementById("camera-capture-btn");
    const cameraRetakeBtn = document.getElementById("camera-retake-btn");
    const cameraUseBtn = document.getElementById("camera-use-btn");

    editAvatarBtns.forEach((btn) => {
      if (handlers.onEditAvatarClicked) {
        btn.addEventListener("click", handlers.onEditAvatarClicked);
      }
    });

    cameraOptions.forEach((option) => {
      if (handlers.onCameraOptionClicked) {
        option.addEventListener("click", handlers.onCameraOptionClicked);
      }
    });

    galleryOptions.forEach((option) => {
      if (handlers.onGalleryOptionClicked) {
        option.addEventListener("click", handlers.onGalleryOptionClicked);
      }
    });

    fileInputs.forEach((input) => {
      if (handlers.onFileSelected) {
        input.addEventListener("change", handlers.onFileSelected);
      }
    });

    if (cameraCloseBtn && handlers.onCameraModalClose) {
      cameraCloseBtn.addEventListener("click", handlers.onCameraModalClose);
    }

    if (cameraCaptureBtn && handlers.onCameraCapture) {
      cameraCaptureBtn.addEventListener("click", handlers.onCameraCapture);
    }

    if (cameraRetakeBtn && handlers.onCameraRetake) {
      cameraRetakeBtn.addEventListener("click", handlers.onCameraRetake);
    }

    if (cameraUseBtn && handlers.onCameraUse) {
      cameraUseBtn.addEventListener("click", handlers.onCameraUse);
    }

    maleOptions.forEach((option) => {
      if (handlers.onGenderOptionClicked) {
        option.addEventListener("click", () =>
          handlers.onGenderOptionClicked("male")
        );
      }
    });

    femaleOptions.forEach((option) => {
      if (handlers.onGenderOptionClicked) {
        option.addEventListener("click", () =>
          handlers.onGenderOptionClicked("female")
        );
      }
    });

    updateDataBtns.forEach((btn) => {
      if (handlers.onUpdateDataClicked) {
        btn.addEventListener("click", handlers.onUpdateDataClicked);
      }
    });

    saveDataBtns.forEach((btn) => {
      if (handlers.onSaveDataClicked) {
        btn.addEventListener("click", handlers.onSaveDataClicked);
      }
    });

    signOutBtns.forEach((btn) => {
      if (handlers.onSignOutClicked) {
        btn.addEventListener("click", handlers.onSignOutClicked);
      }
    });

    // Number controls
    const numberControls = document.querySelectorAll(".profile-number-control");
    numberControls.forEach((button) => {
      button.addEventListener("click", () => {
        const inputId = button.getAttribute("data-input");
        const action = button.getAttribute("data-action");

        // Find the correct input in the current layout
        const input =
          button
            .closest(".space-y-6")
            .querySelector(`[data-input="${inputId}"]`) ||
          document.querySelector(`.profile-${inputId}-input`);

        if (action === "increment" && handlers.onNumberIncrease) {
          handlers.onNumberIncrease(inputId);
        } else if (action === "decrement" && handlers.onNumberDecrease) {
          handlers.onNumberDecrease(inputId);
        }
      });
    });

    // Click outside to close avatar options
    document.addEventListener("click", (event) => {
      const avatarOptions = document.querySelectorAll(
        ".profile-avatar-options"
      );
      const editAvatarBtns = document.querySelectorAll(
        ".profile-edit-avatar-btn"
      );

      let clickedInsideAny = false;
      avatarOptions.forEach((option) => {
        if (option.contains(event.target)) clickedInsideAny = true;
      });
      editAvatarBtns.forEach((btn) => {
        if (btn.contains(event.target)) clickedInsideAny = true;
      });

      if (!clickedInsideAny) {
        this.hideAvatarOptions();
      }
    });

    // Camera modal click outside to close
    const cameraModal = document.getElementById("camera-modal");
    if (cameraModal && handlers.onCameraModalClose) {
      cameraModal.addEventListener("click", (event) => {
        if (event.target === cameraModal) {
          handlers.onCameraModalClose();
        }
      });
    }
  },
};
