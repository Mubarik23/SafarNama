/**
 * SafarNama PK - Master Application Controller & UI Orchestrator
 * Coordinates routing, rendering, search filtering, modals, and real-time state reactivity
 */

import { state } from './state.js';
import { travelMap } from './map.js';
import { safarAI } from './ai-planner.js';
import { bookingEngine } from './booking.js';
import { adminConsole } from './admin.js';
import { loadEnv } from './config.js';
import { authManager, evaluatePasswordStrength } from './auth.js';
import { initSupabase, getSupabase, checkSupabaseConnection } from './supabase.js';

class SafarNamaApp {
  constructor() {
    this.currentView = 'home';
    this.selectedDestinationFilter = 'all';
    this.selectedCategoryFilter = 'all';
    this.selectedTransportCategory = 'all';
    this.searchQuery = '';
    this.hotelSearchQuery = '';
    this.transportSearchQuery = '';
    this.budgetMaxPKR = 150000;

    // Explicitly bind and publish auth gate methods
    this.unlockAppShell = this.unlockAppShell.bind(this);
    this.lockAppShell = this.lockAppShell.bind(this);
    this.renderAuthGate = this.renderAuthGate.bind(this);
    this.submitGateLogin = this.submitGateLogin.bind(this);
    this.submitGateRegister = this.submitGateRegister.bind(this);
    this.submitGateResend = this.submitGateResend.bind(this);
    this.doLogout = this.doLogout.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.suggestStrongPassword = this.suggestStrongPassword.bind(this);
    this.toggleMapDirections = this.toggleMapDirections.bind(this);
    this.swapDirections = this.swapDirections.bind(this);
    this.quickRoute = this.quickRoute.bind(this);
    this.executeMapDirections = this.executeMapDirections.bind(this);
    this.clearCityRoute = this.clearCityRoute.bind(this);
    this.planAIWithRoute = this.planAIWithRoute.bind(this);
    window.safarnamaApp = this;
  }

  unlockAppShell() {
    const gate = document.getElementById('auth-gate-screen');
    const shell = document.getElementById('authenticated-app-shell');
    if (gate) {
      gate.style.display = 'none';
      gate.innerHTML = '';
    }
    if (shell) {
      shell.style.display = 'block';
    }
  }

  lockAppShell(initialTab = 'login', pendingEmail = null) {
    const gate = document.getElementById('auth-gate-screen');
    const shell = document.getElementById('authenticated-app-shell');
    if (shell) {
      shell.style.display = 'none';
    }
    if (gate) {
      gate.style.display = 'flex';
      this.renderAuthGate(initialTab, pendingEmail);
    }
  }

  renderAuthGate(tab = 'login', pendingEmail = null) {
    const gate = document.getElementById('auth-gate-screen');
    if (!gate) return;

    if (tab === 'verify') {
      gate.innerHTML = `
        <div class="auth-gate-card">
          <div class="verification-screen-box">
            <div class="verification-icon-wrap">
              <i class="fa-solid fa-envelope-open-text"></i>
            </div>
            <h2 class="verification-title">Verify Your Email Address</h2>
            <p class="verification-instruction">
              We have sent an official verification link to your email:
            </p>
            <div class="verification-email-pill">${pendingEmail || 'your email'}</div>
            
            <div class="verification-steps-list">
              <ol>
                <li>Open your email inbox (and spam/junk folder).</li>
                <li>Click the <strong>Confirm your email</strong> link sent by Supabase.</li>
                <li>Return here and Sign In to enter Pakistan's travel ecosystem!</li>
              </ol>
            </div>

            <div id="gate-verify-feedback" class="auth-feedback" style="display:none; margin-bottom: 1.25rem;"></div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button class="btn btn-emerald btn-full" id="gate-resend-btn" onclick="window.safarnamaApp.submitGateResend('${pendingEmail || ''}')">
                <i class="fa-solid fa-paper-plane"></i> Resend Verification Email
              </button>
              <button class="btn btn-ghost btn-full" onclick="window.safarnamaApp.renderAuthGate('login')">
                <i class="fa-solid fa-arrow-left"></i> Back to Sign In
              </button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    gate.innerHTML = `
      <div class="auth-gate-card">
        <div class="auth-gate-header">
          <div class="auth-gate-brand-logo">
            <i class="fa-solid fa-mountain-sun"></i>
          </div>
          <h1 class="auth-gate-title">SafarNama <span class="brand-badge-pk" style="font-size:0.9rem">PK 🇵🇰</span></h1>
          <p class="auth-gate-tagline">Pakistan's Real-Time Domestic Tour & Travel Ecosystem</p>
          <div class="auth-gate-supabase-tag">
            <i class="fa-solid fa-shield-halved"></i> Secured with Supabase Cloud Auth
          </div>
        </div>

        <div class="auth-gate-tabs">
          <button
            class="auth-gate-tab ${tab === 'login' ? 'active' : ''}"
            id="gate-tab-login"
            onclick="window.safarnamaApp.renderAuthGate('login')"
          >
            Sign In
          </button>
          <button
            class="auth-gate-tab ${tab === 'register' ? 'active' : ''}"
            id="gate-tab-register"
            onclick="window.safarnamaApp.renderAuthGate('register')"
          >
            Create Account
          </button>
        </div>

        <!-- Gate Sign In Form -->
        <div id="gate-form-login" style="display:${tab === 'login' ? 'block' : 'none'}">
          <div class="auth-form-group">
            <label><i class="fa-solid fa-envelope text-muted"></i> Email Address</label>
            <input type="email" id="gate-login-email" class="search-input" placeholder="traveler@safarnama.pk" autocomplete="email" />
          </div>

          <div class="auth-form-group">
            <label><i class="fa-solid fa-lock text-muted"></i> Password</label>
            <div class="auth-pw-wrap">
              <input type="password" id="gate-login-password" class="search-input" placeholder="Your password" autocomplete="current-password" />
              <button type="button" class="pw-eye-btn" onclick="window.safarnamaApp._togglePwVisibility('gate-login-password', this)">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
          </div>

          <div id="gate-login-error" class="auth-feedback" style="display:none"></div>

          <div class="auth-hint" style="margin-bottom: 1.25rem;">
            <i class="fa-solid fa-circle-info text-gold"></i>
            <span>Admin Testing: <strong>admin@safarnama.pk</strong> / <strong>Admin@1234</strong></span>
          </div>

          <button class="btn btn-emerald btn-full" id="gate-login-btn" onclick="window.safarnamaApp.submitGateLogin()">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In to Enter SafarNama
          </button>
        </div>

        <!-- Gate Register Form -->
        <div id="gate-form-register" style="display:${tab === 'register' ? 'block' : 'none'}">
          <div class="auth-form-group">
            <label><i class="fa-solid fa-user text-muted"></i> Full Name</label>
            <input type="text" id="gate-reg-name" class="search-input" placeholder="e.g. Muhammad Hamza" autocomplete="name" />
          </div>

          <div class="auth-form-group">
            <label><i class="fa-solid fa-envelope text-muted"></i> Email Address (Verification link will be sent)</label>
            <input type="email" id="gate-reg-email" class="search-input" placeholder="you@email.com" autocomplete="email" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="auth-form-group">
              <label><i class="fa-solid fa-phone text-muted"></i> Phone</label>
              <input type="tel" id="gate-reg-phone" class="search-input" placeholder="+92 300..." autocomplete="tel" />
            </div>
            <div class="auth-form-group">
              <label><i class="fa-solid fa-city text-muted"></i> City</label>
              <input type="text" id="gate-reg-city" class="search-input" placeholder="Lahore / Islamabad" />
            </div>
          </div>

          <div class="auth-form-group">
            <div class="auth-label-flex">
              <label for="gate-reg-password" style="margin-bottom:0;"><i class="fa-solid fa-lock text-muted"></i> Password (min 8 characters)</label>
              <button type="button" class="btn-suggest-pw" onclick="window.safarnamaApp.suggestStrongPassword('gate-reg-password', 'gate-pw-meter')">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Suggest Strong Password
              </button>
            </div>
            <div class="auth-pw-wrap" style="margin-top: 6px;">
              <input
                type="password"
                id="gate-reg-password"
                class="search-input"
                placeholder="Enter 8+ char secure password"
                autocomplete="new-password"
                oninput="window.safarnamaApp.handlePasswordInput(this.value, 'gate-pw-meter')"
              />
              <button type="button" class="pw-eye-btn" onclick="window.safarnamaApp._togglePwVisibility('gate-reg-password', this)">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>

            <!-- Live Password Strength Meter & Checklist -->
            <div id="gate-pw-meter" class="password-strength-container">
              <div class="strength-bar-track">
                <div class="strength-bar-fill" style="width: 0%;"></div>
              </div>
              <div class="strength-meta-row">
                <span class="strength-label-text text-muted">Strength: Enter password</span>
                <span class="strength-score-text text-muted">0 / 4</span>
              </div>
              <div class="strength-checklist">
                <div class="checklist-item" data-check="length"><i class="fa-regular fa-circle"></i> Min 8 characters</div>
                <div class="checklist-item" data-check="case"><i class="fa-regular fa-circle"></i> Mixed uppercase & lowercase</div>
                <div class="checklist-item" data-check="numsym"><i class="fa-regular fa-circle"></i> Numbers or symbols</div>
                <div class="checklist-item" data-check="common"><i class="fa-regular fa-circle"></i> Not easily guessed</div>
              </div>
            </div>
          </div>

          <div id="gate-reg-error" class="auth-feedback" style="display:none"></div>

          <button class="btn btn-emerald btn-full" id="gate-reg-btn" onclick="window.safarnamaApp.submitGateRegister()">
            <i class="fa-solid fa-paper-plane"></i> Create Account & Send Verification Email
          </button>
        </div>
      </div>
    `;

    // Bind Enter key
    const loginPw = document.getElementById('gate-login-password');
    if (loginPw) loginPw.addEventListener('keydown', e => { if (e.key === 'Enter') this.submitGateLogin(); });
    const regPw = document.getElementById('gate-reg-password');
    if (regPw) regPw.addEventListener('keydown', e => { if (e.key === 'Enter') this.submitGateRegister(); });
  }

  async submitGateLogin() {
    const email = document.getElementById('gate-login-email')?.value || '';
    const password = document.getElementById('gate-login-password')?.value || '';
    const errorBox = document.getElementById('gate-login-error');
    const btn = document.getElementById('gate-login-btn');

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating with Supabase...';
    }
    if (errorBox) errorBox.style.display = 'none';

    const result = await authManager.login(email, password);

    if (result.needsVerification) {
      this.renderAuthGate('verify', result.email || email);
      this.showToast({
        title: 'Email Verification Required',
        message: 'Please check your inbox and verify your email before entering.',
        type: 'road'
      });
      return;
    }

    if (result.success) {
      this.unlockAppShell();
      this.renderHeader();
      this.renderRoadsTicker();
      this.navigateTo('home');
      state.setUser({ ...result.user, isLoggedIn: true });
      this.showToast({
        title: `Welcome, ${result.user.fullName}! 🇵🇰`,
        message: result.user.role === 'admin' ? 'Admin Console is unlocked.' : 'You have entered SafarNama PK.',
        type: 'booking'
      });
    } else {
      if (errorBox) {
        errorBox.style.display = 'flex';
        errorBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${result.error}`;
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In to Enter SafarNama';
      }
    }
  }

  async submitGateRegister() {
    const fullName = document.getElementById('gate-reg-name')?.value || '';
    const email = document.getElementById('gate-reg-email')?.value || '';
    const phone = document.getElementById('gate-reg-phone')?.value || '';
    const city = document.getElementById('gate-reg-city')?.value || '';
    const password = document.getElementById('gate-reg-password')?.value || '';
    const errorBox = document.getElementById('gate-reg-error');
    const btn = document.getElementById('gate-reg-btn');

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering in Supabase...';
    }
    if (errorBox) errorBox.style.display = 'none';

    // Enforce min 8 characters & reject weak passwords client-side
    if (password.length < 8) {
      if (errorBox) {
        errorBox.style.display = 'flex';
        errorBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Password must be at least 8 characters long. Click "Suggest Strong Password" above for an instant secure password!';
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Create Account & Send Verification Email';
      }
      return;
    }

    const strength = evaluatePasswordStrength(password);
    if (!strength.isValid || strength.level === 'weak') {
      if (errorBox) {
        errorBox.style.display = 'flex';
        errorBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Weak password is not allowed. ${strength.feedback[0] || 'Include uppercase, lowercase, and numbers/symbols, or click "Suggest Strong Password".'}`;
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Create Account & Send Verification Email';
      }
      return;
    }

    const result = await authManager.register(fullName, email, password, phone, city);

    if (result.needsVerification) {
      this.renderAuthGate('verify', result.email || email);
      this.showToast({
        title: 'Verification Email Sent! ✉️',
        message: `Please check ${email} and click the link to confirm your account.`,
        type: 'booking'
      });
      return;
    }

    if (result.success) {
      this.unlockAppShell();
      this.renderHeader();
      this.renderRoadsTicker();
      this.navigateTo('home');
      state.setUser({ ...result.user, isLoggedIn: true });
      this.showToast({
        title: `Welcome to SafarNama PK, ${result.user.fullName}! 🎉`,
        message: 'Your account is ready.',
        type: 'booking'
      });
    } else {
      if (errorBox) {
        errorBox.style.display = 'flex';
        errorBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${result.error}`;
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Create Account & Send Verification Email';
      }
    }
  }

  async submitGateResend(email) {
    const btn = document.getElementById('gate-resend-btn');
    const feedbackBox = document.getElementById('gate-verify-feedback');

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending via Supabase...';
    }

    const res = await authManager.resendVerificationEmail(email);

    if (feedbackBox) {
      feedbackBox.style.display = 'flex';
      feedbackBox.style.background = res.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';
      feedbackBox.style.color = res.success ? '#34d399' : '#fb7185';
      feedbackBox.style.borderColor = res.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)';
      feedbackBox.innerHTML = `<i class="fa-solid ${res.success ? 'fa-check-circle' : 'fa-circle-exclamation'}"></i> ${res.message || res.error}`;
    }

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Resend Verification Email';
    }
  }

  /**
   * Perform real logout via authManager, lock the app shell and return to gate.
   */
  async doLogout() {
    const name = authManager.currentUser?.fullName || 'User';
    await authManager.logout();
    state.setUser(null);
    this.lockAppShell('login');
    this.showToast({
      title: 'Signed Out',
      message: `Goodbye, ${name}! You have been signed out securely.`,
      type: 'info'
    });
  }

  async init() {
    await loadEnv();
    // Initialize Supabase backend client
    initSupabase();
    // Initialize auth system (restore Supabase session)
    await authManager.init();

    this.bindGlobalEvents();
    this.applyTheme();

    // Listen to real-time auth state changes (catches email verification clicks & sign-outs)
    authManager.onAuthChange((event, user) => {
      if (event === 'SIGNED_IN' && user) {
        this.unlockAppShell();
        this.renderHeader();
        this.renderRoadsTicker();
        this.navigateTo('home');
      } else if (event === 'SIGNED_OUT') {
        this.lockAppShell('login');
      }
    });

    // Check if user is already authenticated & verified
    if (authManager.isLoggedIn) {
      this.unlockAppShell();
      this.renderHeader();
      this.renderRoadsTicker();
      this.navigateTo('home');
    } else {
      this.lockAppShell('login');
    }

    adminConsole.init();

    // Re-render components when state updates
    state.subscribe('tours_changed', () => this.refreshCurrentView());
    state.subscribe('currency_changed', () => this.refreshCurrentView());
    state.subscribe('road_alerts_changed', () => {
      this.renderRoadsTicker();
      if (this.currentView === 'road-status') this.renderRoadStatusView();
    });
    state.subscribe('notifications_changed', () => this.updateNotificationBadge());
    state.subscribe('notification_toast', (notif) => this.showToast(notif));
  }

  bindGlobalEvents() {
    // Expose app and engines to window for inline onclick handlers
    window.safarnamaApp = this;
    window.bookingEngine = bookingEngine;
    window.adminConsole = adminConsole;
    window.safarAI = safarAI;
    window.travelMap = travelMap;
    window.authManager = authManager;
    window.getSupabase = getSupabase;
    window.checkSupabase = checkSupabaseConnection;

    // Close notifications dropdown on outside click
    document.addEventListener('click', (e) => {
      const notifBtn = document.getElementById('notif-bell-btn');
      const notifDrawer = document.getElementById('notif-dropdown');
      if (notifDrawer && notifBtn && !notifBtn.contains(e.target) && !notifDrawer.contains(e.target)) {
        notifDrawer.classList.remove('active');
      }

      const userMenuBtn = document.getElementById('user-menu-btn');
      const userDropdown = document.getElementById('user-dropdown');
      if (userDropdown && userMenuBtn && !userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('active');
      }

      // Close map search dropdown on outside click
      if (!e.target.closest('.map-search-bar-wrap')) {
        const mapDropdown = document.getElementById('map-search-dropdown');
        if (mapDropdown) mapDropdown.classList.remove('active');
      }
    });
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = state.theme === 'dark' ? '#042f2e' : '#ffffff';
  }

  toggleTheme() {
    const newTheme = state.toggleTheme();
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) {
      icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  navigateTo(viewId, params = {}) {
    this.currentView = viewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewId);
    });

    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    if (viewId === 'home' || viewId === 'explore') {
      this.renderHomeView();
    } else if (viewId === 'tours') {
      this.renderToursView();
    } else if (viewId === 'hotels') {
      this.renderHotelsView();
    } else if (viewId === 'transport') {
      this.renderTransportView();
    } else if (viewId === 'road-status') {
      this.renderRoadStatusView();
    } else if (viewId === 'ai-planner') {
      this.renderAIPlannerView();
    } else if (viewId === 'dashboard') {
      this.renderDashboardView();
    } else if (viewId === 'admin') {
      // Admin panel is role-gated — only accessible to admin users
      if (!authManager.isAdmin) {
        this.showToast({ title: 'Access Denied', message: 'Admin panel requires admin login.', type: 'road' });
        this.openLoginModal();
        this.currentView = this.currentView === 'admin' ? 'home' : this.currentView;
        return;
      }
      this.renderAdminView();
    }
  }

  refreshCurrentView() {
    this.navigateTo(this.currentView);
  }

  renderHeader() {
    const header = document.getElementById('app-header');
    if (!header) return;

    const unreadCount = state.notifications.filter(n => n.unread).length;
    const user = authManager.currentUser;
    const isLoggedIn = authManager.isLoggedIn;
    const isAdmin = authManager.isAdmin;

    // Display name & avatar from auth session or a guest fallback
    const displayName = isLoggedIn ? (user.fullName.split(' ')[0]) : 'Guest';
    const displayRole = isLoggedIn ? user.role.toUpperCase() : 'GUEST';
    const displayEmail = isLoggedIn ? user.email : 'Not signed in';
    const displayAvatar = isLoggedIn
      ? (user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=6366f1&color=fff&size=128`)
      : 'https://ui-avatars.com/api/?name=Guest&background=334155&color=94a3b8&size=128';

    header.innerHTML = `
      <div class="header-container">
        <!-- Logo & Pakistan Flag Brand -->
        <div class="header-brand" onclick="window.safarnamaApp.navigateTo('home')">
          <div class="brand-logo-icon">
            <i class="fa-solid fa-mountain-sun"></i>
          </div>
          <div class="brand-text">
            <div class="brand-name">SafarNama <span class="brand-badge-pk">PK 🇵🇰</span></div>
            <div class="brand-tagline">Pakistan Domestic Travel Ecosystem</div>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="header-nav">
          <button class="nav-link ${this.currentView === 'home' ? 'active' : ''}" data-view="home" onclick="window.safarnamaApp.navigateTo('home')">
            <i class="fa-solid fa-compass"></i> Explore
          </button>
          <button class="nav-link ${this.currentView === 'tours' ? 'active' : ''}" data-view="tours" onclick="window.safarnamaApp.navigateTo('tours')">
            <i class="fa-solid fa-map-location-dot"></i> Guided Tours
          </button>
          <button class="nav-link ${this.currentView === 'hotels' ? 'active' : ''}" data-view="hotels" onclick="window.safarnamaApp.navigateTo('hotels')">
            <i class="fa-solid fa-hotel"></i> Mountain Stays
          </button>
          <button class="nav-link ${this.currentView === 'transport' ? 'active' : ''}" data-view="transport" onclick="window.safarnamaApp.navigateTo('transport')">
            <i class="fa-solid fa-truck-monster"></i> 4x4 & Rentals
          </button>
          <button class="nav-link ${this.currentView === 'road-status' ? 'active' : ''}" data-view="road-status" onclick="window.safarnamaApp.navigateTo('road-status')">
            <span class="pulse-dot"></span> Live Roads & Weather
          </button>
          <button class="nav-link btn-ai-nav ${this.currentView === 'ai-planner' ? 'active' : ''}" data-view="ai-planner" onclick="window.safarnamaApp.navigateTo('ai-planner')">
            <i class="fa-solid fa-wand-magic-sparkles text-gold"></i> SafarAI
          </button>
          ${isAdmin ? `
          <button class="nav-link nav-link-admin ${this.currentView === 'admin' ? 'active' : ''}" data-view="admin" onclick="window.safarnamaApp.navigateTo('admin')">
            <i class="fa-solid fa-shield-halved text-emerald"></i> Admin
          </button>` : ''}
        </nav>

        <!-- Right Side Utility Controls -->
        <div class="header-actions">
          <!-- Currency Selector -->
          <div class="currency-picker">
            <select onchange="window.safarnamaApp.handleCurrencyChange(this.value)" class="currency-select" title="Select Currency">
              <option value="PKR" ${state.currency === 'PKR' ? 'selected' : ''}>🇵🇰 PKR (Rs.)</option>
              <option value="USD" ${state.currency === 'USD' ? 'selected' : ''}>🇺🇸 USD ($)</option>
              <option value="EUR" ${state.currency === 'EUR' ? 'selected' : ''}>🇪🇺 EUR (€)</option>
              <option value="SAR" ${state.currency === 'SAR' ? 'selected' : ''}>🇸🇦 SAR</option>
              <option value="AED" ${state.currency === 'AED' ? 'selected' : ''}>🇦🇪 AED</option>
            </select>
          </div>

          <!-- API Key Setup: admin-only -->
          ${isAdmin ? `
          <button class="action-btn" id="api-key-header-btn" onclick="window.safarnamaApp.openApiKeyModal()" title="API Key Setup (Admin Only)">
            <i class="fa-solid fa-key text-gold"></i>
          </button>` : ''}

          <!-- Theme Switcher -->
          <button class="action-btn" onclick="window.safarnamaApp.toggleTheme()" title="Toggle Dark/Light Mode">
            <i id="theme-toggle-icon" class="${state.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}"></i>
          </button>

          <!-- Notifications Dropdown Trigger -->
          <div class="notif-wrapper">
            <button id="notif-bell-btn" class="action-btn" onclick="window.safarnamaApp.toggleNotifications()" title="Real-time Alerts">
              <i class="fa-regular fa-bell"></i>
              ${unreadCount > 0 ? `<span class="notif-badge" id="notif-badge-count">${unreadCount}</span>` : ''}
            </button>
            <div id="notif-dropdown" class="notif-dropdown-menu">
              <!-- Dynamically Populated -->
            </div>
          </div>

          <!-- User Profile Dropdown -->
          <div class="user-menu-wrapper">
            <button id="user-menu-btn" class="user-btn" onclick="window.safarnamaApp.toggleUserMenu()">
              <img src="${displayAvatar}" alt="${displayName}" class="user-avatar" />
              <div class="user-info-text">
                <span class="user-name">${displayName}</span>
                <span class="user-role-badge ${isLoggedIn ? user.role : 'guest'}">${displayRole}</span>
              </div>
              <i class="fa-solid fa-chevron-down"></i>
            </button>
            <div id="user-dropdown" class="user-dropdown-menu">
              <div class="dropdown-header">
                <strong>${isLoggedIn ? user.fullName : 'Guest Traveler'}</strong>
                <div class="text-muted small">${displayEmail}</div>
              </div>
              <div class="dropdown-divider"></div>
              ${isLoggedIn ? `
              <button class="dropdown-item" onclick="window.safarnamaApp.navigateTo('dashboard'); window.safarnamaApp.toggleUserMenu();">
                <i class="fa-solid fa-user"></i> My Dashboard & E-Tickets
              </button>
              ${isAdmin ? `
              <button class="dropdown-item" onclick="window.safarnamaApp.openApiKeyModal(); window.safarnamaApp.toggleUserMenu();">
                <i class="fa-solid fa-key text-gold"></i> API Key Settings
              </button>
              <button class="dropdown-item" onclick="window.safarnamaApp.navigateTo('admin'); window.safarnamaApp.toggleUserMenu();">
                <i class="fa-solid fa-shield-halved text-emerald"></i> Admin Console
              </button>` : ''}
              <div class="dropdown-divider"></div>
              <button class="dropdown-item text-ruby" id="signout-btn" onclick="window.safarnamaApp.doLogout()">
                <i class="fa-solid fa-right-from-bracket"></i> Sign Out
              </button>
              ` : `
              <button class="dropdown-item" onclick="window.safarnamaApp.openLoginModal(); window.safarnamaApp.toggleUserMenu();">
                <i class="fa-solid fa-right-to-bracket text-emerald"></i> Sign In
              </button>
              <button class="dropdown-item" onclick="window.safarnamaApp.openLoginModal('register'); window.safarnamaApp.toggleUserMenu();">
                <i class="fa-solid fa-user-plus text-gold"></i> Create Account
              </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderRoadsTicker() {
    const tickerContainer = document.getElementById('roads-live-ticker');
    if (!tickerContainer) return;

    const alerts = state.roadAlerts;
    const tickerItemsHtml = alerts.map(a => `
      <div class="ticker-item" onclick="window.safarnamaApp.navigateTo('road-status')">
        <span class="ticker-status-dot ${a.statusLevel}"></span>
        <strong class="ticker-hw">${a.highway.split(' ')[0]}</strong>
        <span class="ticker-status">${a.status}</span>
        <span class="ticker-temp"><i class="fa-solid fa-temperature-half"></i> ${a.temperature}</span>
      </div>
    `).join(' • ');

    tickerContainer.innerHTML = `
      <div class="ticker-badge"><i class="fa-solid fa-satellite-dish fa-fade"></i> LIVE HIGHWAY & WEATHER STATUS</div>
      <div class="ticker-marquee">
        <div class="ticker-track">${tickerItemsHtml} &nbsp;&nbsp;&nbsp; ${tickerItemsHtml}</div>
      </div>
    `;
  }

  updateNotificationBadge() {
    const unreadCount = state.notifications.filter(n => n.unread).length;
    const badge = document.getElementById('notif-badge-count');
    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  toggleNotifications() {
    const drawer = document.getElementById('notif-dropdown');
    if (!drawer) return;
    drawer.classList.toggle('active');

    if (drawer.classList.contains('active')) {
      drawer.innerHTML = `
        <div class="notif-header">
          <strong>Real-Time Travel Alerts</strong>
          <button class="btn-link-sm" onclick="state.markAllNotificationsRead(); window.safarnamaApp.toggleNotifications();">Mark read</button>
        </div>
        <div class="notif-list">
          ${state.notifications.map(n => `
            <div class="notif-item ${n.unread ? 'unread' : ''}">
              <div class="notif-icon ${n.type}">
                <i class="fa-solid ${n.type === 'road' ? 'fa-road text-gold' : (n.type === 'booking' ? 'fa-circle-check text-emerald' : 'fa-bell text-glacier')}"></i>
              </div>
              <div class="notif-content">
                <div class="notif-title">${n.title}</div>
                <div class="notif-msg">${n.message}</div>
                <div class="notif-time">${n.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  toggleUserMenu() {
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown) {
      userDropdown.classList.toggle('active');
    }
  }

  /**
   * Open the login/register modal.
   * Pass 'register' as initialTab to open on the register form.
   */
  openLoginModal(initialTab = 'login') {
    const modal = document.getElementById('generic-modal-container');
    if (!modal) return;
    modal.classList.add('active');
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="window.safarnamaApp.closeGenericModal()"></div>
      <div class="modal-card" style="max-width:440px">
        <button class="modal-close-btn" onclick="window.safarnamaApp.closeGenericModal()"><i class="fa-solid fa-xmark"></i></button>

        <div class="auth-modal-header">
          <div class="brand-logo-icon" style="width:52px;height:52px;font-size:1.4rem">
            <i class="fa-solid fa-mountain-sun"></i>
          </div>
          <h2 style="margin:0.5rem 0 0.2rem">SafarNama PK</h2>
          <p class="text-muted" style="font-size:0.85rem;margin:0">Pakistan's Travel Ecosystem</p>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab ${initialTab === 'login' ? 'active' : ''}" id="auth-tab-login" onclick="window.safarnamaApp._switchAuthTab('login')">Sign In</button>
          <button class="auth-tab ${initialTab === 'register' ? 'active' : ''}" id="auth-tab-register" onclick="window.safarnamaApp._switchAuthTab('register')">Register</button>
        </div>

        <!-- Login Form -->
        <div id="auth-form-login" style="display:${initialTab === 'login' ? 'block' : 'none'}">
          <div class="auth-form-group">
            <label><i class="fa-solid fa-envelope text-muted"></i> Email</label>
            <input type="email" id="login-email" class="search-input" placeholder="you@email.com" autocomplete="email" />
          </div>
          <div class="auth-form-group">
            <label><i class="fa-solid fa-lock text-muted"></i> Password</label>
            <div class="auth-pw-wrap">
              <input type="password" id="login-password" class="search-input" placeholder="Your password" autocomplete="current-password" />
              <button type="button" class="pw-eye-btn" onclick="window.safarnamaApp._togglePwVisibility('login-password', this)"><i class="fa-regular fa-eye"></i></button>
            </div>
          </div>
          <div id="login-error" class="auth-feedback" style="display:none"></div>
          <div class="auth-hint">
            <i class="fa-solid fa-circle-info text-gold"></i>
            <span>Admin: <strong>admin@safarnama.pk</strong> / <strong>Admin@1234</strong></span>
          </div>
          <button class="btn btn-emerald btn-full" id="login-submit-btn" onclick="window.safarnamaApp.submitLogin()">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In
          </button>
        </div>

        <!-- Register Form -->
        <div id="auth-form-register" style="display:${initialTab === 'register' ? 'block' : 'none'}">
          <div class="auth-form-group">
            <label><i class="fa-solid fa-user text-muted"></i> Full Name</label>
            <input type="text" id="reg-name" class="search-input" placeholder="Muhammad Ali" autocomplete="name" />
          </div>
          <div class="auth-form-group">
            <label><i class="fa-solid fa-envelope text-muted"></i> Email</label>
            <input type="email" id="reg-email" class="search-input" placeholder="you@email.com" autocomplete="email" />
          </div>
          <div class="auth-form-group">
            <label><i class="fa-solid fa-phone text-muted"></i> Phone (optional)</label>
            <input type="tel" id="reg-phone" class="search-input" placeholder="+92 300 1234567" autocomplete="tel" />
          </div>
          <div class="auth-form-group">
            <label><i class="fa-solid fa-city text-muted"></i> City (optional)</label>
            <input type="text" id="reg-city" class="search-input" placeholder="Lahore" /></div>
          <div class="auth-form-group">
            <div class="auth-label-flex">
              <label for="reg-password" style="margin-bottom:0;"><i class="fa-solid fa-lock text-muted"></i> Password (min 8 characters)</label>
              <button type="button" class="btn-suggest-pw" onclick="window.safarnamaApp.suggestStrongPassword('reg-password', 'modal-pw-meter')">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Suggest Strong Password
              </button>
            </div>
            <div class="auth-pw-wrap" style="margin-top: 6px;">
              <input
                type="password"
                id="reg-password"
                class="search-input"
                placeholder="Enter 8+ char secure password"
                autocomplete="new-password"
                oninput="window.safarnamaApp.handlePasswordInput(this.value, 'modal-pw-meter')"
              />
              <button type="button" class="pw-eye-btn" onclick="window.safarnamaApp._togglePwVisibility('reg-password', this)"><i class="fa-regular fa-eye"></i></button>
            </div>

            <!-- Live Password Strength Meter & Checklist -->
            <div id="modal-pw-meter" class="password-strength-container">
              <div class="strength-bar-track">
                <div class="strength-bar-fill" style="width: 0%;"></div>
              </div>
              <div class="strength-meta-row">
                <span class="strength-label-text text-muted">Strength: Enter password</span>
                <span class="strength-score-text text-muted">0 / 4</span>
              </div>
              <div class="strength-checklist">
                <div class="checklist-item" data-check="length"><i class="fa-regular fa-circle"></i> Min 8 characters</div>
                <div class="checklist-item" data-check="case"><i class="fa-regular fa-circle"></i> Mixed uppercase & lowercase</div>
                <div class="checklist-item" data-check="numsym"><i class="fa-regular fa-circle"></i> Numbers or symbols</div>
                <div class="checklist-item" data-check="common"><i class="fa-regular fa-circle"></i> Not easily guessed</div>
              </div>
            </div>
          </div>
          <div id="reg-error" class="auth-feedback" style="display:none"></div>
          <button class="btn btn-emerald btn-full" id="reg-submit-btn" onclick="window.safarnamaApp.submitRegister()">
            <i class="fa-solid fa-user-plus"></i> Create Account
          </button>
        </div>

      </div>
    `;

    // Allow Enter key to submit
    const loginPw = document.getElementById('login-password');
    if (loginPw) loginPw.addEventListener('keydown', e => { if (e.key === 'Enter') this.submitLogin(); });
    const regPw = document.getElementById('reg-password');
    if (regPw) regPw.addEventListener('keydown', e => { if (e.key === 'Enter') this.submitRegister(); });
  }

  _switchAuthTab(tab) {
    document.getElementById('auth-tab-login')?.classList.toggle('active', tab === 'login');
    document.getElementById('auth-tab-register')?.classList.toggle('active', tab === 'register');
    const loginForm = document.getElementById('auth-form-login');
    const regForm = document.getElementById('auth-form-register');
    if (loginForm) loginForm.style.display = tab === 'login' ? 'block' : 'none';
    if (regForm) regForm.style.display = tab === 'register' ? 'block' : 'none';
  }

  _togglePwVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    const icon = btn.querySelector('i');
    if (icon) icon.className = show ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
  }

  async submitLogin() {
    const email = document.getElementById('login-email')?.value || '';
    const password = document.getElementById('login-password')?.value || '';
    const errorBox = document.getElementById('login-error');
    const btn = document.getElementById('login-submit-btn');

    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...'; }
    if (errorBox) errorBox.style.display = 'none';

    const result = await authManager.login(email, password);

    if (result.success) {
      this.closeGenericModal();
      this.renderHeader();
      // Sync state.user with auth session for legacy compatibility
      state.setUser({ ...result.user, isLoggedIn: true });
      this.showToast({
        title: `Welcome back, ${result.user.fullName.split(' ')[0]}! 🇵🇰`,
        message: result.user.role === 'admin' ? 'Admin Console is now unlocked.' : 'You are signed in as a traveler.',
        type: 'booking'
      });
      if (result.user.role === 'admin') {
        this.navigateTo('admin');
      }
    } else {
      if (errorBox) {
        errorBox.style.display = 'flex';
        errorBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${result.error}`;
      }
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In'; }
    }
  }

  async submitRegister() {
    const fullName = document.getElementById('reg-name')?.value || '';
    const email = document.getElementById('reg-email')?.value || '';
    const phone = document.getElementById('reg-phone')?.value || '';
    const city = document.getElementById('reg-city')?.value || '';
    const password = document.getElementById('reg-password')?.value || '';
    const errorBox = document.getElementById('reg-error');
    const btn = document.getElementById('reg-submit-btn');

    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...'; }
    if (errorBox) errorBox.style.display = 'none';

    // Enforce min 8 characters & reject weak passwords client-side
    if (password.length < 8) {
      if (errorBox) {
        errorBox.style.display = 'flex';
        errorBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Password must be at least 8 characters long. Click "Suggest Strong Password" above for an instant secure password!';
      }
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account'; }
      return;
    }

    const strength = evaluatePasswordStrength(password);
    if (!strength.isValid || strength.level === 'weak') {
      if (errorBox) {
        errorBox.style.display = 'flex';
        errorBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Weak password is not allowed. ${strength.feedback[0] || 'Include uppercase, lowercase, and numbers/symbols, or click "Suggest Strong Password".'}`;
      }
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account'; }
      return;
    }

    const result = await authManager.register(fullName, email, password, phone, city);

    if (result.success) {
      this.closeGenericModal();
      this.renderHeader();
      state.setUser({ ...result.user, isLoggedIn: true });
      this.showToast({
        title: `Welcome to SafarNama PK, ${result.user.fullName.split(' ')[0]}! 🎉`,
        message: 'Your traveler account has been created successfully.',
        type: 'booking'
      });
    } else {
      if (errorBox) {
        errorBox.style.display = 'flex';
        errorBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${result.error}`;
      }
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account'; }
    }
  }

  handleCurrencyChange(curr) {
    state.setCurrency(curr);
    this.showToast({
      title: "Currency Updated",
      message: `Displaying prices in ${curr}`,
      type: "info"
    });
  }

  showToast(notif) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-card toast-${notif.type || 'info'}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fa-solid ${notif.type === 'road' ? 'fa-triangle-exclamation text-gold' : (notif.type === 'booking' ? 'fa-circle-check text-emerald' : 'fa-bell text-glacier')}"></i>
      </div>
      <div class="toast-body">
        <strong>${notif.title}</strong>
        <p>${notif.message}</p>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 4500);
  }

  // --- View Renderers ---

  renderHomeView() {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    mainContainer.innerHTML = `
      <!-- Hero Section with Spatial Glow, Large Typography & Floating Search Glass Card -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-pill-badge">
            <span class="flag">🇵🇰</span> <span>#1 Pakistan Domestic Spatial Travel Platform</span>
          </div>
          <h1 class="hero-title">
            Discover the Majestic Wonders of <span class="text-gradient-emerald">Pakistan</span>
          </h1>
          <p class="hero-subtitle">
            From the 8,000m Karakoram giants of Hunza & Skardu to the golden turquoise shores of Gwadar and ancient heritage valleys. Real-time domestic bookings in PKR.
          </p>

          <!-- Floating Glass Search Card -->
          <div class="hero-search-card">
            <div class="search-category-tabs">
              <button class="search-tab ${this.selectedCategoryFilter === 'all' ? 'active' : ''}" data-cat="all" onclick="window.safarnamaApp.setSearchCategory('all', this)"><i class="fa-solid fa-globe"></i> All Trips</button>
              <button class="search-tab ${this.selectedCategoryFilter === 'tours' ? 'active' : ''}" data-cat="tours" onclick="window.safarnamaApp.setSearchCategory('tours', this)"><i class="fa-solid fa-map-location-dot"></i> Guided Tours</button>
              <button class="search-tab ${this.selectedCategoryFilter === 'hotels' ? 'active' : ''}" data-cat="hotels" onclick="window.safarnamaApp.setSearchCategory('hotels', this)"><i class="fa-solid fa-hotel"></i> Mountain Stays</button>
              <button class="search-tab ${this.selectedCategoryFilter === 'transport' ? 'active' : ''}" data-cat="transport" onclick="window.safarnamaApp.setSearchCategory('transport', this)"><i class="fa-solid fa-truck-monster"></i> 4x4 & Rentals</button>
            </div>

            <!-- Dynamic Search Form Container -->
            <div id="hero-search-form-container">
              ${this.renderSearchFormInnerHtml()}
            </div>
          </div>

          <!-- Quick Service Pillars Cards for Guided Tours, Mountain Stays, 4x4 Rentals & Road Status -->
          <div class="hero-quick-services">
            <div class="quick-service-card" onclick="window.safarnamaApp.navigateTo('tours')">
              <div class="quick-icon emerald"><i class="fa-solid fa-map-location-dot"></i></div>
              <div class="quick-info">
                <h4>Guided Tours</h4>
                <p>All-inclusive mountain expeditions</p>
              </div>
              <button class="btn btn-xs btn-emerald" onclick="event.stopPropagation(); window.safarnamaApp.navigateTo('tours')">
                Explore <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div class="quick-service-card" onclick="window.safarnamaApp.navigateTo('hotels')">
              <div class="quick-icon gold"><i class="fa-solid fa-hotel"></i></div>
              <div class="quick-info">
                <h4>Mountain Stays</h4>
                <p>Heritage forts, chalets & pods</p>
              </div>
              <button class="btn btn-xs btn-gold" onclick="event.stopPropagation(); window.safarnamaApp.navigateTo('hotels')">
                Explore <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div class="quick-service-card" onclick="window.safarnamaApp.navigateTo('transport')">
              <div class="quick-icon cyan"><i class="fa-solid fa-truck-monster"></i></div>
              <div class="quick-info">
                <h4>4x4 & Rentals</h4>
                <p>Prados & chauffeured mountain jeeps</p>
              </div>
              <button class="btn btn-xs btn-cyan" onclick="event.stopPropagation(); window.safarnamaApp.navigateTo('transport')">
                Explore <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div class="quick-service-card" onclick="window.safarnamaApp.navigateTo('road-status')">
              <div class="quick-icon ruby"><i class="fa-solid fa-satellite-dish"></i></div>
              <div class="quick-info">
                <h4>Road Conditions</h4>
                <p>Live KKH & Babusar pass radar</p>
              </div>
              <button class="btn btn-xs btn-outline" onclick="event.stopPropagation(); window.safarnamaApp.navigateTo('road-status')">
                Radar <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Floating Statistics Section -->
          <div class="stats-floating-bar">
            <div class="stat-glass-pill">
              <div class="stat-icon text-emerald"><i class="fa-solid fa-mountain-sun"></i></div>
              <div class="stat-data">
                <div class="stat-val text-gradient-emerald">50+</div>
                <div class="stat-lbl">Verified Mountain Valleys</div>
              </div>
            </div>
            <div class="stat-glass-pill">
              <div class="stat-icon text-cyan"><i class="fa-solid fa-truck-monster"></i></div>
              <div class="stat-data">
                <div class="stat-val text-gradient-cyan">20+</div>
                <div class="stat-lbl">Off-Road 4x4 Expeditions</div>
              </div>
            </div>
            <div class="stat-glass-pill">
              <div class="stat-icon text-gold"><i class="fa-solid fa-umbrella-beach"></i></div>
              <div class="stat-data">
                <div class="stat-val text-gold">15+</div>
                <div class="stat-lbl">Coastal & Desert Spots</div>
              </div>
            </div>
            <div class="stat-glass-pill">
              <div class="stat-icon text-emerald"><i class="fa-solid fa-route"></i></div>
              <div class="stat-data">
                <div class="stat-val">1,000+ KM</div>
                <div class="stat-lbl">Live Highway Surveillance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Northern Roads & Live Weather Operational Monitor Bar -->
      <section class="section-container road-monitor-section">
        <div class="road-monitor-card">
          <div class="road-monitor-header">
            <div>
              <span class="badge-emerald"><i class="fa-solid fa-satellite"></i> Real-Time Surveillance</span>
              <h3>Northern Road Conditions & Mountain Weather</h3>
            </div>
            <button class="btn btn-sm btn-outline" onclick="window.safarnamaApp.navigateTo('road-status')">
              Full Highway Monitor <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div class="road-status-grid-mini">
            ${state.roadAlerts.slice(0, 4).map(a => `
              <div class="road-mini-item ${a.statusLevel}" onclick="window.safarnamaApp.navigateTo('road-status')">
                <div class="road-mini-top">
                  <span class="hw-tag">${a.highway.split(' ')[0]}</span>
                  <span class="hw-status">${a.status}</span>
                </div>
                <div class="road-mini-section">${a.section.split('-')[0]} ➔ ${a.section.split('-').slice(-1)[0]}</div>
                <div class="road-mini-meta">
                  <span><i class="fa-solid fa-temperature-half"></i> ${a.temperature}</span>
                  <span><i class="fa-solid fa-cloud"></i> ${a.weather}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Featured Domestic Tour Packages -->
      <section class="section-container">
        <div class="section-header-row">
          <div>
            <span class="section-kicker">CURATED EXPEDITIONS</span>
            <h2 class="section-title">Trending Pakistan Tour Packages</h2>
            <p class="text-muted">All-inclusive guided expeditions with verified mountain drivers, deluxe stays & PKR pricing.</p>
          </div>
          <button class="btn btn-outline" onclick="window.safarnamaApp.navigateTo('tours')">
            View All ${state.tours.length} Guided Tours <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div class="tours-grid">
          ${state.tours.slice(0, 6).map(t => this.renderTourCardHtml(t)).join('')}
        </div>
      </section>

      <!-- Interactive Pakistan Travel & Road Map -->
      <section class="section-container">
        <div class="map-section-wrapper">
          <div class="map-header-bar">
            <div class="map-header-left">
              <span class="section-kicker"><i class="fa-solid fa-compass"></i> GEOGRAPHIC EXPLORATION</span>
              <h2 class="section-title">Interactive Pakistan Travel & Road Map</h2>
              <p class="text-muted">Search tourist destinations, verified hotels & resorts, authentic culinary spots, and scenic highway routes across Pakistan.</p>
            </div>

            <!-- Integrated Map Search Bar with Live Suggestions -->
            <div class="map-search-bar-wrap">
              <div class="map-search-input-box">
                <i class="fa-solid fa-magnifying-glass map-search-icon"></i>
                <input
                  type="text"
                  id="map-search-input"
                  class="map-search-input"
                  placeholder="Search destinations, hotels, restaurants, routes, or cities (e.g., Hunza, Serena, Monal, KKH, Quetta)..."
                  autocomplete="off"
                  oninput="window.safarnamaApp.handleMapSearch(this.value)"
                  onfocus="window.safarnamaApp.handleMapSearch(this.value)"
                  onkeydown="window.safarnamaApp.handleMapSearchKey(event)"
                />
                <button
                  type="button"
                  id="map-search-clear-btn"
                  class="map-search-clear-btn"
                  style="display: none;"
                  onclick="window.safarnamaApp.clearMapSearch()"
                  title="Clear search"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div id="map-search-dropdown" class="map-search-dropdown"></div>
            </div>

            <!-- Functional Map Layer Filter Buttons -->
            <div class="map-filter-pills">
              <button class="map-pill active" data-filter="all" onclick="window.safarnamaApp.filterMap('all', this)">
                <i class="fa-solid fa-globe"></i> All
              </button>
              <button class="map-pill" data-filter="destinations" onclick="window.safarnamaApp.filterMap('destinations', this)">
                <i class="fa-solid fa-mountain-sun text-emerald"></i> Destinations <span class="pill-count">${state.destinations?.length || 8}</span>
              </button>
              <button class="map-pill" data-filter="hotels" onclick="window.safarnamaApp.filterMap('hotels', this)">
                <i class="fa-solid fa-hotel text-cyan"></i> Hotels <span class="pill-count">${state.hotels?.length || 10}</span>
              </button>
              <button class="map-pill" data-filter="restaurants" onclick="window.safarnamaApp.filterMap('restaurants', this)">
                <i class="fa-solid fa-utensils text-gold"></i> Restaurants <span class="pill-count">${state.restaurants?.length || 12}</span>
              </button>
              <button class="map-pill" data-filter="routes" onclick="window.safarnamaApp.filterMap('routes', this)">
                <i class="fa-solid fa-route text-purple"></i> Routes <span class="pill-count">${state.routes?.length || 6}</span>
              </button>
              <button class="map-pill" data-filter="roads" onclick="window.safarnamaApp.filterMap('roads', this)">
                <i class="fa-solid fa-triangle-exclamation text-coral"></i> Live Roads <span class="pill-count">${state.roadAlerts?.length || 6}</span>
              </button>
              <button class="map-pill" id="map-pill-directions" onclick="window.safarnamaApp.toggleMapDirections()">
                <i class="fa-solid fa-diamond-turn-right text-emerald"></i> Route Finder
              </button>
            </div>
          </div>

          <!-- City-to-City Route Directions Panel -->
          <div id="map-directions-panel" class="map-directions-panel" style="display: none;">
            <div class="directions-panel-header">
              <div class="directions-panel-title">
                <i class="fa-solid fa-diamond-turn-right text-emerald"></i>
                <span><strong>City-to-City Route Planner & Distance Calculator</strong></span>
              </div>
              <button type="button" class="directions-close-btn" onclick="window.safarnamaApp.toggleMapDirections(false)" title="Close Directions Panel">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="directions-form-grid">
              <div class="directions-input-group">
                <label for="route-origin-input"><i class="fa-solid fa-circle-dot text-emerald"></i> Starting City (Origin)</label>
                <input
                  type="text"
                  id="route-origin-input"
                  list="pk-cities-datalist"
                  placeholder="e.g. Lahore, Islamabad, Karachi..."
                  class="directions-input"
                  autocomplete="off"
                />
              </div>

              <button type="button" class="directions-swap-btn" onclick="window.safarnamaApp.swapDirections()" title="Swap Origin & Destination">
                <i class="fa-solid fa-arrow-right-arrow-left"></i>
              </button>

              <div class="directions-input-group">
                <label for="route-dest-input"><i class="fa-solid fa-location-dot text-coral"></i> Destination City / Valley</label>
                <input
                  type="text"
                  id="route-dest-input"
                  list="pk-cities-datalist"
                  placeholder="e.g. Hunza, Skardu, Swat, Gwadar..."
                  class="directions-input"
                  autocomplete="off"
                />
              </div>

              <button type="button" class="btn btn-emerald directions-find-btn" onclick="window.safarnamaApp.executeMapDirections()">
                <i class="fa-solid fa-route"></i> Calculate & Show Route
              </button>
            </div>

            <div class="directions-quick-pills">
              <span class="quick-label"><i class="fa-solid fa-bolt text-gold"></i> Popular Expeditions:</span>
              <button type="button" class="quick-route-chip" onclick="window.safarnamaApp.quickRoute('Lahore', 'Hunza')">Lahore ➔ Hunza</button>
              <button type="button" class="quick-route-chip" onclick="window.safarnamaApp.quickRoute('Islamabad', 'Skardu')">Islamabad ➔ Skardu</button>
              <button type="button" class="quick-route-chip" onclick="window.safarnamaApp.quickRoute('Islamabad', 'Swat')">Islamabad ➔ Swat</button>
              <button type="button" class="quick-route-chip" onclick="window.safarnamaApp.quickRoute('Rawalpindi', 'Naran')">Rawalpindi ➔ Naran</button>
              <button type="button" class="quick-route-chip" onclick="window.safarnamaApp.quickRoute('Karachi', 'Gwadar')">Karachi ➔ Gwadar</button>
            </div>

            <datalist id="pk-cities-datalist">
              <option value="Islamabad">
              <option value="Rawalpindi">
              <option value="Lahore">
              <option value="Karachi">
              <option value="Peshawar">
              <option value="Quetta">
              <option value="Multan">
              <option value="Faisalabad">
              <option value="Hunza (Karimabad)">
              <option value="Skardu">
              <option value="Swat (Mingora)">
              <option value="Kalam">
              <option value="Naran">
              <option value="Gilgit">
              <option value="Chitral">
              <option value="Gwadar">
              <option value="Neelum Valley">
              <option value="Muzaffarabad">
              <option value="Murree">
              <option value="Ziarat">
            </datalist>
          </div>

          <div class="map-canvas-container">
            <div id="pakistan-map" class="pakistan-leaflet-container"></div>
            <div id="map-route-summary-mount" class="map-route-summary-mount"></div>
            <div class="map-floating-bar">
              <span id="map-layer-indicator" class="map-layer-indicator">
                <i class="fa-solid fa-layer-group"></i> Showing: All Layers (Destinations, Hotels, Restaurants, Routes, Roads)
              </span>
              <button class="map-control-btn" onclick="window.safarnamaApp.resetMapView()" title="Reset Pakistan View">
                <i class="fa-solid fa-compress"></i> Reset View
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Iconic Pakistani Valleys & Destinations Showcase -->
      <section class="section-container">
        <div class="section-header-row">
          <div>
            <span class="section-kicker">DESTINATION GUIDES</span>
            <h2 class="section-title">Explore Iconic Pakistani Destinations</h2>
            <p class="text-muted">Detailed guides, altitudes, climate data, and road accessibility across Pakistan.</p>
          </div>
        </div>

        <div class="destinations-grid">
          ${state.destinations.map(d => this.renderDestinationCardHtml(d)).join('')}
        </div>
      </section>

      <!-- SafarAI Domestic Travel Assistant Banner -->
      <section class="section-container">
        <div class="ai-cta-banner">
          <div class="ai-cta-content">
            <span class="badge-gold"><i class="fa-solid fa-wand-magic-sparkles"></i> AI TRIP PLANNER</span>
            <h2>Let SafarAI Build Your Perfect Pakistan Itinerary</h2>
            <p>
              Tell us your starting city, budget in PKR, and travel style. Our localized AI creates realistic day-by-day itineraries accounting for northern mountain roads, hotel bookings, and packing checklists.
            </p>
            <div class="ai-cta-actions">
              <button class="btn btn-gold btn-lg" onclick="window.safarnamaApp.navigateTo('ai-planner')">
                <i class="fa-solid fa-sparkles"></i> Launch SafarAI Planner
              </button>
            </div>
          </div>
          <div class="ai-cta-visual">
            <div class="ai-preview-card">
              <div class="ai-prev-header">
                <span class="dot green"></span><span class="dot yellow"></span><span class="dot red"></span>
                <span>SafarAI Pakistan Assistant</span>
              </div>
              <div class="ai-prev-body">
                <div class="msg ai">"Can I take my Honda Civic to Hunza and across Babusar Pass?"</div>
                <div class="msg user">"✅ Yes! The KKH and Hazara Expressway are fully carpeted. Only Deosai Plains requires a local 4x4 jeep!"</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Hotel & Glamping Stays Preview -->
      <section class="section-container">
        <div class="section-header-row">
          <div>
            <span class="section-kicker">VERIFIED STAYS</span>
            <h2 class="section-title">Luxury Resorts & Glamping Pods</h2>
            <p class="text-muted">Handpicked heritage fort hotels, lakeside pagodas, and heated alpine chalets.</p>
          </div>
          <button class="btn btn-outline" onclick="window.safarnamaApp.navigateTo('hotels')">
            View All ${state.hotels.length} Mountain Stays <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div class="hotels-grid">
          ${state.hotels.slice(0, 4).map(h => this.renderHotelCardHtml(h)).join('')}
        </div>
      </section>

      <!-- 4x4 Mountain Transport Rentals Preview -->
      <section class="section-container">
        <div class="section-header-row">
          <div>
            <span class="section-kicker">CHAUFFEURED 4X4 FLEET</span>
            <h2 class="section-title">Mountain 4x4s, Grand Cabins & Coasters</h2>
            <p class="text-muted">High-clearance Prado TX, Grand Cabins, and local rugged jeeps with certified mountain chauffeurs.</p>
          </div>
          <button class="btn btn-outline" onclick="window.safarnamaApp.navigateTo('transport')">
            View All ${state.transport.length} 4x4 Vehicles <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div class="transport-grid">
          ${state.transport.slice(0, 3).map(tr => this.renderTransportCardHtml(tr)).join('')}
        </div>
      </section>

      <!-- Travel Intelligence & Practical Guidance Section -->
      <section class="section-container">
        <div class="section-header-row">
          <div>
            <span class="section-kicker"><i class="fa-solid fa-compass-drafting"></i> TRAVEL INTELLIGENCE</span>
            <h2 class="section-title">Pakistan Domestic Travel Guides</h2>
            <p class="text-muted">High-altitude advice, seasonal road advisories, and local tips for domestic explorers.</p>
          </div>
        </div>

        <div class="travel-guides-grid">
          <div class="guide-glass-card">
            <div class="guide-icon text-emerald"><i class="fa-solid fa-calendar-check"></i></div>
            <h3>Best Time to Visit</h3>
            <p><strong>Gilgit & Hunza:</strong> May to Oct (Autumn foliage in Oct-Nov).<br/><strong>Gwadar & Coastal:</strong> Oct to March.<br/><strong>Swat & Malam Jabba:</strong> Skiing in Dec-Feb, lush summers.</p>
          </div>
          <div class="guide-glass-card">
            <div class="guide-icon text-cyan"><i class="fa-solid fa-shield-halved"></i></div>
            <h3>Roads & Security Checkpoints</h3>
            <p>Keep original CNIC / NICOP and vehicle registration handy for KKH and KP checkpoints. Follow NHMP advisory line 130 in mountain passes.</p>
          </div>
          <div class="guide-glass-card">
            <div class="guide-icon text-gold"><i class="fa-solid fa-wallet"></i></div>
            <h3>Cash & ATM Access</h3>
            <p>While SafarNama accepts JazzCash & cards online, carry cash in PKR for remote off-road valleys (Passu, Tato, Arang Kel) where telecom towers may fluctuate.</p>
          </div>
          <div class="guide-glass-card">
            <div class="guide-icon text-ruby"><i class="fa-solid fa-heart-pulse"></i></div>
            <h3>High Altitude Wellness</h3>
            <p>Acclimatize in Chilas or Karimabad before ascending to Babusar (4,173m) or Khunjerab Pass (4,693m). Keep hydration packs and motion sickness tablets.</p>
          </div>
        </div>
      </section>

      <!-- Why Choose SafarNama PK Value Grid -->
      <section class="section-container">
        <div class="trust-grid">
          <div class="trust-card">
            <div class="trust-icon"><i class="fa-solid fa-flag text-emerald"></i></div>
            <h3>100% Pakistan Domestic Focus</h3>
            <p>Tailored exclusively for domestic travelers and northern logistics without confusing international overhead.</p>
          </div>
          <div class="trust-card">
            <div class="trust-icon"><i class="fa-solid fa-mobile-retro text-gold"></i></div>
            <h3>JazzCash & Easypaisa in PKR</h3>
            <p>Instant booking confirmation via native Pakistani mobile accounts, Raast ID, and credit/debit cards.</p>
          </div>
          <div class="trust-card">
            <div class="trust-icon"><i class="fa-solid fa-satellite-dish text-glacier"></i></div>
            <h3>Real-Time Road & Weather Alerts</h3>
            <p>Direct highway police and local operator updates for KKH, Babusar, Lowari, and Skardu roads.</p>
          </div>
          <div class="trust-card">
            <div class="trust-icon"><i class="fa-solid fa-qrcode text-ruby"></i></div>
            <h3>Instant Digital QR Boarding Pass</h3>
            <p>Printable vouchers and digital passes ready for hassle-free checkpoint verification.</p>
          </div>
        </div>
      </section>
    `;

    // Initialize Leaflet Map after DOM rendering
    setTimeout(() => {
      travelMap.init();
    }, 100);
  }

  renderTourCardHtml(tour) {
    const isWishlisted = state.isInWishlist(tour.id);
    return `
      <div class="tour-card" id="tour-${tour.id}">
        <div class="tour-card-img" style="background-image: url('${tour.image}')">
          <span class="tour-badge">${tour.badge || 'Featured'}</span>
          <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" onclick="window.safarnamaApp.toggleWishlist('${tour.id}', event)">
            <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
          </button>
          <div class="tour-duration-badge"><i class="fa-solid fa-clock"></i> ${tour.durationDays}D / ${tour.durationNights}N</div>
        </div>
        <div class="tour-card-body">
          <div class="tour-card-meta">
            <span><i class="fa-solid fa-location-dot text-emerald"></i> ${tour.destinationName}</span>
            <span class="tour-rating"><i class="fa-solid fa-star text-gold"></i> ${tour.rating} (${tour.reviewsCount})</span>
          </div>
          <h3 class="tour-card-title">${tour.title}</h3>
          <p class="tour-card-desc">${tour.overview.substring(0, 110)}...</p>
          <div class="tour-highlights-chips">
            <span class="chip"><i class="fa-solid fa-car"></i> ${tour.transportType.split('/')[0]}</span>
            <span class="chip"><i class="fa-solid fa-person-hiking"></i> ${tour.difficulty}</span>
          </div>
          <div class="tour-card-footer">
            <div class="tour-pricing">
              <span class="price-label">Starting From</span>
              <div class="price-val">${state.formatPrice(tour.pricePKR)}</div>
              <small class="seats-left ${tour.availableSeats < 5 ? 'urgent' : ''}">
                <i class="fa-solid fa-chair"></i> ${tour.availableSeats} seats left
              </small>
            </div>
            <div class="tour-card-actions">
              <button class="btn btn-sm btn-outline" onclick="window.safarnamaApp.viewTourDetails('${tour.id}')">Itinerary</button>
              <button class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.openBookingModal('tour', '${tour.id}')">Book Now</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderDestinationCardHtml(dest) {
    return `
      <div class="destination-card" onclick="window.safarnamaApp.viewDestination('${dest.id}')">
        <div class="dest-card-img" style="background-image: url('${dest.heroImage}')">
          <span class="dest-region-tag">${dest.region}</span>
          <div class="dest-overlay-info">
            <span class="dest-alt"><i class="fa-solid fa-arrows-up-to-line"></i> ${dest.altitude}</span>
            <span class="dest-temp"><i class="fa-solid fa-cloud-sun"></i> ${dest.temperature}</span>
          </div>
        </div>
        <div class="dest-card-body">
          <div class="dest-rating"><i class="fa-solid fa-star text-gold"></i> ${dest.rating} (${dest.reviewsCount} reviews)</div>
          <h3>${dest.name}</h3>
          <p class="dest-tagline">${dest.tagline}</p>
          <div class="dest-road-tag ${dest.roadStatus.toLowerCase().includes('open') ? 'open' : 'warning'}">
            <i class="fa-solid fa-road"></i> ${dest.roadStatus.substring(0, 42)}...
          </div>
          <div class="dest-footer">
            <span>Tours from <strong>${state.formatPrice(dest.averageTourPrice)}</strong></span>
            <span class="text-emerald text-bold">Explore Valley <i class="fa-solid fa-chevron-right"></i></span>
          </div>
        </div>
      </div>
    `;
  }

  renderHotelCardHtml(hotel) {
    return `
      <div class="hotel-card">
        <div class="hotel-card-img" style="background-image: url('${hotel.image}')">
          <span class="hotel-badge">${hotel.category}</span>
          <div class="hotel-rating-badge"><i class="fa-solid fa-star text-gold"></i> ${hotel.rating}</div>
        </div>
        <div class="hotel-card-body">
          <div class="hotel-loc"><i class="fa-solid fa-location-dot text-emerald"></i> ${hotel.destinationName}</div>
          <h3 class="hotel-name">${hotel.name}</h3>
          <div class="hotel-amenities-mini">
            ${hotel.amenities.slice(0, 3).map(a => `<span class="amenity-chip"><i class="fa-solid fa-check text-emerald"></i> ${a}</span>`).join('')}
          </div>
          <div class="hotel-card-footer">
            <div class="hotel-pricing">
              <span class="price-label">Per Night</span>
              <div class="price-val">${state.formatPrice(hotel.pricePerNightPKR)}</div>
              <small class="text-muted">${hotel.availableRooms} rooms available</small>
            </div>
            <button class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.openBookingModal('hotel', '${hotel.id}')">Reserve Room</button>
          </div>
        </div>
      </div>
    `;
  }

  renderTransportCardHtml(tr) {
    return `
      <div class="transport-card">
        <div class="transport-img" style="background-image: url('${tr.image}')">
          <span class="trans-badge">${tr.category}</span>
          <div class="trans-capacity"><i class="fa-solid fa-users"></i> ${tr.capacity}</div>
        </div>
        <div class="transport-body">
          <h3>${tr.name}</h3>
          <div class="trans-driver-tag"><i class="fa-solid fa-id-card-clip text-emerald"></i> Mountain Chauffeur Included</div>
          <div class="trans-terrain">
            <small><strong>Recommended For:</strong> ${tr.terrainSuitability}</small>
          </div>
          <div class="trans-features-list">
            ${tr.features.slice(0, 3).map(f => `<span><i class="fa-solid fa-circle-check text-emerald"></i> ${f}</span>`).join('')}
          </div>
          <div class="trans-footer">
            <div>
              <span class="price-label">Daily Rate</span>
              <div class="price-val">${state.formatPrice(tr.ratePerDayPKR)}/day</div>
            </div>
            <button class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.openBookingModal('transport', '${tr.id}')">Book Rental</button>
          </div>
        </div>
      </div>
    `;
  }

  // --- Views ---

  renderToursView() {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    let filteredTours = state.tours;
    if (this.selectedDestinationFilter !== 'all') {
      filteredTours = filteredTours.filter(t => t.destinationId === this.selectedDestinationFilter);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filteredTours = filteredTours.filter(t => t.title.toLowerCase().includes(q) || t.destinationName.toLowerCase().includes(q) || t.region.toLowerCase().includes(q));
    }

    mainContainer.innerHTML = `
      <div class="section-container page-header-compact">
        <h1><i class="fa-solid fa-map-location-dot text-emerald"></i> Domestic Tour Packages across Pakistan</h1>
        <p class="text-muted">Discover fully guided expeditions to Hunza, Skardu, Swat, Fairy Meadows, Neelum Valley, and Gwadar with real-time seat tracking.</p>
      </div>

      <div class="section-container">
        <!-- Filter Bar -->
        <div class="catalog-filters-bar">
          <div class="filter-group">
            <label>Filter by Destination:</label>
            <select class="form-select" onchange="window.safarnamaApp.filterToursByDest(this.value)">
              <option value="all" ${this.selectedDestinationFilter === 'all' ? 'selected' : ''}>All Valleys & Regions</option>
              ${state.destinations.map(d => `<option value="${d.id}" ${this.selectedDestinationFilter === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>

          <div class="filter-group">
            <label>Search Keyword:</label>
            <input type="text" placeholder="Search Hunza, Deosai, Trek..." class="form-input" value="${this.searchQuery}" oninput="window.safarnamaApp.handleTourSearchInput(this.value)" />
          </div>
        </div>

        <div class="tours-grid">
          ${filteredTours.length > 0 ? filteredTours.map(t => this.renderTourCardHtml(t)).join('') : `
            <div class="no-results-box">
              <i class="fa-solid fa-mountain text-muted"></i>
              <h3>No matching tours found</h3>
              <p>Try changing your destination filter or search terms.</p>
              <button class="btn btn-emerald" onclick="window.safarnamaApp.filterToursByDest('all')">Reset Filters</button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  renderHotelsView() {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    let filteredHotels = state.hotels;
    if (this.selectedDestinationFilter !== 'all') {
      filteredHotels = filteredHotels.filter(h => h.destinationId === this.selectedDestinationFilter);
    }
    if (this.hotelSearchQuery) {
      const q = this.hotelSearchQuery.toLowerCase();
      filteredHotels = filteredHotels.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.destinationName.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q)
      );
    }

    mainContainer.innerHTML = `
      <div class="section-container page-header-compact">
        <h1><i class="fa-solid fa-hotel text-emerald"></i> Luxury Resorts, Havelis & Glamping Pods</h1>
        <p class="text-muted">Handpicked accommodations with heated rooms, mountain views, and direct online reservations in PKR.</p>
      </div>

      <div class="section-container">
        <!-- Filter Bar for Stays -->
        <div class="catalog-filters-bar">
          <div class="filter-group">
            <label>Filter by Valley / Destination:</label>
            <select class="form-select" onchange="window.safarnamaApp.filterHotelsByDest(this.value)">
              <option value="all" ${this.selectedDestinationFilter === 'all' ? 'selected' : ''}>All Valleys & Regions</option>
              ${state.destinations.map(d => `<option value="${d.id}" ${this.selectedDestinationFilter === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>

          <div class="filter-group">
            <label>Search Resort or Stays:</label>
            <input type="text" placeholder="Search Serena, Shangrila, Glamping, Fort..." class="form-input" value="${this.hotelSearchQuery || ''}" oninput="window.safarnamaApp.handleHotelSearchInput(this.value)" />
          </div>
        </div>

        <div class="hotels-grid">
          ${filteredHotels.length > 0 ? filteredHotels.map(h => this.renderHotelCardHtml(h)).join('') : `
            <div class="no-results-box">
              <i class="fa-solid fa-hotel text-muted"></i>
              <h3>No matching mountain stays found</h3>
              <p>Try changing your destination filter or search terms.</p>
              <button class="btn btn-emerald" onclick="window.safarnamaApp.filterHotelsByDest('all')">Reset Stay Filters</button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  renderTransportView() {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    let filteredTransport = state.transport;
    if (this.selectedTransportCategory && this.selectedTransportCategory !== 'all') {
      const q = this.selectedTransportCategory.toLowerCase();
      filteredTransport = filteredTransport.filter(tr =>
        tr.category.toLowerCase().includes(q) ||
        tr.name.toLowerCase().includes(q) ||
        tr.terrainSuitability.toLowerCase().includes(q)
      );
    }
    if (this.transportSearchQuery) {
      const q = this.transportSearchQuery.toLowerCase();
      filteredTransport = filteredTransport.filter(tr =>
        tr.name.toLowerCase().includes(q) ||
        tr.category.toLowerCase().includes(q) ||
        tr.terrainSuitability.toLowerCase().includes(q)
      );
    }

    mainContainer.innerHTML = `
      <div class="section-container page-header-compact">
        <h1><i class="fa-solid fa-truck-monster text-emerald"></i> Mountain 4x4 Jeeps, Grand Cabins & Chauffeured Rentals</h1>
        <p class="text-muted">Travel comfortably across the Karakoram Highway and rough offroad tracks with licensed mountain drivers.</p>
      </div>

      <div class="section-container">
        <!-- Filter Bar for Transport -->
        <div class="catalog-filters-bar">
          <div class="filter-group">
            <label>Filter by Vehicle Category:</label>
            <select class="form-select" onchange="window.safarnamaApp.filterTransportByCategory(this.value)">
              <option value="all" ${(!this.selectedTransportCategory || this.selectedTransportCategory === 'all') ? 'selected' : ''}>All 4x4s & Fleets</option>
              <option value="suv" ${this.selectedTransportCategory === 'suv' ? 'selected' : ''}>Toyota Prado 4x4 SUV</option>
              <option value="van" ${this.selectedTransportCategory === 'van' ? 'selected' : ''}>Executive Grand Cabin</option>
              <option value="jeep" ${this.selectedTransportCategory === 'jeep' ? 'selected' : ''}>Rugged Off-Road Jeep</option>
              <option value="coaster" ${this.selectedTransportCategory === 'coaster' ? 'selected' : ''}>Coaster Saloon</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Search Vehicle or Terrain:</label>
            <input type="text" placeholder="Search Prado, Deosai, Raikot, Hiace..." class="form-input" value="${this.transportSearchQuery || ''}" oninput="window.safarnamaApp.handleTransportSearchInput(this.value)" />
          </div>
        </div>

        <div class="transport-grid">
          ${filteredTransport.length > 0 ? filteredTransport.map(tr => this.renderTransportCardHtml(tr)).join('') : `
            <div class="no-results-box">
              <i class="fa-solid fa-truck-monster text-muted"></i>
              <h3>No matching vehicles found</h3>
              <p>Try resetting the category filter or search query.</p>
              <button class="btn btn-emerald" onclick="window.safarnamaApp.filterTransportByCategory('all')">Reset Vehicle Filters</button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  setRoadStatusTab(tab) {
    this.roadStatusTab = tab;
    this.renderRoadStatusView();
  }

  renderRoadStatusView() {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    const alerts = state.roadAlerts || [];
    const routes = state.routes || [];
    const openAlertsCount = alerts.filter(a => a.statusLevel === 'success').length;
    const warningAlertsCount = alerts.filter(a => a.statusLevel === 'warning').length;
    const activeTab = this.roadStatusTab || 'all';

    mainContainer.innerHTML = `
      <div class="section-container page-header-compact">
        <div class="page-title-row">
          <div>
            <div class="badge-subtle" style="display:inline-flex; align-items:center; gap:6px; margin-bottom: 8px;">
              <i class="fa-solid fa-satellite-dish text-emerald"></i> National Highway & Motorway Police (NHMP) Feed
            </div>
            <h1>Live Northern Highway Surveillance & Scenic Routes</h1>
            <p class="text-muted">Official real-time road conditions synchronized with NHMP, Gilgit/KPK administrations, and curated national scenic highways across Pakistan.</p>
          </div>
          <div class="emergency-helpline-box">
            <span><i class="fa-solid fa-phone-volume text-ruby"></i> NHMP Emergency: <strong>130</strong></span>
            <span><i class="fa-solid fa-shield-halved text-emerald"></i> SafarNama 24/7 Helpline: <strong>(051) 111-SAFAR</strong></span>
          </div>
        </div>
      </div>

      <!-- KPI Metrics Strip -->
      <div class="section-container">
        <div class="road-kpi-strip">
          <div class="glass-panel road-kpi-card border-left-emerald">
            <div class="road-kpi-lbl">Passes Clear & Open</div>
            <div class="road-kpi-val text-emerald">${openAlertsCount} / ${alerts.length}</div>
            <div class="road-kpi-sub">Operational for domestic traffic</div>
          </div>
          <div class="glass-panel road-kpi-card border-left-amber">
            <div class="road-kpi-lbl">Active Advisories</div>
            <div class="road-kpi-val text-gold">${warningAlertsCount}</div>
            <div class="road-kpi-sub">Weather & tyre-chain cautions</div>
          </div>
          <div class="glass-panel road-kpi-card border-left-cyan">
            <div class="road-kpi-lbl">Scenic Highways</div>
            <div class="road-kpi-val text-cyan">${routes.length}</div>
            <div class="road-kpi-sub">Curated national corridors</div>
          </div>
          <div class="glass-panel road-kpi-card border-left-purple">
            <div class="road-kpi-lbl">Peak Altitude</div>
            <div class="road-kpi-val text-purple">4,693 m</div>
            <div class="road-kpi-sub">Khunjerab Pass (N-35)</div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="road-status-tabs-bar">
          <button class="cat-pill ${activeTab === 'all' ? 'active' : ''}" onclick="window.safarnamaApp.setRoadStatusTab('all')">
            <i class="fa-solid fa-layer-group"></i> All Updates & Corridors (${alerts.length + routes.length})
          </button>
          <button class="cat-pill ${activeTab === 'alerts' ? 'active' : ''}" onclick="window.safarnamaApp.setRoadStatusTab('alerts')">
            <i class="fa-solid fa-triangle-exclamation"></i> Live NHMP Alerts (${alerts.length})
          </button>
          <button class="cat-pill ${activeTab === 'routes' ? 'active' : ''}" onclick="window.safarnamaApp.setRoadStatusTab('routes')">
            <i class="fa-solid fa-route"></i> Scenic Highways & Routes (${routes.length})
          </button>
        </div>
      </div>

      <!-- Corridors Section -->
      ${(activeTab === 'all' || activeTab === 'routes') ? `
        <div class="section-container" style="margin-bottom: 2.5rem;">
          <div class="road-section-header">
            <h3><i class="fa-solid fa-route text-emerald"></i> Curated National Scenic Highways & Expeditions</h3>
            <span class="text-muted text-sm">${routes.length} Corridors</span>
          </div>

          <div class="routes-cards-grid">
            ${routes.map(route => `
              <div class="glass-panel route-status-card" style="border-top: 4px solid ${route.color || '#10b981'};">
                <div class="route-card-top">
                  <div>
                    <div class="route-card-badges">
                      <span class="route-highway-badge" style="background: ${route.color}22; color: ${route.color || '#10b981'}; border-color: ${route.color}66;">
                        ${route.highwayCode}
                      </span>
                      <span class="route-type-badge">${route.type}</span>
                    </div>
                    <h3 class="route-name">${route.name}</h3>
                  </div>
                  <div class="route-status-pill ${route.status.includes('OPEN') ? 'open' : 'seasonal'}">
                    ${route.status.split('(')[0]}
                  </div>
                </div>

                <div class="route-corridor-box">
                  <i class="fa-solid fa-location-dot" style="color: ${route.color || '#10b981'};"></i>
                  <span><strong>${route.startPoint}</strong> <i class="fa-solid fa-arrow-right-long text-muted"></i> <strong>${route.endPoint}</strong></span>
                </div>

                <div class="route-metrics-grid">
                  <div class="route-metric-item">
                    <span class="rm-lbl"><i class="fa-solid fa-road"></i> Distance</span>
                    <span class="rm-val">${route.distanceKm} km</span>
                  </div>
                  <div class="route-metric-item divider">
                    <span class="rm-lbl"><i class="fa-solid fa-clock"></i> Drive Time</span>
                    <span class="rm-val">${route.driveTime}</span>
                  </div>
                  <div class="route-metric-item">
                    <span class="rm-lbl"><i class="fa-solid fa-mountain"></i> Max Altitude</span>
                    <span class="rm-val text-cyan">${route.altitudeMax.split(' ')[0]} m</span>
                  </div>
                </div>

                <p class="route-desc-text">${route.description}</p>

                <div class="route-advisory-row">
                  <i class="fa-solid fa-car-side text-cyan"></i>
                  <span><strong>Vehicle:</strong> ${route.suitableVehicles}</span>
                </div>

                <div class="route-waypoints-wrap">
                  <div class="route-waypoints-label">
                    <i class="fa-solid fa-location-pin text-emerald"></i> Key Scenic Stops (${route.highlights?.length || 0}):
                  </div>
                  <div class="route-stops-chips">
                    ${(route.highlights || []).slice(0, 5).map(h => `<span class="route-chip">${h}</span>`).join('')}
                    ${(route.highlights || []).length > 5 ? `<span class="route-chip more">+${route.highlights.length - 5} more</span>` : ''}
                  </div>
                </div>

                <div class="route-card-actions">
                  <button class="btn btn-sm btn-outline" onclick="window.safarnamaApp.viewRouteOnMap('${route.id}')">
                    <i class="fa-solid fa-map-location-dot"></i> View on Map
                  </button>
                  <button class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.viewRouteDetails('${route.id}')">
                    <i class="fa-solid fa-circle-info"></i> Route Details
                  </button>
                  <button class="btn btn-sm btn-outline" onclick="window.safarnamaApp.navigateTo('ai-planner')">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Plan Trip
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Alerts Section -->
      ${(activeTab === 'all' || activeTab === 'alerts') ? `
        <div class="section-container">
          <div class="road-section-header">
            <h3><i class="fa-solid fa-triangle-exclamation text-gold"></i> Live NHMP Northern Passes Surveillance</h3>
            <span class="text-muted text-sm">${alerts.length} Monitored Passes</span>
          </div>

          <div class="road-full-list">
            ${alerts.map(alert => `
              <div class="road-full-card ${alert.statusLevel}">
                <div class="road-card-left">
                  <div class="road-icon-badge ${alert.statusLevel}">
                    <i class="fa-solid ${alert.statusLevel === 'success' ? 'fa-road-circle-check' : 'fa-triangle-exclamation'}"></i>
                  </div>
                  <div class="road-card-info">
                    <div class="hw-name">${alert.highway}</div>
                    <div class="hw-section"><i class="fa-solid fa-route"></i> ${alert.section}</div>
                    <div class="hw-advisory">${alert.advisory}</div>
                    <div class="hw-meta-chips">
                      <span class="chip"><i class="fa-solid fa-car"></i> ${alert.suitableVehicles}</span>
                      <span class="chip"><i class="fa-solid fa-temperature-half"></i> ${alert.temperature} (${alert.weather})</span>
                    </div>
                  </div>
                </div>

                <div class="road-card-right">
                  <div class="status-pill-lg ${alert.statusLevel}">${alert.status}</div>
                  <div class="last-verified"><i class="fa-regular fa-clock"></i> ${alert.lastUpdated}</div>
                  <button class="btn btn-sm btn-outline" onclick="window.safarnamaApp.viewHighwayOnMap('${alert.id}')">
                    <i class="fa-solid fa-location-crosshairs"></i> View on Map
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }

  renderAIPlannerView() {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    mainContainer.innerHTML = `
      <div class="section-container page-header-compact">
        <div class="page-title-row">
          <div>
            <span class="badge-gold"><i class="fa-solid fa-wand-magic-sparkles"></i> SafarAI Smart Travel Assistant</span>
            <h1>Pakistan Domestic Itinerary & Budget Generator</h1>
            <p class="text-muted">Tell SafarAI your preferences and receive an instant, hyper-localized day-by-day itinerary with PKR cost calculations and realistic mountain travel times.</p>
          </div>
          <div class="ai-status-row">
            <span class="badge-${safarAI.getApiKey() ? 'emerald' : 'subtle'}">
              <i class="fa-solid ${safarAI.getApiKey() ? 'fa-circle-check text-emerald' : 'fa-microchip'}"></i> 
              ${safarAI.getApiKey() ? 'Gemini Live AI: Connected' : 'Engine: Local Pakistan KB'}
            </span>
            <button class="btn btn-sm btn-outline" onclick="window.safarnamaApp.openApiKeyModal()">
              <i class="fa-solid fa-key text-gold"></i> ${safarAI.getApiKey() ? 'API Key Settings' : 'Connect Gemini API Key'}
            </button>
          </div>
        </div>
      </div>

      <div class="section-container">
        <div class="ai-planner-layout">
          <!-- Left Column: Questionnaire Form -->
          <div class="ai-form-card">
            <h3><i class="fa-solid fa-sliders text-emerald"></i> Trip Parameters</h3>
            <form id="ai-planner-form" onsubmit="event.preventDefault(); window.safarnamaApp.handleGenerateAIPlan();">
              <div class="form-group">
                <label><i class="fa-solid fa-location-arrow text-emerald"></i> Departure City</label>
                <select id="ai-origin" class="form-select">
                  <optgroup label="── Major Cities ──">
                    <option value="Islamabad / Rawalpindi">Islamabad / Rawalpindi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Multan">Multan</option>
                    <option value="Faisalabad">Faisalabad</option>
                  </optgroup>
                  <optgroup label="── Balochistan ──">
                    <option value="Quetta">Quetta (Capital)</option>
                    <option value="Gwadar">Gwadar</option>
                    <option value="Turbat">Turbat</option>
                    <option value="Khuzdar">Khuzdar</option>
                    <option value="Hub">Hub</option>
                    <option value="Chaman">Chaman</option>
                    <option value="Zhob">Zhob</option>
                    <option value="Sibi">Sibi</option>
                    <option value="Dera Bugti">Dera Bugti</option>
                    <option value="Loralai">Loralai</option>
                    <option value="Nushki">Nushki</option>
                    <option value="Dalbandin">Dalbandin</option>
                    <option value="Panjgur">Panjgur</option>
                    <option value="Kharan">Kharan</option>
                    <option value="Awaran">Awaran</option>
                    <option value="Mastung">Mastung</option>
                    <option value="Kalat">Kalat</option>
                    <option value="Lasbela">Lasbela (Uthal)</option>
                    <option value="Ormara">Ormara</option>
                    <option value="Pasni">Pasni</option>
                    <option value="Surab">Surab</option>
                    <option value="Harnai">Harnai</option>
                    <option value="Ziarat">Ziarat</option>
                    <option value="Bela">Bela</option>
                    <option value="Washuk">Washuk (Basima)</option>
                    <option value="Musakhel">Musakhel</option>
                    <option value="Sherani">Sherani (Mughal Kot)</option>
                    <option value="Kech">Kech (Mand)</option>
                    <option value="Jhal Magsi">Jhal Magsi</option>
                    <option value="Kohlu">Kohlu</option>
                    <option value="Barkhan">Barkhan</option>
                    <option value="Duki">Duki</option>
                  </optgroup>
                </select>
              </div>

              <div class="form-group dest-combo-group">
                <label><i class="fa-solid fa-mountain-sun text-gold"></i> Destination City / Region</label>
                <div class="dest-combo-wrapper">
                  <i class="fa-solid fa-magnifying-glass dest-combo-icon"></i>
                  <input
                    type="text"
                    id="ai-destination"
                    class="form-input dest-combo-input"
                    list="ai-dest-datalist"
                    placeholder="Type any city or pick from list..."
                    autocomplete="off"
                  />
                  <datalist id="ai-dest-datalist">
                    ${this.getDestinationDatalistOptions()}
                  </datalist>
                </div>
                <span class="dest-combo-hint"><i class="fa-solid fa-pen-to-square"></i> You can type any custom city not in the list</span>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label><i class="fa-solid fa-calendar"></i> Duration</label>
                  <select id="ai-duration" class="form-select">
                    <option value="4">4 Days (Quick Escape)</option>
                    <option value="5">5 Days (Standard Valley Tour)</option>
                    <option value="7" selected>7 Days (Comprehensive Explorer)</option>
                    <option value="9">9 Days (Grand Expedition)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label><i class="fa-solid fa-users"></i> Travelers</label>
                  <input type="number" id="ai-travelers" min="1" max="25" value="2" class="form-input" />
                </div>
              </div>

              <div class="form-group">
                <label><i class="fa-solid fa-wallet text-emerald"></i> Budget Level (PKR)</label>
                <select id="ai-budget-tier" class="form-select">
                  <option value="budget">Economy / Backpacker (Affordable Guest Houses & Coasters)</option>
                  <option value="standard" selected>Standard Deluxe (3-Star Stays & Private Hiace/Sedan)</option>
                  <option value="luxury">Luxury Mountain Retreat (Serena/Shangrila & Prado 4x4)</option>
                </select>
              </div>

              <div class="form-group">
                <label><i class="fa-solid fa-compass"></i> Travel Style</label>
                <select id="ai-style" class="form-select">
                  <option value="family" selected>Family Leisure & Sightseeing</option>
                  <option value="honeymoon">Couples & Honeymoon Romantic</option>
                  <option value="adventure">Youth, Hiking & Extreme 4x4 Off-Road</option>
                </select>
              </div>

              <button type="submit" class="btn btn-emerald btn-block btn-lg" id="btn-ai-generate">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Generate Custom Itinerary
              </button>
            </form>
          </div>

          <!-- Right Column: Generated Plan Output & Interactive AI Chat -->
          <div class="ai-output-container">
            <div id="ai-itinerary-result">
              <div class="ai-empty-state">
                <div class="empty-icon"><i class="fa-solid fa-compass-drafting text-gold"></i></div>
                <h3>Your Personalized Itinerary Will Appear Here</h3>
                <p>Select your departure city, destination, and budget on the left and click <strong>Generate Custom Itinerary</strong>.</p>
              </div>
            </div>

            <!-- Integrated Conversational AI Assistant Drawer -->
            <div class="ai-chat-card">
              <div class="chat-header">
                <div class="chat-header-title">
                  <i class="fa-solid fa-robot text-emerald"></i>
                  <span>Ask SafarAI Travel Assistant</span>
                </div>
                <span class="chat-online-badge"><span class="dot"></span> Online</span>
              </div>
              <div class="chat-messages" id="chat-messages-box">
                ${safarAI.chatHistory.map(m => `
                  <div class="chat-msg ${m.sender}">
                    <div class="msg-bubble">${m.text.replace(/\n/g, '<br/>')}</div>
                  </div>
                `).join('')}
              </div>
              <form class="chat-input-bar" onsubmit="event.preventDefault(); window.safarnamaApp.handleSendMessage();">
                <input type="text" id="chat-user-input" placeholder="Ask anything (e.g., 'Is Babusar Top open in November?')" class="chat-input" />
                <button type="submit" class="btn btn-emerald"><i class="fa-solid fa-paper-plane"></i></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async handleGenerateAIPlan() {
    const origin = document.getElementById('ai-origin').value;
    const destEl = document.getElementById('ai-destination');
    const dest = (destEl && destEl.value.trim()) ? destEl.value.trim() : 'Hunza Valley';
    const duration = parseInt(document.getElementById('ai-duration').value, 10);
    const travelers = parseInt(document.getElementById('ai-travelers').value, 10) || 2;
    const budgetTier = document.getElementById('ai-budget-tier').value;
    const style = document.getElementById('ai-style').value;

    const btn = document.getElementById('btn-ai-generate');
    const resultBox = document.getElementById('ai-itinerary-result');

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Consulting Gemini AI & Road Sensors...`;
    }

    // Show animated loading state
    if (resultBox) {
      const hasKey = !!safarAI.getApiKey();
      resultBox.innerHTML = `
        <div class="ai-loading-state">
          <div class="ai-loading-orb"></div>
          <div class="ai-loading-text">
            <h3><i class="fa-solid fa-satellite-dish text-emerald"></i> ${hasKey ? 'SafarAI is generating your plan...' : 'Building your itinerary...'}</h3>
            <p>${hasKey
          ? 'Consulting Gemini AI with live road conditions from NHMP & SafarNama sensors'
          : 'Add your Gemini API key in Settings for a fully personalized AI plan'
        }</p>
            <div class="ai-loading-steps">
              <span class="step active"><i class="fa-solid fa-road"></i> Checking road conditions</span>
              <span class="step"><i class="fa-solid fa-sun"></i> Analysing season & weather</span>
              <span class="step"><i class="fa-solid fa-map-location-dot"></i> Building day-by-day plan</span>
              <span class="step"><i class="fa-solid fa-money-bill-wave"></i> Calculating PKR budget</span>
            </div>
          </div>
        </div>
      `;
      // Animate loading steps
      let stepIdx = 0;
      const stepEls = resultBox.querySelectorAll('.ai-loading-steps .step');
      const stepInterval = setInterval(() => {
        stepEls.forEach(s => s.classList.remove('active'));
        stepIdx = (stepIdx + 1) % stepEls.length;
        if (stepEls[stepIdx]) stepEls[stepIdx].classList.add('active');
      }, 900);
      this._loadingStepInterval = stepInterval;
    }

    try {
      const result = await safarAI.generateItineraryWithAI({
        originCity: origin,
        destination: dest,
        durationDays: duration,
        budgetTier,
        travelStyle: style,
        travelersCount: travelers
      });

      if (this._loadingStepInterval) {
        clearInterval(this._loadingStepInterval);
        this._loadingStepInterval = null;
      }

      if (result.type === 'gemini' && result.markdown) {
        // Gemini returned full markdown plan — render beautifully
        this.currentAIPlan = { ...result.params, type: 'gemini', markdown: result.markdown };
        this.renderGeminiPlan(result.markdown, result.params);
      } else {
        // Local fallback plan
        const plan = result.plan;
        this.currentAIPlan = plan;
        this.renderGeneratedPlan(plan);

        // Show informational banner if there was an API error
        if (result.type === 'gemini_error' || result.type === 'network_error') {
          const banner = document.createElement('div');
          banner.className = 'ai-api-notice';
          banner.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-gold"></i>
            <span>Gemini AI unavailable (${result.error ? result.error.substring(0, 80) : 'error'}). Showing local plan. <a href="javascript:void(0)" onclick="window.safarnamaApp.openApiKeyModal()">Check API key →</a></span>`;
          const rb = document.getElementById('ai-itinerary-result');
          if (rb) rb.prepend(banner);
        }
      }
    } catch (e) {
      if (this._loadingStepInterval) clearInterval(this._loadingStepInterval);
      const rb = document.getElementById('ai-itinerary-result');
      if (rb) rb.innerHTML = `<div class="ai-error-state"><i class="fa-solid fa-circle-exclamation text-red"></i><p>Failed to generate plan: ${e.message}</p></div>`;
    }

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Custom Itinerary`;
    }
  }

  /** Render Gemini AI-generated markdown as premium styled HTML */
  renderGeminiPlan(markdown, params) {
    const resultBox = document.getElementById('ai-itinerary-result');
    if (!resultBox) return;

    const html = this.markdownToHtml(markdown);
    const hasKey = !!safarAI.getApiKey();

    resultBox.innerHTML = `
      <div class="gemini-plan-card">
        <div class="gemini-plan-badge">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>AI-Generated by Google Gemini</span>
          <span class="gemini-live-dot"></span>
          <span class="gemini-live-label">Live Road Data</span>
        </div>
        <div class="gemini-plan-content">${html}</div>
        <div class="gemini-plan-actions">
          <button class="btn btn-emerald" onclick="window.safarnamaApp.bookAIPlan()">
            <i class="fa-solid fa-bolt"></i> Book This Trip
          </button>
          <button class="btn btn-outline" onclick="window.safarnamaApp.handleGenerateAIPlan()">
            <i class="fa-solid fa-rotate"></i> Regenerate
          </button>
          <button class="btn btn-outline" onclick="window.safarnamaApp.printGeminiPlan()">
            <i class="fa-solid fa-print"></i> Save / Print
          </button>
        </div>
        <div class="gemini-disclaimer">
          <i class="fa-solid fa-circle-info"></i>
          Road conditions sourced from NHMP live sensors & SafarNama database. Always verify locally before travel.
        </div>
      </div>
    `;
  }

  /** Print/save the generated Gemini plan */
  printGeminiPlan() {
    const content = document.querySelector('.gemini-plan-content');
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><title>SafarNama AI Plan</title>
      <style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;line-height:1.6;color:#111}
      h1,h2,h3{color:#047857}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}
      tr:nth-child(even){background:#f9f9f9}blockquote{border-left:4px solid #059669;padding:8px 16px;background:#f0fdf4}
      </style></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  }

  /** Convert markdown to safe HTML for plan display */
  markdownToHtml(md) {
    if (!md) return '';
    let html = md
      // Escape XSS vectors first
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // Restore intentional bold/italic markers before further processing
      // H1-H4
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$2</h2>'.replace('$2', '$1'))
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Bold & italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr/>')
      // Blockquotes
      .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
      // Tables — detect rows with pipes
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        const isHeader = cells.some(c => c.trim().match(/^[-:]+$/));
        if (isHeader) return '<!-- skip -->';
        const tag = 'td';
        return '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
      })
      // Wrap consecutive tr blocks in table tags
      .replace(/((<tr>.+<\/tr>\s*)+)/gs, '<table class="md-table">$1</table>')
      .replace(/<tr><!-- skip --><\/tr>/g, '')
      // Unordered list items
      .replace(/^[-*•] (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.+<\/li>\s*)+/gs, '<ul>$&</ul>')
      // Ordered list items
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Paragraphs — wrap lines not already in HTML
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<')) return trimmed;
        return `<p>${trimmed}</p>`;
      })
      .join('');
    return html;
  }

  renderGeneratedPlan(plan) {
    const resultBox = document.getElementById('ai-itinerary-result');
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div class="generated-plan-card">
        <div class="plan-header">
          <div class="plan-title-wrap">
            <span class="badge-emerald"><i class="fa-solid fa-check-circle"></i> AI Tailored Itinerary</span>
            <h2>${plan.durationDays}-Day Expedition to ${plan.destination.name}</h2>
            <div class="plan-meta">
              <span><i class="fa-solid fa-location-arrow"></i> Origin: <strong>${plan.originCity}</strong></span>
              <span><i class="fa-solid fa-users"></i> <strong>${plan.travelersCount} Travelers</strong></span>
              <span><i class="fa-solid fa-car"></i> Recommended: <strong>${plan.recommendedVehicle}</strong></span>
            </div>
          </div>
          <div class="plan-budget-box">
            <div class="budget-label">Estimated Total Budget (PKR)</div>
            <div class="budget-val">${state.formatPrice(plan.estimatedCostPKR)}</div>
            <div class="budget-sub">Includes transport, hotels & guided activities</div>
            <button class="btn btn-emerald btn-sm" onclick="window.safarnamaApp.bookAIPlan()">
              <i class="fa-solid fa-bolt"></i> Book This Custom Trip
            </button>
          </div>
        </div>

        <div class="plan-road-note">
          <i class="fa-solid fa-road text-gold"></i> <strong>Road Advisory:</strong> ${plan.roadAdvisory}
        </div>

        <!-- Timeline -->
        <div class="itinerary-timeline">
          ${plan.days.map(d => `
            <div class="timeline-day-card">
              <div class="day-number-badge">Day ${d.day}</div>
              <div class="day-content">
                <h4>${d.title}</h4>
                <div class="time-stops-list">
                  ${d.timeSchedule.map(s => `
                    <div class="time-stop">
                      <span class="stop-time text-mono">${s.time}</span>
                      <span class="stop-activity">${s.activity}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="day-footer-meta">
                  <span><i class="fa-solid fa-bed"></i> <strong>Night Stay:</strong> ${d.stay}</span>
                  <span><i class="fa-solid fa-lightbulb text-gold"></i> ${d.tips}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Packing Checklist -->
        <div class="packing-box">
          <h4><i class="fa-solid fa-suitcase-rolling text-emerald"></i> Essential Mountain Packing Checklist</h4>
          <div class="packing-chips">
            ${plan.packingList.map(item => `<span class="chip"><i class="fa-solid fa-check text-emerald"></i> ${item}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  bookAIPlan() {
    if (!this.currentAIPlan) return;
    bookingEngine.startBooking('custom_ai', this.currentAIPlan, {
      travelersCount: this.currentAIPlan.travelersCount,
      travelDate: "2026-09-20",
      departureCity: this.currentAIPlan.originCity
    });
  }

  async handleSendMessage() {
    const input = document.getElementById('chat-user-input');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    safarAI.chatHistory.push({ sender: 'user', text: userText });

    // Add temporary thinking placeholder
    const thinkingId = 'thinking-' + Date.now();
    safarAI.chatHistory.push({
      sender: 'ai',
      text: '<i class="fa-solid fa-circle-notch fa-spin text-emerald"></i> <em>SafarAI is consulting mountain & route data...</em>',
      id: thinkingId
    });
    this.refreshChatMessages();

    try {
      const response = await safarAI.askAssistant(userText);
      const thinkingIdx = safarAI.chatHistory.findIndex(m => m.id === thinkingId);
      if (thinkingIdx !== -1) {
        safarAI.chatHistory[thinkingIdx] = { sender: 'ai', text: response };
      } else {
        safarAI.chatHistory.push({ sender: 'ai', text: response });
      }
    } catch (e) {
      const thinkingIdx = safarAI.chatHistory.findIndex(m => m.id === thinkingId);
      if (thinkingIdx !== -1) {
        safarAI.chatHistory[thinkingIdx] = { sender: 'ai', text: 'Maazrat! An error occurred while generating response. Please check your connection.' };
      }
    }
    this.refreshChatMessages();
  }

  refreshChatMessages() {
    const box = document.getElementById('chat-messages-box');
    if (!box) return;

    box.innerHTML = safarAI.chatHistory.map(m => `
      <div class="chat-msg ${m.sender}">
        <div class="msg-bubble">${m.text.replace(/\n/g, '<br/>')}</div>
      </div>
    `).join('');

    box.scrollTop = box.scrollHeight;
  }

  renderDashboardView() {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    const user = state.user;
    const userBookings = state.bookings;

    mainContainer.innerHTML = `
      <div class="section-container page-header-compact">
        <h1><i class="fa-solid fa-user-circle text-emerald"></i> Traveler Dashboard & E-Tickets</h1>
        <p class="text-muted">Manage your active domestic trips, download digital boarding passes, and view verified bookings.</p>
      </div>

      <div class="section-container">
        <div class="dashboard-grid">
          <!-- Profile Sidebar -->
          <div class="profile-card">
            <div class="profile-avatar-wrap">
              <img src="${user.avatar}" alt="${user.fullName}" class="profile-img" />
              <span class="role-tag">${user.role.toUpperCase()}</span>
            </div>
            <h3 class="profile-name">${user.fullName}</h3>
            <div class="profile-email text-muted">${user.email}</div>
            
            <div class="profile-info-list">
              <div class="info-row">
                <span class="lbl"><i class="fa-solid fa-id-card"></i> CNIC:</span>
                <span class="val text-mono">${user.cnic}</span>
              </div>
              <div class="info-row">
                <span class="lbl"><i class="fa-solid fa-phone"></i> Mobile:</span>
                <span class="val">${user.phone}</span>
              </div>
              <div class="info-row">
                <span class="lbl"><i class="fa-solid fa-city"></i> Base City:</span>
                <span class="val">${user.city}</span>
              </div>
            </div>

            <div class="profile-stats">
              <div class="pstat">
                <div class="num">${userBookings.length}</div>
                <div class="sub">Total Trips</div>
              </div>
              <div class="pstat">
                <div class="num">${state.wishlist.length}</div>
                <div class="sub">Wishlist</div>
              </div>
            </div>
          </div>

          <!-- Bookings List -->
          <div class="dashboard-main">
            <div class="dash-section-title">
              <h3><i class="fa-solid fa-ticket text-emerald"></i> My Active & Past Trips (${userBookings.length})</h3>
            </div>

            ${userBookings.length > 0 ? userBookings.map(b => `
              <div class="user-booking-card">
                <div class="booking-card-top">
                  <div>
                    <span class="badge-emerald">CONFIRMED TRIP</span>
                    <h3 class="bk-title">${b.title}</h3>
                    <div class="bk-ref text-mono">Voucher ID: <strong>${b.id}</strong></div>
                  </div>
                  <div class="bk-price-block">
                    <div class="bk-amount">${state.formatPrice(b.finalAmountPKR)}</div>
                    <div class="bk-gw"><i class="fa-solid fa-shield-check text-emerald"></i> Paid via ${b.paymentMethod}</div>
                  </div>
                </div>

                <div class="booking-card-body-grid">
                  <div class="bmeta">
                    <span class="label"><i class="fa-solid fa-calendar"></i> Travel Date:</span>
                    <strong>${b.travelDate}</strong>
                  </div>
                  <div class="bmeta">
                    <span class="label"><i class="fa-solid fa-location-arrow"></i> Departure:</span>
                    <strong>${b.departureCity}</strong>
                  </div>
                  <div class="bmeta">
                    <span class="label"><i class="fa-solid fa-users"></i> Travelers:</span>
                    <strong>${b.travelersCount || 2} Pax</strong>
                  </div>
                  <div class="bmeta">
                    <span class="label"><i class="fa-solid fa-user-check"></i> Lead Traveler:</span>
                    <strong>${b.leadTraveler.fullName}</strong>
                  </div>
                </div>

                <div class="booking-card-actions">
                  <button class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.viewETicket('${b.id}')">
                    <i class="fa-solid fa-qrcode"></i> View Digital E-Ticket & QR Pass
                  </button>
                  <button class="btn btn-sm btn-outline" onclick="window.safarnamaApp.navigateTo('road-status')">
                    <i class="fa-solid fa-satellite-dish"></i> Check Road Conditions for Route
                  </button>
                </div>
              </div>
            `).join('') : `
              <div class="no-results-box">
                <i class="fa-solid fa-plane-departure text-muted"></i>
                <h3>No bookings yet</h3>
                <p>Discover Pakistan's northern wonders and book your first domestic trip today!</p>
                <button class="btn btn-emerald" onclick="window.safarnamaApp.navigateTo('tours')">Browse Tours</button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  renderAdminView() {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    mainContainer.innerHTML = `
      <div class="admin-wrapper">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar">
          <div class="sidebar-header">
            <i class="fa-solid fa-shield-halved text-emerald"></i>
            <div>
              <strong>Admin Console</strong>
              <div class="sub">Pakistan Operations</div>
            </div>
          </div>

          <nav class="admin-sidebar-nav">
            <button class="admin-nav-item active" data-tab="overview" onclick="window.adminConsole.render('overview')">
              <i class="fa-solid fa-chart-pie"></i> Overview & KPI
            </button>
            <button class="admin-nav-item" data-tab="roads" onclick="window.adminConsole.render('roads')">
              <i class="fa-solid fa-tower-broadcast text-gold"></i> Live Road Broadcaster
            </button>
            <button class="admin-nav-item" data-tab="tours" onclick="window.adminConsole.render('tours')">
              <i class="fa-solid fa-boxes-stacked"></i> Tour Seat Quotas
            </button>
            <button class="admin-nav-item" data-tab="bookings" onclick="window.adminConsole.render('bookings')">
              <i class="fa-solid fa-receipt"></i> Booking Ledger
            </button>
          </nav>

          <div class="sidebar-footer">
            <button class="btn btn-sm btn-outline btn-block" onclick="window.safarnamaApp.toggleUserRole()">
              <i class="fa-solid fa-arrow-left"></i> Exit to Traveler Site
            </button>
          </div>
        </aside>

        <!-- Main Content Area -->
        <div class="admin-main-area" id="admin-content-area">
          <!-- Populated by adminConsole.render() -->
        </div>
      </div>
    `;

    adminConsole.render('overview');
  }

  // --- Modals & Details Viewers ---

  viewTourDetails(tourId) {
    const tour = state.tours.find(t => t.id === tourId);
    if (!tour) return;

    const modal = document.getElementById('generic-modal-container');
    if (!modal) return;

    modal.classList.add('active');
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="window.safarnamaApp.closeGenericModal()"></div>
      <div class="modal-card modal-lg">
        <button class="modal-close-btn" onclick="window.safarnamaApp.closeGenericModal()"><i class="fa-solid fa-xmark"></i></button>
        
        <div class="tour-detail-header" style="background-image: url('${tour.image}')">
          <div class="tour-detail-overlay">
            <span class="badge-emerald">${tour.badge || 'Expedition'}</span>
            <h2>${tour.title}</h2>
            <div class="detail-quick-meta">
              <span><i class="fa-solid fa-clock"></i> ${tour.durationDays} Days / ${tour.durationNights} Nights</span>
              <span><i class="fa-solid fa-location-dot"></i> ${tour.destinationName}</span>
              <span><i class="fa-solid fa-star text-gold"></i> ${tour.rating} (${tour.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        <div class="tour-detail-body">
          <div class="detail-overview-box">
            <h4>Overview</h4>
            <p>${tour.overview}</p>
          </div>

          <div class="detail-itinerary-section">
            <h4><i class="fa-solid fa-route text-emerald"></i> Complete Day-by-Day Itinerary</h4>
            <div class="itinerary-accordion">
              ${tour.itinerary ? tour.itinerary.map(item => `
                <div class="itinerary-day-box">
                  <div class="day-head">
                    <span class="d-num">Day ${item.day}</span>
                    <strong>${item.title}</strong>
                  </div>
                  <div class="day-details">
                    <div class="day-stops">
                      <strong>Key Stops:</strong> ${item.stops.join(' ➔ ')}
                    </div>
                    <div class="day-meta-row">
                      <span><i class="fa-solid fa-bed"></i> <strong>Stay:</strong> ${item.stay}</span>
                      <span><i class="fa-solid fa-utensils"></i> <strong>Meals:</strong> ${item.meals}</span>
                    </div>
                  </div>
                </div>
              `).join('') : '<p>Detailed itinerary available upon booking.</p>'}
            </div>
          </div>

          <div class="detail-inclusions-grid">
            <div class="inc-box">
              <h4><i class="fa-solid fa-circle-check text-emerald"></i> What's Included</h4>
              <ul>
                ${tour.inclusions ? tour.inclusions.map(inc => `<li><i class="fa-solid fa-check text-emerald"></i> ${inc}</li>`).join('') : ''}
              </ul>
            </div>
            <div class="exc-box">
              <h4><i class="fa-solid fa-circle-xmark text-ruby"></i> Excluded</h4>
              <ul>
                ${tour.exclusions ? tour.exclusions.map(exc => `<li><i class="fa-solid fa-xmark text-ruby"></i> ${exc}</li>`).join('') : ''}
              </ul>
            </div>
          </div>

          <div class="tour-modal-footer">
            <div class="footer-price">
              <span class="sub">Total Price Per Person:</span>
              <div class="val">${state.formatPrice(tour.pricePKR)}</div>
            </div>
            <button class="btn btn-emerald btn-lg" onclick="window.safarnamaApp.closeGenericModal(); window.safarnamaApp.openBookingModal('tour', '${tour.id}');">
              <i class="fa-solid fa-bolt"></i> Book This Tour Now
            </button>
          </div>
        </div>
      </div>
    `;
  }

  viewDestination(destId) {
    const dest = state.destinations.find(d => d.id === destId);
    if (!dest) return;

    const modal = document.getElementById('generic-modal-container');
    if (!modal) return;

    modal.classList.add('active');
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="window.safarnamaApp.closeGenericModal()"></div>
      <div class="modal-card modal-lg">
        <button class="modal-close-btn" onclick="window.safarnamaApp.closeGenericModal()"><i class="fa-solid fa-xmark"></i></button>
        
        <div class="tour-detail-header" style="background-image: url('${dest.heroImage}')">
          <div class="tour-detail-overlay">
            <span class="badge-emerald">${dest.region}</span>
            <h2>${dest.name}</h2>
            <p class="tagline">${dest.tagline}</p>
          </div>
        </div>

        <div class="tour-detail-body">
          <div class="dest-stats-grid">
            <div class="dstat"><span class="lbl">Elevation</span><span class="val">${dest.altitude}</span></div>
            <div class="dstat"><span class="lbl">Best Season</span><span class="val">${dest.bestSeason}</span></div>
            <div class="dstat"><span class="lbl">Current Climate</span><span class="val">${dest.temperature}</span></div>
            <div class="dstat"><span class="lbl">Road Status</span><span class="val text-emerald">${dest.roadStatus.split('(')[0]}</span></div>
          </div>

          <div class="highlights-box">
            <h4><i class="fa-solid fa-camera-retro text-emerald"></i> Top Attractions & Landmarks</h4>
            <div class="highlights-list">
              ${dest.highlights.map(h => `<span class="highlight-chip"><i class="fa-solid fa-location-dot text-emerald"></i> ${h}</span>`).join('')}
            </div>
          </div>

          <div class="dest-modal-footer">
            <button class="btn btn-outline" onclick="window.safarnamaApp.closeGenericModal(); window.safarnamaApp.filterToursByDest('${dest.id}')">
              View ${dest.name} Tours
            </button>
            <button class="btn btn-emerald" onclick="window.safarnamaApp.closeGenericModal(); window.safarnamaApp.navigateTo('ai-planner')">
              Plan Custom Itinerary with SafarAI
            </button>
          </div>
        </div>
      </div>
    `;
  }

  viewRestaurantInfo(restId) {
    const rest = (state.restaurants || []).find(r => r.id === restId);
    if (!rest) return;

    const modal = document.getElementById('generic-modal-container');
    if (!modal) return;

    modal.classList.add('active');
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="window.safarnamaApp.closeGenericModal()"></div>
      <div class="modal-card modal-lg">
        <button class="modal-close-btn" onclick="window.safarnamaApp.closeGenericModal()"><i class="fa-solid fa-xmark"></i></button>
        
        <div class="tour-detail-header" style="background-image: url('${rest.image}')">
          <div class="tour-detail-overlay">
            <span class="badge-emerald"><i class="fa-solid fa-fire text-coral"></i> ${rest.cuisine}</span>
            <h2>${rest.name}</h2>
            <p class="tagline"><i class="fa-solid fa-location-dot text-emerald"></i> ${rest.city} • ${rest.category}</p>
          </div>
        </div>

        <div class="tour-detail-body">
          <div class="dest-stats-grid">
            <div class="dstat"><span class="lbl">Must Try Dish</span><span class="val text-gold">${rest.specialty}</span></div>
            <div class="dstat"><span class="lbl">Price Range</span><span class="val">${rest.priceRange}</span></div>
            <div class="dstat"><span class="lbl">Rating</span><span class="val text-emerald"><i class="fa-solid fa-star text-gold"></i> ${rest.rating} (${rest.reviewsCount})</span></div>
            <div class="dstat"><span class="lbl">Hours</span><span class="val">${rest.timings}</span></div>
          </div>

          <div class="tour-detail-overview" style="margin-top: 1rem;">
            <h4><i class="fa-solid fa-utensils text-emerald"></i> About This Culinary Spot</h4>
            <p class="text-muted" style="line-height: 1.6;">${rest.description}</p>
          </div>

          <div class="highlights-box" style="margin-top: 1.25rem;">
            <h4><i class="fa-solid fa-circle-check text-gold"></i> Dining Highlights & Atmosphere</h4>
            <div class="highlights-list">
              ${(rest.highlights || []).map(h => `<span class="highlight-chip"><i class="fa-solid fa-check text-gold"></i> ${h}</span>`).join('')}
            </div>
          </div>

          <div class="dest-modal-footer" style="margin-top: 1.5rem;">
            <button class="btn btn-outline" onclick="window.safarnamaApp.closeGenericModal(); travelMap.flyTo([${rest.coordinates}], 12);">
              <i class="fa-solid fa-map-location-dot"></i> View on Map
            </button>
            <button class="btn btn-emerald" onclick="window.safarnamaApp.closeGenericModal(); window.safarnamaApp.showToast({ title: 'Specialty Saved', message: 'Added ${rest.specialty} to trip dining notes!', type: 'success' });">
              <i class="fa-solid fa-bookmark"></i> Save to Trip Notes
            </button>
          </div>
        </div>
      </div>
    `;
  }

  viewRouteDetails(routeId) {
    const route = (state.routes || []).find(r => r.id === routeId);
    if (!route) return;

    const modal = document.getElementById('generic-modal-container');
    if (!modal) return;

    modal.classList.add('active');
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="window.safarnamaApp.closeGenericModal()"></div>
      <div class="modal-card modal-lg">
        <button class="modal-close-btn" onclick="window.safarnamaApp.closeGenericModal()"><i class="fa-solid fa-xmark"></i></button>
        
        <div class="tour-detail-header" style="background: linear-gradient(135deg, #0b1120 0%, #1e293b 100%); border-bottom: 3px solid ${route.color};">
          <div class="tour-detail-overlay">
            <span class="badge-emerald">${route.highwayCode}</span>
            <h2>${route.name}</h2>
            <p class="tagline">${route.startPoint} ➔ ${route.endPoint}</p>
          </div>
        </div>

        <div class="tour-detail-body">
          <div class="dest-stats-grid">
            <div class="dstat"><span class="lbl">Total Distance</span><span class="val text-emerald">${route.distanceKm} km</span></div>
            <div class="dstat"><span class="lbl">Drive Time</span><span class="val">${route.driveTime}</span></div>
            <div class="dstat"><span class="lbl">Peak Altitude</span><span class="val">${route.altitudeMax}</span></div>
            <div class="dstat"><span class="lbl">Road Status</span><span class="val text-emerald">${route.status.split('(')[0]}</span></div>
          </div>

          <div class="tour-detail-overview" style="margin-top: 1rem;">
            <h4><i class="fa-solid fa-car-side text-cyan"></i> Vehicle & Road Advisory</h4>
            <p class="text-muted" style="line-height: 1.6;">${route.description}</p>
            <p style="margin-top: 0.5rem;"><strong>Recommended Vehicle:</strong> ${route.suitableVehicles}</p>
          </div>

          <div class="highlights-box" style="margin-top: 1.25rem;">
            <h4><i class="fa-solid fa-route text-emerald"></i> Major Waypoints & Scenic Vistas</h4>
            <div class="highlights-list">
              ${(route.highlights || []).map(h => `<span class="highlight-chip"><i class="fa-solid fa-location-pin text-emerald"></i> ${h}</span>`).join('')}
            </div>
          </div>

          <div class="dest-modal-footer" style="margin-top: 1.5rem;">
            <button class="btn btn-outline" onclick="window.safarnamaApp.closeGenericModal(); travelMap.setFilter('routes');">
              <i class="fa-solid fa-map"></i> View Route on Map
            </button>
            <button class="btn btn-emerald" onclick="window.safarnamaApp.closeGenericModal(); window.safarnamaApp.navigateTo('ai-planner');">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Plan Custom Itinerary
            </button>
          </div>
        </div>
      </div>
    `;
  }

  viewETicket(bookingId) {
    const booking = state.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    bookingEngine.currentBookingData = {
      completedBooking: booking,
      finalAmountPKR: booking.finalAmountPKR,
      leadTraveler: booking.leadTraveler
    };
    bookingEngine.setStep(4);
  }

  viewHighwayOnMap(alertId) {
    const alert = state.roadAlerts.find(a => a.id === alertId);
    if (!alert) return;
    this.navigateTo('home');
    setTimeout(() => {
      travelMap.flyTo(alert.coordinates, 8);
    }, 300);
  }

  viewRouteOnMap(routeId) {
    const route = (state.routes || []).find(r => r.id === routeId);
    if (!route) return;
    this.navigateTo('home');
    setTimeout(() => {
      travelMap.setFilter('routes');
      // Update UI map pills
      document.querySelectorAll('.map-pill').forEach(p => p.classList.remove('active'));
      const routePill = document.querySelector('.map-pill[data-filter="routes"]');
      if (routePill) routePill.classList.add('active');

      const entry = travelMap.markersMap.get(`route-${route.id}`);
      if (entry && entry.bounds) {
        travelMap.map.flyToBounds(entry.bounds, { padding: [60, 60], duration: 1.5 });
        setTimeout(() => {
          if (entry.marker && typeof entry.marker.openPopup === 'function') {
            entry.marker.openPopup();
          }
        }, 1600);
      } else if (route.coordinates && route.coordinates[0]) {
        travelMap.flyTo(route.coordinates[0], 8);
      }
    }, 350);
  }

  openBookingModal(type, itemId) {
    let item = null;
    if (type === 'tour') item = state.tours.find(t => t.id === itemId);
    if (type === 'hotel') item = state.hotels.find(h => h.id === itemId);
    if (type === 'transport') item = state.transport.find(tr => tr.id === itemId);

    if (item) {
      bookingEngine.startBooking(type, item);
    }
  }

  closeGenericModal() {
    const modal = document.getElementById('generic-modal-container');
    if (modal) {
      modal.innerHTML = '';
      modal.classList.remove('active');
    }
  }

  toggleWishlist(tourId, event) {
    if (event) event.stopPropagation();
    state.toggleWishlist(tourId);
    this.showToast({
      title: "Wishlist Updated",
      message: state.isInWishlist(tourId) ? "Saved to your domestic wishlist!" : "Removed from wishlist.",
      type: "info"
    });
    this.refreshCurrentView();
  }

  filterToursByDest(destId) {
    this.selectedDestinationFilter = destId;
    this.navigateTo('tours');
  }

  handleTourSearchInput(query) {
    this.searchQuery = query;
    this.renderToursView();
  }

  filterMap(category, btnElement) {
    document.querySelectorAll('.map-pill').forEach(p => p.classList.remove('active'));
    if (btnElement) {
      btnElement.classList.add('active');
    } else {
      const targetPill = document.querySelector(`.map-pill[data-filter="${category}"]`);
      if (targetPill) targetPill.classList.add('active');
    }

    travelMap.setFilter(category);

    const indicator = document.getElementById('map-layer-indicator');
    if (indicator) {
      const labels = {
        all: 'All Layers (Destinations, Hotels, Restaurants, Routes, Roads)',
        destinations: 'Destinations & Tourist Valleys',
        hotels: 'Verified Resorts, Hotels & Glamping Pods',
        restaurants: 'Iconic Restaurants, Cafes & Highway Dhabas',
        routes: 'Scenic Highway Routes & Expressways',
        roads: 'National Highways & Motorway Police (NHMP) Alerts'
      };
      indicator.innerHTML = `<i class="fa-solid fa-layer-group"></i> Showing: ${labels[category] || category}`;
    }
  }

  handleMapSearch(val) {
    const input = document.getElementById('map-search-input');
    const clearBtn = document.getElementById('map-search-clear-btn');
    const dropdown = document.getElementById('map-search-dropdown');
    if (!dropdown) return;

    const query = (val || '').trim();
    if (clearBtn) {
      clearBtn.style.display = query ? 'flex' : 'none';
    }

    if (!query) {
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
      this.mapSearchResults = [];
      return;
    }

    const results = travelMap.searchLocations(query);
    this.mapSearchResults = results;

    if (results.length === 0) {
      dropdown.innerHTML = `
        <div class="map-search-no-results">
          <i class="fa-solid fa-circle-question"></i>
          <div>
            <strong>No matches found for "${query}"</strong>
            <small>Try searching "Hunza", "Serena", "Monal", "KKH", "Skardu", "Quetta", or "Trout"</small>
          </div>
        </div>
      `;
      dropdown.classList.add('active');
      return;
    }

    dropdown.innerHTML = `
      <div class="map-search-results-header">
        <span>Found ${results.length} locations</span>
        <small>Click to navigate & explore</small>
      </div>
      <div class="map-search-results-list">
        ${results.map((r, idx) => `
          <div class="map-search-result-item" onclick="window.safarnamaApp.selectMapSearchResult(${idx})">
            <div class="map-search-item-icon ${r.type}">
              <i class="fa-solid ${r.icon}"></i>
            </div>
            <div class="map-search-item-info">
              <div class="map-search-item-title-row">
                <span class="map-search-item-title">${r.title}</span>
                <span class="map-search-badge ${r.type}">${r.badge}</span>
              </div>
              <span class="map-search-item-sub">${r.subtitle}</span>
            </div>
            <i class="fa-solid fa-arrow-right-to-bracket map-search-arrow"></i>
          </div>
        `).join('')}
      </div>
    `;
    dropdown.classList.add('active');
  }

  handleMapSearchKey(e) {
    if (e.key === 'Escape') {
      const dropdown = document.getElementById('map-search-dropdown');
      if (dropdown) dropdown.classList.remove('active');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.mapSearchResults && this.mapSearchResults.length > 0) {
        this.selectMapSearchResult(0);
      }
    }
  }

  selectMapSearchResult(index) {
    const item = (this.mapSearchResults || [])[index];
    if (!item) return;

    const input = document.getElementById('map-search-input');
    if (input) input.value = item.title;

    const clearBtn = document.getElementById('map-search-clear-btn');
    if (clearBtn) clearBtn.style.display = 'flex';

    const dropdown = document.getElementById('map-search-dropdown');
    if (dropdown) dropdown.classList.remove('active');

    // Focus on map
    travelMap.selectSearchResult(item);

    if (item.type === 'city_to_city_route') {
      this.showToast({
        title: item.title,
        message: `Route plotted! ${item.subtitle}`,
        type: 'road'
      });
    } else {
      this.showToast({
        title: item.title,
        message: `Navigated to ${item.badge}: ${item.subtitle}`,
        type: 'info'
      });
    }
  }

  clearMapSearch() {
    const input = document.getElementById('map-search-input');
    if (input) input.value = '';

    const clearBtn = document.getElementById('map-search-clear-btn');
    if (clearBtn) clearBtn.style.display = 'none';

    const dropdown = document.getElementById('map-search-dropdown');
    if (dropdown) {
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
    }

    this.mapSearchResults = [];
    if (travelMap.searchMarkerGroup) {
      travelMap.searchMarkerGroup.clearLayers();
    }
  }

  resetMapView() {
    travelMap.flyTo([32.5, 71.5], 6);
    this.filterMap('all');
    this.clearMapSearch();
    this.clearCityRoute();
  }

  // ─── PASSWORD STRENGTH & SUGGESTION ENGINE ────────────────────────────────
  handlePasswordInput(val, meterContainerId = 'gate-pw-meter') {
    const container = document.getElementById(meterContainerId);
    if (!container) return;

    const pw = val || '';
    const strength = evaluatePasswordStrength(pw);

    const fill = container.querySelector('.strength-bar-fill');
    const label = container.querySelector('.strength-label-text');
    const scoreText = container.querySelector('.strength-score-text');

    if (!pw) {
      if (fill) { fill.style.width = '0%'; fill.className = 'strength-bar-fill'; }
      if (label) { label.textContent = 'Strength: Enter password'; label.className = 'strength-label-text text-muted'; }
      if (scoreText) { scoreText.textContent = '0 / 4'; }
    } else if (pw.length < 8) {
      if (fill) { fill.style.width = '25%'; fill.className = 'strength-bar-fill fill-weak'; }
      if (label) { label.textContent = 'Too short (min 8 chars required)'; label.className = 'strength-label-text text-danger'; }
      if (scoreText) { scoreText.textContent = `${strength.score} / 4`; }
    } else if (strength.level === 'weak') {
      if (fill) { fill.style.width = '45%'; fill.className = 'strength-bar-fill fill-weak'; }
      if (label) { label.textContent = 'Weak password (not allowed)'; label.className = 'strength-label-text text-danger'; }
      if (scoreText) { scoreText.textContent = `${strength.score} / 4`; }
    } else if (strength.level === 'moderate') {
      if (fill) { fill.style.width = '75%'; fill.className = 'strength-bar-fill fill-moderate'; }
      if (label) { label.textContent = 'Moderate password (acceptable)'; label.className = 'strength-label-text text-gold'; }
      if (scoreText) { scoreText.textContent = `${strength.score} / 4`; }
    } else {
      if (fill) { fill.style.width = '100%'; fill.className = 'strength-bar-fill fill-strong'; }
      if (label) { label.textContent = 'Strong password! 🛡️'; label.className = 'strength-label-text text-emerald'; }
      if (scoreText) { scoreText.textContent = `${strength.score} / 4`; }
    }

    // Update individual checklist indicators
    const checkLength = container.querySelector('.checklist-item[data-check="length"]');
    const checkCase = container.querySelector('.checklist-item[data-check="case"]');
    const checkNumSym = container.querySelector('.checklist-item[data-check="numsym"]');
    const checkCommon = container.querySelector('.checklist-item[data-check="common"]');

    const updateItem = (elem, passed) => {
      if (!elem) return;
      elem.classList.toggle('passed', !!passed);
      const icon = elem.querySelector('i');
      if (icon) {
        icon.className = passed ? 'fa-solid fa-circle-check text-emerald' : 'fa-regular fa-circle text-muted';
      }
    };

    updateItem(checkLength, pw.length >= 8);
    updateItem(checkCase, /[a-z]/.test(pw) && /[A-Z]/.test(pw));
    updateItem(checkNumSym, /[0-9]/.test(pw) || /[^a-zA-Z0-9]/.test(pw));
    updateItem(checkCommon, pw.length >= 8 && strength.level !== 'weak');
  }

  suggestStrongPassword(targetInputId = 'gate-reg-password', meterContainerId = 'gate-pw-meter') {
    const words = ['Karakoram', 'Skardu', 'Hunza', 'Passu', 'Babusar', 'Deosai', 'Margalla', 'Shangrila', 'Neelum', 'Gwadar', 'Baltistan', 'Naran'];
    const specials = ['#', '$', '!', '@', '&', '%'];
    const chosenWord = words[Math.floor(Math.random() * words.length)];
    const chosenSpecial = specials[Math.floor(Math.random() * specials.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    const endSpecial = specials[Math.floor(Math.random() * specials.length)];
    const strongPw = `${chosenWord}${chosenSpecial}Peak${randomNum}${endSpecial}`;

    const input = document.getElementById(targetInputId);
    if (input) {
      input.value = strongPw;
      input.type = 'text';
      const wrap = input.closest('.auth-pw-wrap');
      if (wrap) {
        const eyeIcon = wrap.querySelector('.pw-eye-btn i');
        if (eyeIcon) eyeIcon.className = 'fa-regular fa-eye-slash';
      }

      this.handlePasswordInput(strongPw, meterContainerId);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(strongPw).catch(() => {});
    }

    this.showToast({
      title: 'Strong Password Generated! 🛡️',
      message: `"${strongPw}" copied to clipboard and set.`,
      type: 'booking'
    });
  }

  // ─── CITY-TO-CITY MAP DIRECTIONS CONTROLLERS ──────────────────────────────
  toggleMapDirections(forceOpen = null) {
    const panel = document.getElementById('map-directions-panel');
    const pill = document.getElementById('map-pill-directions');
    if (!panel) return;

    const shouldShow = forceOpen !== null ? forceOpen : (panel.style.display === 'none' || panel.style.display === '');
    panel.style.display = shouldShow ? 'block' : 'none';
    if (pill) pill.classList.toggle('active', shouldShow);

    if (shouldShow) {
      const originInput = document.getElementById('route-origin-input');
      if (originInput && !originInput.value) {
        originInput.focus();
      }
    }
  }

  swapDirections() {
    const origin = document.getElementById('route-origin-input');
    const dest = document.getElementById('route-dest-input');
    if (origin && dest) {
      const temp = origin.value;
      origin.value = dest.value;
      dest.value = temp;
      if (origin.value && dest.value) {
        this.executeMapDirections();
      }
    }
  }

  quickRoute(origin, dest) {
    const originInput = document.getElementById('route-origin-input');
    const destInput = document.getElementById('route-dest-input');
    if (originInput) originInput.value = origin;
    if (destInput) destInput.value = dest;
    this.toggleMapDirections(true);
    this.executeMapDirections();
  }

  executeMapDirections() {
    const originVal = (document.getElementById('route-origin-input')?.value || '').trim();
    const destVal = (document.getElementById('route-dest-input')?.value || '').trim();

    if (!originVal || !destVal) {
      this.showToast({
        title: 'Missing Route Details',
        message: 'Please specify both Origin and Destination cities (e.g., Lahore to Hunza).',
        type: 'road'
      });
      return;
    }

    const result = travelMap.planCityToCityRoute(originVal, destVal);
    if (result && result.success) {
      this.showToast({
        title: `${result.origin.name} ➔ ${result.dest.name}`,
        message: `Plotted route: ${result.estimate.distanceKm} km • ${result.estimate.driveTime}`,
        type: 'road'
      });
    }
  }

  clearCityRoute() {
    travelMap.clearCityRoute();
    const origin = document.getElementById('route-origin-input');
    const dest = document.getElementById('route-dest-input');
    if (origin) origin.value = '';
    if (dest) dest.value = '';
    this.showToast({
      title: 'Route Cleared',
      message: 'Active city route removed from map.',
      type: 'info'
    });
  }

  planAIWithRoute(origin, dest) {
    this.navigateTo('ai-planner');
    setTimeout(() => {
      const startCity = document.getElementById('ai-start-city');
      const destCity = document.getElementById('ai-destination');
      if (startCity) startCity.value = origin;
      if (destCity) destCity.value = dest;
      this.showToast({
        title: 'SafarAI Planner Connected! 🤖',
        message: `Loaded ${origin} to ${dest} expedition into itinerary generator.`,
        type: 'booking'
      });
    }, 200);
  }


  renderSearchFormInnerHtml() {
    const cat = this.selectedCategoryFilter || 'all';

    if (cat === 'hotels') {
      return `
        <form class="search-form-grid" onsubmit="event.preventDefault(); window.safarnamaApp.handleSearchSubmit();">
          <div class="search-field dest-combo-group">
            <label><i class="fa-solid fa-location-dot text-emerald"></i> Destination City / Valley</label>
            <div class="dest-combo-wrapper">
              <i class="fa-solid fa-magnifying-glass dest-combo-icon"></i>
              <input
                type="text"
                id="search-dest-select"
                class="search-input dest-combo-input"
                list="search-dest-datalist-hotels"
                placeholder="Any city, valley or region..."
                value="${this.selectedDestinationFilter !== 'all' ? this.selectedDestinationFilter : ''}"
                autocomplete="off"
              />
              <datalist id="search-dest-datalist-hotels">
                ${this.getDestinationDatalistOptions()}
              </datalist>
            </div>
            <span class="dest-combo-hint"><i class="fa-solid fa-pen-to-square"></i> Type any custom destination</span>
          </div>

          <div class="search-field">
            <label><i class="fa-solid fa-calendar-check text-gold"></i> Check-in Date</label>
            <input type="date" id="search-date" class="search-input" value="2026-09-15" min="2026-09-04" />
          </div>

          <div class="search-field">
            <label><i class="fa-solid fa-bed text-cyan"></i> Stay Duration</label>
            <select id="search-duration-select" class="search-input">
              <option value="1">1 Night (Weekend Escape)</option>
              <option value="2" selected>2 Nights (Recommended)</option>
              <option value="3">3 Nights (Extended Holiday)</option>
              <option value="5">5+ Nights (Full Valley Retreat)</option>
            </select>
          </div>

          <div class="search-field">
            <label><i class="fa-solid fa-hotel text-emerald"></i> Stay Category</label>
            <select id="search-hotel-type" class="search-input">
              <option value="all">All Accommodations (Forts, Chalets, Pods)</option>
              <option value="resort">Luxury Mountain Resort</option>
              <option value="chalet">Boutique Lakefront Chalet</option>
              <option value="glamping">Heated Glamping Pod / Dome</option>
            </select>
          </div>

          <button type="submit" class="btn btn-emerald btn-search-submit">
            <i class="fa-solid fa-hotel"></i> Search Mountain Stays
          </button>
        </form>

        <div class="search-quick-direct">
          <i class="fa-solid fa-sparkles text-gold"></i> Direct Access: 
          <a href="javascript:void(0)" onclick="window.safarnamaApp.navigateTo('hotels')">Browse all ${state.hotels.length} Mountain Resorts & Pods &rarr;</a>
        </div>
      `;
    }

    if (cat === 'transport') {
      return `
        <form class="search-form-grid" onsubmit="event.preventDefault(); window.safarnamaApp.handleSearchSubmit();">
          <div class="search-field">
            <label><i class="fa-solid fa-route text-emerald"></i> Route & Terrain</label>
            <select id="search-transport-route" class="search-input">
              <option value="all">All Routes (KKH, Deosai, Passu, Swat)</option>
              <option value="deosai">Deosai Plains & Skardu Off-Road</option>
              <option value="kkh">Karakoram Highway (Hunza & Khunjerab)</option>
              <option value="swat">Swat Valley & Malam Jabba</option>
              <option value="raikot">Raikot to Fairy Meadows Track</option>
            </select>
          </div>

          <div class="search-field">
            <label><i class="fa-solid fa-calendar-days text-gold"></i> Rental Start Date</label>
            <input type="date" id="search-date" class="search-input" value="2026-09-15" min="2026-09-04" />
          </div>

          <div class="search-field">
            <label><i class="fa-solid fa-truck-monster text-cyan"></i> Vehicle Class</label>
            <select id="search-transport-type" class="search-input">
              <option value="all">All 4x4s & Fleets</option>
              <option value="suv">Toyota Prado TX 4x4 (Mountain Edition)</option>
              <option value="jeep">Rugged Mountain Jeep 4x4 (Extreme Off-Road)</option>
              <option value="van">Toyota Hiace Grand Cabin Executive</option>
              <option value="coaster">Toyota Coaster Saloon</option>
            </select>
          </div>

          <div class="search-field">
            <label><i class="fa-solid fa-id-card-clip text-emerald"></i> Rental Duration</label>
            <select id="search-transport-days" class="search-input">
              <option value="3">3 Days (Driver Included)</option>
              <option value="5" selected>5 Days (Driver Included)</option>
              <option value="7">7 Days (Full Northern Route)</option>
              <option value="10">10+ Days (Extended)</option>
            </select>
          </div>

          <button type="submit" class="btn btn-emerald btn-search-submit">
            <i class="fa-solid fa-truck-monster"></i> Search 4x4 & Rentals
          </button>
        </form>

        <div class="search-quick-direct">
          <i class="fa-solid fa-shield-check text-emerald"></i> Certified Mountain Drivers Included • 
          <a href="javascript:void(0)" onclick="window.safarnamaApp.navigateTo('transport')">Browse all ${state.transport.length} 4x4 Vehicles & Jeeps &rarr;</a>
        </div>
      `;
    }

    if (cat === 'tours') {
      return `
        <form class="search-form-grid" onsubmit="event.preventDefault(); window.safarnamaApp.handleSearchSubmit();">
          <div class="search-field dest-combo-group">
            <label><i class="fa-solid fa-location-dot text-emerald"></i> Destination City / Valley</label>
            <div class="dest-combo-wrapper">
              <i class="fa-solid fa-magnifying-glass dest-combo-icon"></i>
              <input
                type="text"
                id="search-dest-select"
                class="search-input dest-combo-input"
                list="search-dest-datalist-tours"
                placeholder="Any city, valley or region..."
                value="${this.selectedDestinationFilter !== 'all' ? this.selectedDestinationFilter : ''}"
                autocomplete="off"
              />
              <datalist id="search-dest-datalist-tours">
                ${this.getDestinationDatalistOptions()}
              </datalist>
            </div>
            <span class="dest-combo-hint"><i class="fa-solid fa-pen-to-square"></i> Type any custom destination</span>
          </div>

          <div class="search-field">
            <label><i class="fa-solid fa-car-side text-gold"></i> Departure City</label>
            <select id="search-origin-select" class="search-input">
              <optgroup label="── Major Cities ──">
                <option value="Islamabad">Islamabad / Rawalpindi</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Multan">Multan</option>
              </optgroup>
              <optgroup label="── Balochistan ──">
                <option value="Quetta">Quetta (Capital)</option>
                <option value="Gwadar">Gwadar</option>
                <option value="Turbat">Turbat</option>
                <option value="Khuzdar">Khuzdar</option>
                <option value="Hub">Hub</option>
                <option value="Chaman">Chaman</option>
                <option value="Zhob">Zhob</option>
                <option value="Sibi">Sibi</option>
                <option value="Dera Bugti">Dera Bugti</option>
                <option value="Loralai">Loralai</option>
                <option value="Nushki">Nushki</option>
                <option value="Dalbandin">Dalbandin</option>
                <option value="Panjgur">Panjgur</option>
                <option value="Kharan">Kharan</option>
                <option value="Awaran">Awaran</option>
                <option value="Mastung">Mastung</option>
                <option value="Kalat">Kalat</option>
                <option value="Lasbela">Lasbela (Uthal)</option>
                <option value="Ormara">Ormara</option>
                <option value="Pasni">Pasni</option>
                <option value="Surab">Surab</option>
                <option value="Harnai">Harnai</option>
                <option value="Ziarat">Ziarat</option>
                <option value="Bela">Bela</option>
                <option value="Washuk">Washuk (Basima)</option>
                <option value="Musakhel">Musakhel</option>
                <option value="Sherani">Sherani (Mughal Kot)</option>
                <option value="Kech">Kech (Mand)</option>
                <option value="Jhal Magsi">Jhal Magsi</option>
                <option value="Kohlu">Kohlu</option>
                <option value="Barkhan">Barkhan</option>
                <option value="Duki">Duki</option>
              </optgroup>
            </select>
          </div>

          <div class="search-field">
            <label><i class="fa-solid fa-calendar-days text-cyan"></i> Departure Date</label>
            <input type="date" id="search-date" class="search-input" value="2026-09-15" min="2026-09-04" />
          </div>

          <div class="search-field">
            <label><i class="fa-solid fa-money-bill-wave text-emerald"></i> Max Budget (PKR)</label>
            <select id="search-budget-select" class="search-input">
              <option value="50000">Under Rs. 50,000</option>
              <option value="80000">Under Rs. 80,000</option>
              <option value="120000">Under Rs. 120,000</option>
              <option value="200000" selected>Any Budget (Up to Rs. 200k)</option>
            </select>
          </div>

          <button type="submit" class="btn btn-emerald btn-search-submit">
            <i class="fa-solid fa-map-location-dot"></i> Search Guided Tours
          </button>
        </form>

        <div class="search-quick-direct">
          <i class="fa-solid fa-compass text-emerald"></i> Curated Expeditions: 
          <a href="javascript:void(0)" onclick="window.safarnamaApp.navigateTo('tours')">Browse all ${state.tours.length} Guided Tour Packages &rarr;</a>
        </div>
      `;
    }

    // Default 'all'
    return `
      <form class="search-form-grid" onsubmit="event.preventDefault(); window.safarnamaApp.handleSearchSubmit();">
        <div class="search-field dest-combo-group">
          <label><i class="fa-solid fa-location-dot text-emerald"></i> Destination City / Valley</label>
          <div class="dest-combo-wrapper">
            <i class="fa-solid fa-magnifying-glass dest-combo-icon"></i>
            <input
              type="text"
              id="search-dest-select"
              class="search-input dest-combo-input"
              list="search-dest-datalist-all"
              placeholder="Any city, valley or region..."
              value="${this.selectedDestinationFilter !== 'all' ? this.selectedDestinationFilter : ''}"
              autocomplete="off"
            />
            <datalist id="search-dest-datalist-all">
              ${this.getDestinationDatalistOptions()}
            </datalist>
          </div>
          <span class="dest-combo-hint"><i class="fa-solid fa-pen-to-square"></i> Type any custom destination</span>
        </div>

        <div class="search-field">
          <label><i class="fa-solid fa-car-side text-gold"></i> Departure City</label>
          <select id="search-origin-select" class="search-input">
            <optgroup label="── Major Cities ──">
              <option value="Islamabad">Islamabad / Rawalpindi</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Peshawar">Peshawar</option>
              <option value="Multan">Multan</option>
            </optgroup>
            <optgroup label="── Balochistan ──">
              <option value="Quetta">Quetta (Capital)</option>
              <option value="Gwadar">Gwadar</option>
              <option value="Turbat">Turbat</option>
              <option value="Khuzdar">Khuzdar</option>
              <option value="Hub">Hub</option>
              <option value="Chaman">Chaman</option>
              <option value="Zhob">Zhob</option>
              <option value="Sibi">Sibi</option>
              <option value="Dera Bugti">Dera Bugti</option>
              <option value="Loralai">Loralai</option>
              <option value="Nushki">Nushki</option>
              <option value="Dalbandin">Dalbandin</option>
              <option value="Panjgur">Panjgur</option>
              <option value="Kharan">Kharan</option>
              <option value="Awaran">Awaran</option>
              <option value="Mastung">Mastung</option>
              <option value="Kalat">Kalat</option>
              <option value="Lasbela">Lasbela (Uthal)</option>
              <option value="Ormara">Ormara</option>
              <option value="Pasni">Pasni</option>
              <option value="Surab">Surab</option>
              <option value="Harnai">Harnai</option>
              <option value="Ziarat">Ziarat</option>
              <option value="Bela">Bela</option>
              <option value="Washuk">Washuk (Basima)</option>
              <option value="Musakhel">Musakhel</option>
              <option value="Sherani">Sherani (Mughal Kot)</option>
              <option value="Kech">Kech (Mand)</option>
              <option value="Jhal Magsi">Jhal Magsi</option>
              <option value="Kohlu">Kohlu</option>
              <option value="Barkhan">Barkhan</option>
              <option value="Duki">Duki</option>
            </optgroup>
          </select>
        </div>

        <div class="search-field">
          <label><i class="fa-solid fa-calendar-days text-cyan"></i> Travel Date</label>
          <input type="date" id="search-date" class="search-input" value="2026-09-15" min="2026-09-04" />
        </div>

        <div class="search-field">
          <label><i class="fa-solid fa-money-bill-wave text-emerald"></i> Max Budget (PKR)</label>
          <select id="search-budget-select" class="search-input">
            <option value="50000">Under Rs. 50,000</option>
            <option value="80000">Under Rs. 80,000</option>
            <option value="120000">Under Rs. 120,000</option>
            <option value="200000" selected>Any Budget (Up to Rs. 200k)</option>
          </select>
        </div>

        <button type="submit" class="btn btn-emerald btn-search-submit">
          <i class="fa-solid fa-magnifying-glass"></i> Search Real-Time
        </button>
      </form>

      <div class="search-quick-direct">
        <i class="fa-solid fa-bolt text-gold"></i> Quick Direct Access: 
        <a href="javascript:void(0)" onclick="window.safarnamaApp.navigateTo('tours')">Guided Tours</a> • 
        <a href="javascript:void(0)" onclick="window.safarnamaApp.navigateTo('hotels')">Mountain Stays</a> • 
        <a href="javascript:void(0)" onclick="window.safarnamaApp.navigateTo('transport')">4x4 Rentals</a> • 
        <a href="javascript:void(0)" onclick="window.safarnamaApp.navigateTo('road-status')">Live Highway Radar</a>
      </div>
    `;
  }

  setSearchCategory(cat, btnElement) {
    this.selectedCategoryFilter = cat;
    document.querySelectorAll('.search-tab').forEach(t => {
      const match = t.getAttribute('data-cat') === cat || (btnElement && t === btnElement);
      t.classList.toggle('active', !!match);
    });
    const formContainer = document.getElementById('hero-search-form-container');
    if (formContainer) {
      formContainer.innerHTML = this.renderSearchFormInnerHtml();
    }
  }

  handleSearchSubmit() {
    const cat = this.selectedCategoryFilter || 'all';

    if (cat === 'hotels') {
      const destInput = document.getElementById('search-dest-select');
      const destVal = destInput ? destInput.value.trim() : '';
      // Match typed value to known destination id or use custom city as-is
      const matched = state.destinations.find(d =>
        d.id === destVal || d.name.toLowerCase() === destVal.toLowerCase()
      );
      this.selectedDestinationFilter = matched ? matched.id : (destVal || 'all');
      this.customDestinationCity = !matched && destVal ? destVal : null;
      this.hotelSearchQuery = '';
      this.navigateTo('hotels');
      return;
    }

    if (cat === 'transport') {
      const transType = document.getElementById('search-transport-type');
      this.selectedTransportCategory = (transType && transType.value !== 'all') ? transType.value : 'all';
      this.transportSearchQuery = '';
      this.navigateTo('transport');
      return;
    }

    // Default 'tours' or 'all'
    const destInput = document.getElementById('search-dest-select');
    const destVal = destInput ? destInput.value.trim() : '';
    const matched = state.destinations.find(d =>
      d.id === destVal || d.name.toLowerCase() === destVal.toLowerCase()
    );
    this.selectedDestinationFilter = matched ? matched.id : (destVal || 'all');
    this.customDestinationCity = !matched && destVal ? destVal : null;
    this.searchQuery = '';
    this.navigateTo('tours');
  }

  /** Returns all <option> entries for destination datalists */
  getDestinationDatalistOptions() {
    const knownDests = state.destinations.map(d =>
      `<option value="${d.name}">${d.name} — ${d.region}</option>`
    ).join('');
    const extraCities = [
      'Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Multan', 'Faisalabad', 'Quetta',
      'Gwadar', 'Turbat', 'Khuzdar', 'Hub', 'Chaman', 'Zhob', 'Sibi', 'Dera Bugti', 'Loralai',
      'Nushki', 'Dalbandin', 'Panjgur', 'Kharan', 'Awaran', 'Mastung', 'Kalat', 'Lasbela', 'Ormara',
      'Pasni', 'Surab', 'Harnai', 'Ziarat', 'Washuk', 'Musakhel', 'Sherani', 'Kech', 'Jhal Magsi',
      'Kohlu', 'Barkhan', 'Duki', 'Mirpur AJK', 'Muzaffarabad', 'Abbottabad', 'Mansehra', 'Swat',
      'Kalam', 'Bahrain Swat', 'Malam Jabba', 'Chitral', 'Booni', 'Mastuj', 'Gilgit', 'Hunza',
      'Karimabad', 'Passu', 'Attabad Lake', 'Khunjerab Pass', 'Skardu', 'Shigar', 'Khaplu',
      'Deosai Plains', 'Fairy Meadows', 'Naran', 'Kaghan', 'Shogran', 'Babusar Top', 'Chilas',
      'Besham', 'Dasu', 'Havelian', 'Haripur', 'Tarbela', 'Dera Ismail Khan', 'Bannu', 'Kohat',
      'Mardan', 'Nowshera', 'Mingora', 'Timergara', 'Saidu Sharif', 'Bahrain', 'Mianwali',
      'Sargodha', 'Gujranwala', 'Sialkot', 'Gujrat', 'Jhelum', 'Chakwal', 'Attock', 'Taxila',
      'Murree', 'Nathia Gali', 'Bhurban', 'Neelum Valley', 'Leepa Valley', 'Ratti Gali',
      'Shounter Lake', 'Taobat', 'Sharda', 'Kel', 'Keran', 'Jhelum Valley', 'Bagh AJK',
      'Rawalakot', 'Kotli', 'Poonch', 'Saddar', 'Hyderabad', 'Sukkur', 'Larkana', 'Khairpur',
      'Jacobabad', 'Shikarpur', 'Nawabshah', 'Mirpurkhas', 'Thatta', 'Badin', 'Tando Adam',
      'Kund Malir', 'Ormara Beach', 'Astola Island', 'Cape Monze'
    ].filter(city => !state.destinations.find(d => d.name === city));
    const extraOptions = extraCities.map(c => `<option value="${c}">${c}</option>`).join('');
    return knownDests + extraOptions;
  }

  filterHotelsByDest(destId) {
    this.selectedDestinationFilter = destId;
    this.hotelSearchQuery = '';
    this.navigateTo('hotels');
  }

  handleHotelSearchInput(query) {
    this.hotelSearchQuery = query;
    this.renderHotelsView();
  }

  filterTransportByCategory(cat) {
    this.selectedTransportCategory = cat;
    this.transportSearchQuery = '';
    this.navigateTo('transport');
  }

  handleTransportSearchInput(query) {
    this.transportSearchQuery = query;
    this.renderTransportView();
  }

  // --- API Key Management Modal & Services ---

  openApiKeyModal() {
    const modal = document.getElementById('generic-modal-container');
    if (!modal) return;

    const currentGeminiKey = safarAI.getApiKey();
    const currentCartoKey = travelMap ? travelMap.apiKey : (localStorage.getItem('safarnama_carto_api_key') || '');

    modal.classList.add('active');
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="window.safarnamaApp.closeGenericModal()"></div>
      <div class="modal-card modal-lg">
        <button class="modal-close-btn" onclick="window.safarnamaApp.closeGenericModal()"><i class="fa-solid fa-xmark"></i></button>

        <div class="api-modal-header">
          <div class="api-modal-icon"><i class="fa-solid fa-key"></i></div>
          <div>
            <h2>API Key Setup & Integrations 🇵🇰</h2>
            <p class="text-muted">Configure external services for real-time generative AI, interactive maps, and live data.</p>
          </div>
        </div>

        <div class="api-modal-body">
          <!-- Section 1: Google Gemini AI -->
          <div class="api-card-box">
            <div class="api-card-header">
              <div class="api-card-title">
                <i class="fa-solid fa-wand-magic-sparkles text-gold"></i>
                <div>
                  <strong>Google Gemini API Key</strong>
                  <div class="text-muted small">Powers SafarAI live trip planner, dynamic Q&A, and customized day-by-day itineraries</div>
                </div>
              </div>
              <span id="gemini-status-badge" class="api-badge ${currentGeminiKey ? 'active' : ''}">
                <i class="fa-solid ${currentGeminiKey ? 'fa-circle-check text-emerald' : 'fa-circle-dot text-muted'}"></i>
                ${currentGeminiKey ? 'Connected (Live AI)' : 'Not Configured (Using Local Mode)'}
              </span>
            </div>

            <div class="api-input-wrap">
              <div class="api-input-row">
                <input type="password" id="input-gemini-key" class="form-input text-mono" placeholder="AIzaSy..." value="${currentGeminiKey}" />
                <button type="button" class="btn btn-outline btn-sm" onclick="window.safarnamaApp.toggleKeyVisibility('input-gemini-key', this)" title="Toggle Visibility">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </div>
              <div class="api-help-links">
                <span><i class="fa-solid fa-circle-info text-cyan"></i> Don't have an API key?</span>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                  Get Free Gemini API Key from Google AI Studio <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>

            <div class="api-action-buttons">
              <button class="btn btn-sm btn-outline" onclick="window.safarnamaApp.testGeminiKey()">
                <i class="fa-solid fa-vial"></i> Test Connection
              </button>
              <button class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.saveGeminiKey()">
                <i class="fa-solid fa-floppy-disk"></i> Save Gemini Key
              </button>
              ${currentGeminiKey ? `<button class="btn btn-sm btn-outline text-ruby" onclick="window.safarnamaApp.clearGeminiKey()"><i class="fa-solid fa-trash"></i> Remove Key</button>` : ''}
            </div>
            <div id="gemini-test-result" class="api-test-feedback"></div>
          </div>

          <!-- Section 2: CARTO / Mapbox Basemaps Key -->
          <div class="api-card-box">
            <div class="api-card-header">
              <div class="api-card-title">
                <i class="fa-solid fa-map-location-dot text-emerald"></i>
                <div>
                  <strong>CARTO / Mapbox Maps Key</strong>
                  <div class="text-muted small">Optional: For higher tile request quotas and enterprise satellite map layers</div>
                </div>
              </div>
              <span id="carto-status-badge" class="api-badge ${currentCartoKey ? 'active' : ''}">
                <i class="fa-solid ${currentCartoKey ? 'fa-circle-check text-emerald' : 'fa-circle-dot text-muted'}"></i>
                ${currentCartoKey ? 'Configured' : 'Public Tier Active (No Key Needed)'}
              </span>
            </div>

            <div class="api-input-wrap">
              <div class="api-input-row">
                <input type="password" id="input-carto-key" class="form-input text-mono" placeholder="Optional CARTO / Mapbox API Key" value="${currentCartoKey}" />
                <button type="button" class="btn btn-outline btn-sm" onclick="window.safarnamaApp.toggleKeyVisibility('input-carto-key', this)" title="Toggle Visibility">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </div>
            </div>

            <div class="api-action-buttons">
              <button class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.saveCartoKey()">
                <i class="fa-solid fa-floppy-disk"></i> Save Map Key
              </button>
              ${currentCartoKey ? `<button class="btn btn-sm btn-outline text-ruby" onclick="window.safarnamaApp.clearCartoKey()"><i class="fa-solid fa-trash"></i> Remove Key</button>` : ''}
            </div>
            <div id="carto-test-result" class="api-test-feedback"></div>
          </div>
        </div>

        <div class="api-modal-footer">
          <button class="btn btn-outline" onclick="window.safarnamaApp.closeGenericModal()">Done & Close</button>
        </div>
      </div>
    `;
  }

  toggleKeyVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (btnEl) btnEl.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
      input.type = 'password';
      if (btnEl) btnEl.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
  }

  async testGeminiKey() {
    const input = document.getElementById('input-gemini-key');
    const resultBox = document.getElementById('gemini-test-result');
    if (!input || !resultBox) return;

    const val = input.value.trim();
    if (!val) {
      resultBox.className = 'api-test-feedback error';
      resultBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please paste a Google Gemini API Key first.';
      return;
    }

    resultBox.className = 'api-test-feedback loading';
    resultBox.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Contacting Google Gemini API...';

    const testRes = await safarAI.testGeminiApiKey(val);
    if (testRes.success) {
      resultBox.className = 'api-test-feedback success';
      resultBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${testRes.message}`;
    } else {
      resultBox.className = 'api-test-feedback error';
      resultBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${testRes.error}`;
    }
  }

  saveGeminiKey() {
    const input = document.getElementById('input-gemini-key');
    const resultBox = document.getElementById('gemini-test-result');
    if (!input) return;

    const val = input.value.trim();
    safarAI.setApiKey(val);

    if (resultBox) {
      resultBox.className = 'api-test-feedback success';
      resultBox.innerHTML = '<i class="fa-solid fa-check"></i> Google Gemini API key saved to browser storage!';
    }

    const badge = document.getElementById('gemini-status-badge');
    if (badge) {
      badge.className = `api-badge ${val ? 'active' : ''}`;
      badge.innerHTML = `<i class="fa-solid ${val ? 'fa-circle-check text-emerald' : 'fa-circle-dot text-muted'}"></i> ${val ? 'Connected (Live AI)' : 'Not Configured (Using Local Mode)'}`;
    }

    this.showToast({
      title: 'API Key Saved',
      message: val ? 'Google Gemini API key connected!' : 'Gemini key removed; reverted to local mode.',
      type: 'success'
    });

    if (this.currentView === 'ai-planner') {
      this.renderAIPlannerView();
    }
  }

  clearGeminiKey() {
    safarAI.setApiKey('');
    const input = document.getElementById('input-gemini-key');
    if (input) input.value = '';
    const resultBox = document.getElementById('gemini-test-result');
    if (resultBox) {
      resultBox.className = 'api-test-feedback info';
      resultBox.innerHTML = '<i class="fa-solid fa-circle-info"></i> Key removed. SafarAI will use local Pakistani knowledge base.';
    }
    const badge = document.getElementById('gemini-status-badge');
    if (badge) {
      badge.className = 'api-badge';
      badge.innerHTML = '<i class="fa-solid fa-circle-dot text-muted"></i> Not Configured (Using Local Mode)';
    }
    this.showToast({
      title: 'Key Removed',
      message: 'Reverted to built-in local knowledge engine.',
      type: 'info'
    });
    if (this.currentView === 'ai-planner') {
      this.renderAIPlannerView();
    }
  }

  saveCartoKey() {
    const input = document.getElementById('input-carto-key');
    const resultBox = document.getElementById('carto-test-result');
    if (!input) return;

    const val = input.value.trim();
    if (travelMap) travelMap.setApiKey(val);
    else localStorage.setItem('safarnama_carto_api_key', val);

    if (resultBox) {
      resultBox.className = 'api-test-feedback success';
      resultBox.innerHTML = '<i class="fa-solid fa-check"></i> Map API key saved!';
    }

    const badge = document.getElementById('carto-status-badge');
    if (badge) {
      badge.className = `api-badge ${val ? 'active' : ''}`;
      badge.innerHTML = `<i class="fa-solid ${val ? 'fa-circle-check text-emerald' : 'fa-circle-dot text-muted'}"></i> ${val ? 'Configured' : 'Public Tier Active'}`;
    }

    this.showToast({
      title: 'Map Key Saved',
      message: 'Map layer updated.',
      type: 'success'
    });
  }

  clearCartoKey() {
    if (travelMap) travelMap.setApiKey('');
    else localStorage.removeItem('safarnama_carto_api_key');
    const input = document.getElementById('input-carto-key');
    if (input) input.value = '';
    const resultBox = document.getElementById('carto-test-result');
    if (resultBox) {
      resultBox.className = 'api-test-feedback info';
      resultBox.innerHTML = '<i class="fa-solid fa-circle-info"></i> Map key removed. Reverted to public CARTO tier.';
    }
    const badge = document.getElementById('carto-status-badge');
    if (badge) {
      badge.className = 'api-badge';
      badge.innerHTML = '<i class="fa-solid fa-circle-dot text-muted"></i> Public Tier Active (No Key Needed)';
    }
  }
}

// Instantiate master app
export const app = new SafarNamaApp();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.init();
  });
} else {
  app.init();
}
