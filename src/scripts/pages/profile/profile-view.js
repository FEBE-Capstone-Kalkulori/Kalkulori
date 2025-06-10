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

  return `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl text-gray-800 mb-8 font-semibold">User Profile</h2>
      
      <div class="flex gap-12 flex-wrap lg:flex-nowrap">
        <div class="flex-shrink-0 w-64 flex flex-col items-center gap-6">
           <div class="relative w-56 h-56">
            <div class="w-full h-full bg-white rounded-full overflow-hidden shadow-lg border-4 border-accent-green transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img src="${
                userData.avatar || "./public/image/default-avatar.png"
              }" alt="User Avatar" id="user-avatar" class="w-full h-full object-cover transition-all duration-300">
            </div>
            ${
              isEditMode
                ? `
              <div class="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg text-amber-900 transition-all duration-200 hover:bg-accent-green hover:text-white z-10 border-2 border-accent-green" id="edit-avatar-btn" style="right: 0.375rem; bottom: 0.375rem;">
                <i class="fas fa-pencil-alt text-sm"></i>
              </div>
              <div class="absolute right-4 bottom-16 bg-white rounded-lg shadow-xl z-20 overflow-hidden hidden min-w-max" id="avatar-options">
                <div class="px-4 py-3 cursor-pointer transition-colors duration-200 whitespace-nowrap hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100" id="camera-option">
                  <i class="fas fa-camera w-4 text-amber-900"></i> 
                  <span class="text-sm text-gray-700">Take photo</span>
                </div>
                <div class="px-4 py-3 cursor-pointer transition-colors duration-200 whitespace-nowrap hover:bg-gray-50 flex items-center gap-3" id="gallery-option">
                  <i class="fas fa-images w-4 text-amber-900"></i> 
                  <span class="text-sm text-gray-700">Choose from gallery</span>
                </div>
              </div>
              <input type="file" id="file-input" accept="image/*" style="display: none;">
              <canvas id="camera-canvas" style="display: none;"></canvas>
            `
                : ""
            }
          </div>
          ${
            !isEditMode
              ? `
            <button class="px-8 py-3 rounded-full text-base cursor-pointer transition-all duration-200 border-none font-medium bg-amber-900 text-white w-4/5 hover:bg-amber-800" id="sign-out-btn">Sign Out</button>
          `
              : ""
          }
        </div>
        
        <div class="flex-1 min-w-80">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col mb-4">
              <label for="name" class="text-base text-gray-800 mb-2 font-medium">Name</label>
              ${
                isEditMode
                  ? `<input type="text" id="name" class="bg-white border-none rounded-full px-5 py-3 text-base text-gray-800 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green" value="${
                      userData.name || ""
                    }" placeholder="Enter your name">`
                  : `<div class="bg-white rounded-full px-5 py-3 text-base text-gray-800 shadow-sm">${
                      userData.name || ""
                    }</div>`
              }
            </div>
            
            <div class="flex gap-8 flex-wrap">
              <div class="flex flex-col flex-1 min-w-52 mb-4">
                <label class="text-base text-gray-800 mb-2 font-medium">Gender</label>
                ${
                  isEditMode
                    ? `
                  <div class="flex gap-4">
                    <button class="flex-1 bg-white border-none rounded-full px-5 py-3 text-base text-gray-800 cursor-pointer transition-all duration-200 shadow-sm ${
                      userData.gender === "male"
                        ? "bg-accent-green text-white"
                        : "hover:bg-gray-50"
                    }" id="male-option">
                      <i class="fas fa-male mr-2"></i> I am Male
                    </button>
                    <button class="flex-1 bg-white border-none rounded-full px-5 py-3 text-base text-gray-800 cursor-pointer transition-all duration-200 shadow-sm ${
                      userData.gender === "female"
                        ? "bg-accent-green text-white"
                        : "hover:bg-gray-50"
                    }" id="female-option">
                      <i class="fas fa-female mr-2"></i> I am Female
                    </button>
                  </div>
                `
                    : `
                  <div class="bg-white rounded-full px-5 py-3 text-base text-gray-800 shadow-sm">${
                    userData.gender === "male"
                      ? "Male"
                      : userData.gender === "female"
                      ? "Female"
                      : ""
                  }</div>
                `
                }
              </div>
              
              <div class="flex flex-col flex-1 min-w-52 mb-4">
                <label for="age" class="text-base text-gray-800 mb-2 font-medium">Age</label>
                ${
                  isEditMode
                    ? `<div class="relative flex items-center">
                    <input type="number" id="age" class="bg-white border-none rounded-full px-5 py-3 pr-16 text-base text-gray-800 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" value="${
                      userData.age || ""
                    }" min="1" max="120">
                    <div class="absolute right-2 flex flex-col gap-0.5">
                      <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-500 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer" data-input="age" data-action="increment"><i class="fas fa-chevron-up text-xs"></i></button>
                      <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-500 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer" data-input="age" data-action="decrement"><i class="fas fa-chevron-down text-xs"></i></button>
                    </div>
                  </div>`
                    : `<div class="bg-white rounded-full px-5 py-3 text-base text-gray-800 shadow-sm">${
                        userData.age || ""
                      }</div>`
                }
              </div>
            </div>
            
            <div class="flex gap-8 flex-wrap">
              <div class="flex flex-col flex-1 min-w-52 mb-4">
                <label for="weight" class="text-base text-gray-800 mb-2 font-medium">Weight</label>
                ${
                  isEditMode
                    ? `<div class="relative flex items-center">
                    <input type="number" id="weight" class="bg-white border-none rounded-full px-5 py-3 pr-16 text-base text-gray-800 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" value="${
                      userData.weight || ""
                    }" min="1" max="500">
                    <span class="absolute right-14 text-gray-500">kg</span>
                    <div class="absolute right-2 flex flex-col gap-0.5">
                      <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-500 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer" data-input="weight" data-action="increment"><i class="fas fa-chevron-up text-xs"></i></button>
                      <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-500 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer" data-input="weight" data-action="decrement"><i class="fas fa-chevron-down text-xs"></i></button>
                    </div>
                  </div>`
                    : `<div class="bg-white rounded-full px-5 py-3 text-base text-gray-800 shadow-sm">${
                        userData.weight || ""
                      } kg</div>`
                }
              </div>
              
              <div class="flex flex-col flex-1 min-w-52 mb-4">
                <label for="height" class="text-base text-gray-800 mb-2 font-medium">Height</label>
                ${
                  isEditMode
                    ? `<div class="relative flex items-center">
                    <input type="number" id="height" class="bg-white border-none rounded-full px-5 py-3 pr-16 text-base text-gray-800 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" value="${
                      userData.height || ""
                    }" min="1" max="300">
                    <span class="absolute right-14 text-gray-500">cm</span>
                    <div class="absolute right-2 flex flex-col gap-0.5">
                      <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-500 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer" data-input="height" data-action="increment"><i class="fas fa-chevron-up text-xs"></i></button>
                      <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-500 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer" data-input="height" data-action="decrement"><i class="fas fa-chevron-down text-xs"></i></button>
                    </div>
                  </div>`
                    : `<div class="bg-white rounded-full px-5 py-3 text-base text-gray-800 shadow-sm">${
                        userData.height || ""
                      } cm</div>`
                }
              </div>
            </div>
            
            <div class="flex gap-8 flex-wrap">
              <div class="flex flex-col flex-1 min-w-52 mb-4">
                <label for="targetWeight" class="text-base text-gray-800 mb-2 font-medium">Target Weight</label>
                ${
                  isEditMode
                    ? `<div class="relative flex items-center">
                    <input type="number" id="targetWeight" class="bg-white border-none rounded-full px-5 py-3 pr-16 text-base text-gray-800 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" value="${
                      userData.targetWeight || ""
                    }" min="1" max="500">
                    <span class="absolute right-14 text-gray-500">kg</span>
                    <div class="absolute right-2 flex flex-col gap-0.5">
                      <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-500 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer" data-input="targetWeight" data-action="increment"><i class="fas fa-chevron-up text-xs"></i></button>
                      <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-500 transition-colors duration-200 hover:text-accent-green bg-none border-none cursor-pointer" data-input="targetWeight" data-action="decrement"><i class="fas fa-chevron-down text-xs"></i></button>
                    </div>
                  </div>`
                    : `<div class="bg-white rounded-full px-5 py-3 text-base text-gray-800 shadow-sm">${
                        userData.targetWeight || ""
                      } ${userData.targetWeight ? "kg" : ""}</div>`
                }
              </div>
              
              <div class="flex flex-col flex-1 min-w-52 mb-4">
                <label for="activityLevel" class="text-base text-gray-800 mb-2 font-medium">Activity Level</label>
                ${
                  isEditMode
                    ? `
                  <div class="relative">
                    <select id="activityLevel" class="bg-white border-none rounded-full px-5 py-3 pr-10 text-base text-gray-800 w-full shadow-sm cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-accent-green">
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
                        userData.activityLevel === "occasionally"
                          ? "selected"
                          : ""
                      }>Occasionally</option>
                      <option value="rarely" ${
                        userData.activityLevel === "rarely" ? "selected" : ""
                      }>Rarely</option>
                      <option value="never" ${
                        userData.activityLevel === "never" ? "selected" : ""
                      }>Never</option>
                    </select>
                    <div class="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"><i class="fas fa-chevron-down"></i></div>
                  </div>
                `
                    : `
                  <div class="bg-white rounded-full px-5 py-3 text-base text-gray-800 shadow-sm">${getActivityLevelDisplay(
                    userData.activityLevel
                  )}</div>
                `
                }
              </div>
            </div>
          </div>
          
          <div class="mt-8 flex justify-center">
            ${
              isEditMode
                ? `
              <button class="px-8 py-3 rounded-full text-base cursor-pointer transition-all duration-200 border-none bg-yellow-300 text-amber-900 font-medium hover:bg-yellow-200" id="save-data-btn">Save Data</button>
            `
                : `
              <button class="px-8 py-3 rounded-full text-base cursor-pointer transition-all duration-200 border-none bg-yellow-300 text-amber-900 font-medium hover:bg-yellow-200" id="update-data-btn">Update Data</button>
            `
            }
          </div>
        </div>
      </div>
    </div>

    <div id="camera-modal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 justify-center items-center z-50 hidden">
      <div class="bg-white rounded-2xl max-w-[90%] max-h-[90%] w-[600px] shadow-2xl overflow-hidden">
        <div class="bg-accent-green text-white px-5 py-5 flex justify-between items-center">
          <h3 class="m-0 text-2xl font-semibold">Take Photo</h3>
          <button class="text-white text-3xl cursor-pointer w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-white hover:bg-opacity-20 bg-none border-none" id="camera-close-btn">&times;</button>
        </div>
        <div class="p-5 text-center bg-gray-50">
          <video id="camera-video" autoplay playsinline class="w-full max-w-lg h-auto rounded-lg shadow-lg"></video>
          <canvas id="camera-preview-canvas" style="display: none;" class="w-full max-w-lg h-auto rounded-lg shadow-lg"></canvas>
        </div>
        <div class="p-5 bg-white flex gap-4 justify-center border-t border-gray-200 flex-wrap">
          <button class="px-6 py-3 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 bg-yellow-300 text-amber-900 hover:bg-yellow-200 hover:-translate-y-0.5 hover:shadow-lg" id="camera-capture-btn">
            <i class="fas fa-camera"></i> Capture
          </button>
          <button class="px-6 py-3 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 items-center gap-2 bg-gray-600 text-white hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hidden" id="camera-retake-btn">
            <i class="fas fa-redo"></i> Retake
          </button>
          <button class="px-6 py-3 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 items-center gap-2 bg-accent-green text-white hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg hidden" id="camera-use-btn">
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
    const avatarOptions = document.getElementById("avatar-options");
    if (avatarOptions) {
      avatarOptions.classList.remove("hidden");
      avatarOptions.style.display = "block";
    }
  },

  hideAvatarOptions() {
    const avatarOptions = document.getElementById("avatar-options");
    if (avatarOptions) {
      avatarOptions.classList.add("hidden");
      avatarOptions.style.display = "none";
    }
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
    const maleOption = document.getElementById("male-option");
    const femaleOption = document.getElementById("female-option");

    if (gender === "male") {
      maleOption.className =
        "flex-1 bg-accent-green text-white border-none rounded-full px-5 py-3 text-base cursor-pointer transition-all duration-200 shadow-sm";
      femaleOption.className =
        "flex-1 bg-white text-gray-800 border-none rounded-full px-5 py-3 text-base cursor-pointer transition-all duration-200 shadow-sm hover:bg-gray-50";
    } else if (gender === "female") {
      femaleOption.className =
        "flex-1 bg-accent-green text-white border-none rounded-full px-5 py-3 text-base cursor-pointer transition-all duration-200 shadow-sm";
      maleOption.className =
        "flex-1 bg-white text-gray-800 border-none rounded-full px-5 py-3 text-base cursor-pointer transition-all duration-200 shadow-sm hover:bg-gray-50";
    }
  },

  getUserData() {
    if (!document.getElementById("name")) return null;

    let gender = "male";
    const femaleOption = document.getElementById("female-option");
    if (femaleOption && femaleOption.classList.contains("bg-accent-green")) {
      gender = "female";
    }

    return {
      name: document.getElementById("name").value,
      gender,
      age: document.getElementById("age").value,
      weight: document.getElementById("weight").value,
      height: document.getElementById("height").value,
      targetWeight: document.getElementById("targetWeight").value,
      activityLevel: document.getElementById("activityLevel").value,
    };
  },

  attachEventHandlers(handlers) {
    const editAvatarBtn = document.getElementById("edit-avatar-btn");
    const cameraOption = document.getElementById("camera-option");
    const galleryOption = document.getElementById("gallery-option");
    const fileInput = document.getElementById("file-input");
    const maleOption = document.getElementById("male-option");
    const femaleOption = document.getElementById("female-option");
    const updateDataBtn = document.getElementById("update-data-btn");
    const saveDataBtn = document.getElementById("save-data-btn");
    const signOutBtn = document.getElementById("sign-out-btn");

    const cameraCloseBtn = document.getElementById("camera-close-btn");
    const cameraCaptureBtn = document.getElementById("camera-capture-btn");
    const cameraRetakeBtn = document.getElementById("camera-retake-btn");
    const cameraUseBtn = document.getElementById("camera-use-btn");

    if (editAvatarBtn && handlers.onEditAvatarClicked) {
      editAvatarBtn.addEventListener("click", handlers.onEditAvatarClicked);
    }

    if (cameraOption && handlers.onCameraOptionClicked) {
      cameraOption.addEventListener("click", handlers.onCameraOptionClicked);
    }

    if (galleryOption && handlers.onGalleryOptionClicked) {
      galleryOption.addEventListener("click", handlers.onGalleryOptionClicked);
    }

    if (fileInput && handlers.onFileSelected) {
      fileInput.addEventListener("change", handlers.onFileSelected);
    }

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

    if (maleOption && handlers.onGenderOptionClicked) {
      maleOption.addEventListener("click", () =>
        handlers.onGenderOptionClicked("male")
      );
    }

    if (femaleOption && handlers.onGenderOptionClicked) {
      femaleOption.addEventListener("click", () =>
        handlers.onGenderOptionClicked("female")
      );
    }

    if (updateDataBtn && handlers.onUpdateDataClicked) {
      updateDataBtn.addEventListener("click", handlers.onUpdateDataClicked);
    }

    if (saveDataBtn && handlers.onSaveDataClicked) {
      saveDataBtn.addEventListener("click", handlers.onSaveDataClicked);
    }

    if (signOutBtn && handlers.onSignOutClicked) {
      signOutBtn.addEventListener("click", handlers.onSignOutClicked);
    }

    const numberControls = document.querySelectorAll("[data-action]");
    numberControls.forEach((button) => {
      button.addEventListener("click", () => {
        const inputId = button.getAttribute("data-input");
        const action = button.getAttribute("data-action");

        if (action === "increment" && handlers.onNumberIncrease) {
          handlers.onNumberIncrease(inputId);
        } else if (action === "decrement" && handlers.onNumberDecrease) {
          handlers.onNumberDecrease(inputId);
        }
      });
    });

    document.addEventListener("click", (event) => {
      const avatarOptions = document.getElementById("avatar-options");
      const editAvatarBtn = document.getElementById("edit-avatar-btn");

      if (avatarOptions && editAvatarBtn) {
        if (
          !avatarOptions.contains(event.target) &&
          !editAvatarBtn.contains(event.target)
        ) {
          this.hideAvatarOptions();
        }
      }
    });

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
