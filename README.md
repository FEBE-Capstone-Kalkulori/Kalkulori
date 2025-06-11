<h1 align="center"><b>Kalkulori</b>: Aplikasi Penghitung Kalori</h1>
<div align="center">
  <img src="./src/public/image/Kalkulori-LOGO-Text.png" width="300" alt="Logo Kalkulori" />
  <h4>Aplikasi web untuk tracking kalori dan rekomendasi makanan dengan interface yang modern dan responsif.</h4>
</div>

---

## ℹ️ Info Umum

📌 **Kalkulori** adalah aplikasi web yang menyediakan interface untuk tracking kalori dan mendapatkan rekomendasi makanan yang personal. Aplikasi ini dibangun menggunakan **Node.js** dengan **Webpack** sebagai bundler dan **Tailwind CSS** untuk styling yang modern dan responsif.

🔍 Aplikasi ini memiliki **antarmuka pengguna yang intuitif**, yang memungkinkan pengguna untuk:
* 🎯 Melacak konsumsi kalori harian dengan mudah dan akurat.
* 💡 Mendapatkan rekomendasi makanan berdasarkan preferensi dan target diet.
* ❄️ Mengelola profil kesehatan dan target diet personal.
* 📝 Melihat riwayat konsumsi dan progress penurunan/penambahan berat badan.

### ⚠️ Tantangan yang Dihadapi

Dalam pengembangan frontend untuk aplikasi tracking kalori, beberapa tantangan utama yang dihadapi meliputi:
* **🔄 Real-time Data Sync**: Memastikan data kalori dan nutrisi terupdate secara real-time tanpa perlu refresh halaman.
* **⚙️ Complex State Management**: Mengelola state aplikasi yang kompleks tanpa menggunakan framework seperti React atau Vue.
* **📊 Data Visualization**: Menampilkan data nutrisi dan progress dalam bentuk yang mudah dipahami dan menarik.
* **🚀 Performance Optimization**: Memastikan aplikasi tetap responsif meskipun menangani data makanan yang besar.

---

## ✨ Fitur

Kalkulori Frontend menyediakan fitur-fitur utama berikut melalui interface yang user-friendly:

### 🔐 Authentication & User Management
* **👤 Sign In & Sign Up**: Interface login dan registrasi yang clean dengan validasi form real-time.
* **🔒 Route Protection**: Sistem routing yang melindungi halaman tertentu dari akses unauthorized.
* **📋 Profile Management**: Halaman profil untuk mengatur informasi personal, target diet, dan preferensi makanan.
  
### 🍽️ Food Search & Management
* **📊 Food Database**: Interface untuk mencari dan menjelajahi 50.000+ data makanan dengan fitur pencarian yang canggih.
* **🔍 Smart Search**: Fitur pencarian dengan autocomplete dan fuzzy matching untuk menemukan makanan dengan mudah.
* **➕ Add Meal**: Halaman khusus untuk menambahkan makanan ke daily log dengan interface yang intuitif.

### 📈 Daily Tracking & Logging
* **📝 Home Dashboard**: Dashboard utama yang menampilkan ringkasan kalori harian dan progress target.
* **📊 Nutritional Overview**: Visual representation dari intake nutrisi dengan progress bars dan charts.
* **📅 History Tracking**: Halaman history untuk melihat pola konsumsi dan progress jangka panjang.

### 🤖 Interactive Recommendations
* **🎯 Meal Suggestions**: Interface untuk menampilkan rekomendasi makanan dengan filter dan kategori.
* **📅 Meal Plan Display**: Tampilan meal plan yang terorganisir dengan opsi untuk add ke daily log.
* **⚖️ Calorie Balance**: Visual indicator untuk menunjukkan status kalori harian (deficit/surplus).

---

## 🛠️ Arsitektur & Pengembangan

### 🎨 Design System & UI Components
Kalkulori menggunakan design system yang konsisten dengan Tailwind CSS sebagai foundation. Setiap komponen didesain dengan prinsip responsive-first dan accessibility. Color palette menggunakan gradient yang modern dengan tema yang dapat disesuaikan. Typography menggunakan font family yang readable dan konsisten di seluruh aplikasi.

Interface mengutamakan user experience dengan animasi yang smooth dan feedback visual yang jelas. Loading states, error handling, dan success messages diimplementasikan dengan consistent pattern. Component styling menggunakan utility-first approach dari Tailwind CSS untuk maintainability yang optimal.

### 🔄 Single Page Application (SPA) Architecture
Aplikasi dibangun sebagai Single Page Application dengan custom routing system yang handle navigation tanpa page refresh. Route protection diimplementasikan untuk memastikan user authentication sebelum mengakses protected pages. Dynamic content loading menggunakan JavaScript modules untuk optimal performance dan code splitting.

State management dilakukan menggunakan vanilla JavaScript dengan custom event system untuk inter-component communication. Local storage digunakan untuk caching user preferences dan temporary data, sementara session management menggunakan JWT tokens yang disimpan secara secure.

### 🔐 Authentication Flow & Security
Authentication system terintegrasi dengan Firebase Authentication melalui custom AuthGuard utility. Token verification dilakukan secara automatic dengan refresh mechanism untuk seamless user experience. Route protection menggunakan middleware pattern yang check authentication status sebelum rendering protected pages.

Security measures meliputi CSRF protection, XSS prevention, dan secure storage untuk sensitive data. Input validation dilakukan di client-side sebelum API calls, dengan sanitization untuk user-generated content. Session management menggunakan secure cookies dan automatic logout untuk inactive sessions.

### 📊 Data Management & API Integration
API integration menggunakan custom service layer dengan consistent error handling dan retry mechanism. Data caching strategy untuk optimal performance dengan smart cache invalidation. Real-time updates menggunakan periodic polling untuk data synchronization.

Form handling menggunakan custom validation library dengan real-time feedback dan error messaging. File upload handling untuk profile pictures dan food images dengan progress indicators. Search functionality menggunakan debounced input dengan autocomplete suggestions.

---

## 💻 Teknologi
Proyek ini dikembangkan menggunakan teknologi-teknologi modern berikut:
- **Build Tool**: Webpack v5.80.0 dengan dev server
- **Styling**: Tailwind CSS v4.1.8
- **JavaScript**: ES6+ dengan Babel transpilation
- **Authentication**: Firebase integration
- **PWA**: Workbox untuk service worker
- **Development**: ESLint untuk code quality
- **HTTP Client**: Fetch API dengan custom wrapper
- **Bundling**: CSS/JS minification dan optimization

---

## 🗂️ Struktur Halaman

### Halaman Utama
```
📄 Home (/home)              # Dashboard utama dengan ringkasan kalori harian
📄 Profile (/profile)        # Halaman profil dan pengaturan user
📄 History (/history)        # Riwayat konsumsi dan progress tracking
📄 Add Meal (/add-meal)      # Halaman untuk menambah makanan ke daily log
```

### Halaman Autentikasi
```
📄 Sign In (/signin)         # Halaman login
📄 Sign Up (/signup)         # Halaman registrasi
```

### Fitur Interaktif
```
🔄 Meal Suggestions          # Rekomendasi makanan berbasis AI
📊 Progress Tracking         # Visual progress dan analytics
🔍 Food Search              # Pencarian makanan dengan filter
📱 Responsive Design        # Optimal di semua device
```

---

## ⚡ Setup & Installation

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

### Prerequisites
- Node.js (>= 14.0.0)
- NPM atau Yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/FEBE-Capstone-Kalkulori/Kalkulori.git
   cd Kalkulori
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Buat file konfigurasi untuk API endpoint di `src/scripts/config.js`:
   ```javascript
   const CONFIG = {
     API_BASE_URL: 'your-base-url',
     // ... other configurations
   };
   ```

4. **Development Server**
   ```bash
   npm run start-dev
   ```
   
   Aplikasi akan berjalan di `http://localhost:8080`

5. **Build untuk Production**
   ```bash
   npm run build
   ```
   
   Files akan di-generate di folder `dist/`

6. **Serve Production Build**
   ```bash
   npm run serve
   ```

### 🔧 Available Scripts

```bash
# Development server dengan hot reload
npm run start-dev

# Build untuk production
npm run build

# Serve production build
npm run serve

# Linting
npm run lint
```

---

## 📱 User Interface & Experience

### 🎨 Design Language
Kalkulori menggunakan design language yang modern dan clean dengan fokus pada usability. Color scheme menggunakan gradient yang eye-catching namun tetap professional. Typography hierarchy yang jelas untuk readability optimal di berbagai device size.

### 📊 Dashboard Interface
Home dashboard menampilkan overview kalori harian dengan progress bars yang intuitif. Card-based layout untuk menampilkan informasi nutrisi dengan visual yang menarik. Quick action buttons untuk akses cepat ke fitur utama seperti add meal dan meal suggestions.

### 🔍 Search & Discovery
Search interface menggunakan predictive text dengan real-time suggestions. Filter dan kategori untuk memudahkan discovery makanan. Visual food cards dengan nutritional information yang comprehensive namun tetap clean.

### 📈 Progress Tracking
History page dengan data visualization menggunakan charts dan graphs. Progress indicators untuk target kalori dan nutrisi. Timeline view untuk melihat perkembangan jangka panjang dengan milestone achievements.

---

## 🚀 Performance & Optimization

### ⚡ Loading Performance
- **Code Splitting**: Automatic route-based code splitting untuk faster initial load
- **Image Optimization**: Lazy loading dan responsive images dengan multiple formats
- **Asset Bundling**: Optimized bundling dengan tree shaking untuk smaller bundle size
- **Caching Strategy**: Intelligent caching dengan service worker untuk offline support

### 📱 Mobile Optimization
- **Responsive Design**: Mobile-first approach dengan fluid layouts
- **Touch Interactions**: Optimized untuk touch screens dengan proper tap targets
- **Performance Budgets**: Optimized untuk slow networks dan low-end devices

### 🔄 User Experience
- **Smooth Animations**: CSS transitions dan transforms untuk fluid interactions
- **Loading States**: Skeleton screens dan progress indicators untuk better perceived performance
- **Error Handling**: Graceful error handling dengan user-friendly messages
- **Accessibility**: WCAG compliant dengan keyboard navigation dan screen reader support

---

## 🛡️ Security & Privacy

### 🔐 Client-Side Security
- **Input Validation**: Client-side validation dengan sanitization untuk XSS prevention
- **Secure Storage**: Encrypted storage untuk sensitive data dengan automatic cleanup
- **Route Protection**: Authentication guards untuk protected routes
- **Content Security Policy**: CSP headers untuk additional security layer

### 🔒 Data Privacy
- **Local Data Handling**: Minimal data storage dengan automatic cleanup
- **Secure Communication**: HTTPS only dengan certificate pinning
- **User Consent**: Clear privacy controls dan data usage transparency
- **Session Management**: Secure session handling dengan automatic logout

---

## 📚 Browser Support

### ✅ Supported Browsers
- **Chrome**: 80+ (Recommended)
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

### 📱 Mobile Support
- **iOS Safari**: 13+
- **Chrome Mobile**: 80+
- **Samsung Internet**: 12+
- **Opera Mobile**: 60+

---
