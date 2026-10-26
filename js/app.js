/* ==========================================================================
   VRS COMPUTER - MASTER CLIENT APPLICATION ENGINE
   Multi-currency ($/៛), Bilingual (EN/KH), Cart, Wishlist, Search, Filters & KHQR
   ========================================================================== */

// Global State
window.VRS_CURRENT_CURRENCY = localStorage.getItem('vrs_currency') || 'USD';
window.VRS_CURRENT_LANG = localStorage.getItem('vrs_lang') || 'EN';
window.VRS_THEME = localStorage.getItem('vrs_theme') || 'light';

let currentCategory = 'all';
let currentBrand = 'all';
let currentSort = 'featured';
let searchQuery = '';

let cartItems = JSON.parse(localStorage.getItem('vrs_cart') || '[]');
let wishlistItems = JSON.parse(localStorage.getItem('vrs_wishlist') || '[]');
let comparisonList = [];
let activeCoupon = null;

// Comprehensive Bilingual Dictionary (English & Khmer)
const I18N_DICTIONARY = {
  EN: {
    brand_tagline: 'Authorized Tech Store • Phnom Penh',
    search_placeholder: 'Search ROG, RTX 4090, MacBook, Ryzen, parts...',
    nav_all: 'All Tech Inventory',
    nav_gaming: 'Gaming Laptops',
    nav_ultrabook: 'Ultrabooks & Business',
    nav_macbook: 'Apple MacBooks',
    nav_desktop: 'Pre-Built Gaming PCs',
    nav_builder: 'PC Builder Studio',
    nav_component: 'GPUs & Components',
    nav_secondhand: 'Certified Pre-Owned (99%)',
    nav_monitor: '4K / OLED Displays',
    nav_peripheral: 'Gaming Gear & Audio',
    nav_showroom: 'Showroom & Map',
    nav_cart: 'Cart',
    nav_wishlist: 'Wishlist',
    brands_header: 'Official Authorized Partners & Distributors',
    flash_title: '⚡ OFFICIAL STORE SPECIALS — FREE VIP ACCESSORY BUNDLE ON ALL RT-SERIES RIGS',
    flash_sub: 'Genuine Cambodian Distributor Stock with Full Warranty & In-Store Setup',
    claimed_label: 'Distributor Stock',
    ends_in: 'Offers Active:',
    catalog_title: 'Explore Tech Inventory',
    catalog_subtitle: 'Real-time stock with detailed Cambodian spec sheets, warranty terms & free gift packages',
    builder_tag: '⚙️ CUSTOM PC CONFIGURATOR',
    builder_title: 'CUSTOM PC BUILDER STUDIO',
    builder_subtitle: 'Design your custom PC build with automated hardware compatibility verification, real-time power wattage calculation, and 1-click quotation export.',
    quick_presets: 'Quick Load Presets:',
    cart_title: 'Shopping Cart',
    wishlist_title: 'Saved Wishlist',
    cart_total: 'Estimated Grand Total:',
    btn_pay_khqr: 'Pay with Bakong KHQR (ABA / ACLEDA / Wing)',
    btn_checkout_tg: 'Instant Checkout via Telegram',
    btn_wishlist_all_cart: 'Add All Wishlist Items to Cart',
    btn_clear_wishlist: 'Clear Wishlist',
    invoice_header: 'Official Order Invoice & Tax Receipt',
    ready_to_ship: '● In Stock',
    add_to_cart: 'Add to Cart',
    telegram_btn: 'Telegram',
    save_prefix: 'SAVE',
    free_prefix: 'Free',
    showroom_map_btn: 'Open in Google Maps',
    showroom_directions_btn: 'Get Driving Directions',
    showroom_map_overlay: 'View Map',
    showroom_scan_qr: '📱 Scan Location QR'
  },
  KH: {
    brand_tagline: 'ហាងកុំព្យូទ័រផ្លូវការ • រាជធានីភ្នំពេញ',
    search_placeholder: 'ស្វែងរក ROG, RTX 4090, MacBook, Ryzen, គ្រឿងបន្លាស់...',
    nav_all: 'ទំនិញបច្ចេកវិទ្យាទាំងអស់',
    nav_gaming: 'កុំព្យូទ័រយួរដៃហ្គេម',
    nav_ultrabook: 'កុំព្យូទ័រការងារ & ស្ដើង',
    nav_macbook: 'Apple MacBooks',
    nav_desktop: 'កុំព្យូទ័រលើតុ Pre-Built',
    nav_builder: 'ស្ទូឌីយោផ្គុំ PC តាមចិត្ត',
    nav_component: 'គ្រឿងបន្លាស់ & ក្រាហ្វិក',
    nav_secondhand: 'មួយទឹកធានាគុណភាព (99%)',
    nav_monitor: 'អេក្រង់ 4K / OLED',
    nav_peripheral: 'គ្រឿងបរិក្ខាហ្គេម & សំឡេង',
    nav_showroom: 'ទីតាំងហាង & ផែនទី',
    nav_cart: 'កន្ត្រក',
    nav_wishlist: 'ចំណូលចិត្ត',
    brands_header: 'ដៃគូសហការ & អ្នកចែកចាយផ្លូវការមានការទទួលស្គាល់',
    flash_title: '⚡ ប្រូម៉ូសិនពិសេស — ថែមជូនកញ្ចប់កាដូ VIP លើម៉ាស៊ីន RTX គ្រប់ស៊េរី',
    flash_sub: 'ទំនិញសុទ្ធ 100% ពីអ្នកចែកចាយនៅកម្ពុជា មានការធានាផ្លូវការ និងសេវាដំឡើងជូនឥតគិតថ្លៃ',
    claimed_label: 'ស្តុកអ្នកចែកចាយ',
    ends_in: 'ការផ្ដល់ជូន:',
    catalog_title: 'ស្វែងរកទំនិញបច្ចេកវិទ្យា',
    catalog_subtitle: 'ស្តុកជាក់ស្តែងផ្ទាល់ ជាមួយតារាងបច្ចេកទេសលម្អិត លក្ខខណ្ឌធានា និងកញ្ចប់កាដូ',
    builder_tag: '⚙️ ស្ទូឌីយោផ្គុំកុំព្យូទ័រផ្ទាល់ខ្លួន',
    builder_title: 'ស្ទូឌីយោផ្គុំ PC តាមតម្រូវការ',
    builder_subtitle: 'រៀបចំម៉ាស៊ីន PC តាមចិត្តជាមួយប្រព័ន្ធត្រួតពិនិត្យភាពត្រូវគ្នានៃគ្រឿងបន្លាស់ គណនាថាមពលភ្លើង (Watt) និងទាញយកសម្រង់តម្លៃផ្លូវការភ្លាមៗ។',
    quick_presets: 'ជម្រើសម៉ាស៊ីនរួចជាស្រេច:',
    cart_title: 'កន្ត្រកទំនិញ',
    wishlist_title: 'ទំនិញក្នុងចំណូលចិត្ត',
    cart_total: 'តម្លៃប៉ាន់ស្មានសរុប:',
    btn_pay_khqr: 'ទូទាត់តាមបាគង KHQR (ABA / ACLEDA / Wing)',
    btn_checkout_tg: 'កម្ម៉ង់ភ្លាមៗតាម Telegram',
    btn_wishlist_all_cart: 'ដាក់ទំនិញចំណូលចិត្តទាំងអស់ក្នុងកន្ត្រក',
    btn_clear_wishlist: 'សម្អាតបញ្ជីចំណូលចិត្ត',
    invoice_header: 'វិក្កយបត្របញ្ជាទិញផ្លូវការ & ប័ណ្ណបង់ប្រាក់ពន្ធ',
    ready_to_ship: '● មានក្នុងស្តុកស្រាប់',
    add_to_cart: 'ដាក់ក្នុងកន្ត្រក',
    telegram_btn: 'Telegram',
    save_prefix: 'ចំណេញ',
    free_prefix: 'ថែមជូន',
    showroom_map_btn: 'បើកមើលក្នុង Google Maps',
    showroom_directions_btn: 'បង្ហាញផ្លូវធ្វើដំណើរ',
    showroom_map_overlay: 'មើលក្នុងផែនទី',
    showroom_scan_qr: '📱 ស្កេន QR ទីតាំង'
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  applyStoreSettings();
  applyTheme(window.VRS_THEME);
  initCurrencySelector();
  initLanguageSelector();
  initHeroSlider();
  initCatalog();
  initSearch();
  initCart();
  initWishlist();
  initKHQR();
  initComparisonTool();
  initBackToTop();
  updateShowroomStatus();
  setInterval(updateShowroomStatus, 60000);
  applyLanguage(window.VRS_CURRENT_LANG);
  
  // Shortcut to Admin Controller: Ctrl+Shift+A
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'admin.html';
    }
  });

  if (typeof initPCBuilder === 'function') {
    try {
      initPCBuilder();
    } catch (e) {
      console.warn('initPCBuilder notice:', e);
    }
  }
});

function applyStoreSettings() {
  const settings = typeof getStoreSettings === 'function' ? getStoreSettings() : null;
  if (!settings) return;

  window.VRS_SETTINGS = settings;
  if (settings.exchangeRateKHR) {
    EXCHANGE_RATE_KHR = settings.exchangeRateKHR;
  }

  // Ticker text
  const tickerEl = document.querySelector('.ticker-text');
  if (tickerEl && settings.tickerAnnouncement) {
    tickerEl.textContent = settings.tickerAnnouncement;
  }

  // Store Phone / Hotline
  const hotlineFormatted = settings.hotline || '+855 98 871 314';
  const hotlineRaw = settings.hotlineRaw || hotlineFormatted.replace(/[^0-9+]/g, '');
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.href = `tel:${hotlineRaw}`;
    if (a.getAttribute('title')?.includes('Hotline')) {
      a.setAttribute('title', `Call Hotline (${hotlineFormatted})`);
    }
  });

  // Telegram Links
  const tgUrl = settings.telegramUrl || `https://t.me/${settings.telegramHandle}`;
  document.querySelectorAll('a[href*="t.me"]').forEach(a => {
    if (!a.href.includes('?text=')) {
      a.href = tgUrl;
    }
  });

  // WhatsApp Links
  const waNum = settings.whatsappNumber || '85598871314';
  const waUrl = settings.whatsappUrl || `https://api.whatsapp.com/send/?phone=${waNum}`;
  document.querySelectorAll('.float-btn--whatsapp').forEach(a => {
    a.href = waUrl;
    a.setAttribute('title', `WhatsApp Support (${hotlineFormatted})`);
  });

  // Showroom Physical Address
  const storeAddress = settings.address || 'VRS Computer Shop, Krong Chbar Mon, Cambodia';
  const addressEl = document.getElementById('showroomAddressText');
  if (addressEl) {
    addressEl.textContent = storeAddress;
  }

  // Google Maps URL & Map Embed
  const gMapsUrl = settings.googleMapsUrl || 'https://maps.app.goo.gl/yCtUfzkAvsytpT6A7?g_st=it';
  const gMapsEmbed = settings.mapEmbedUrl || 'https://maps.google.com/maps?q=VRS+Computer+Shop,+Krong+Chbar+Mon&t=&z=15&ie=UTF8&iwloc=&output=embed';

  const mapIframe = document.getElementById('showroomMapIframe');
  if (mapIframe && (!mapIframe.src || !mapIframe.src.includes('VRS+Computer+Shop'))) {
    mapIframe.src = gMapsEmbed;
  }

  // Update all Google Maps links across the website
  document.querySelectorAll('a[data-map-link], #showroomGoogleMapsBtn, #showroomDirectionsBtn, #footerMapLink, .map-badge-btn, .map-bottom-link').forEach(a => {
    a.href = gMapsUrl;
  });

  // KHQR Modal Elements
  const khqrName = document.getElementById('khqrAccountNameEl');
  if (khqrName && settings.abaAccountName) khqrName.textContent = settings.abaAccountName;

  const khqrUsd = document.getElementById('khqrUsdAccountEl');
  if (khqrUsd && settings.abaUsdAccount) khqrUsd.textContent = settings.abaUsdAccount;

  const khqrKhr = document.getElementById('khqrKhrAccountEl');
  if (khqrKhr && settings.abaKhrAccount) khqrKhr.textContent = settings.abaKhrAccount;

  const khqrImg = document.getElementById('khqrQrImageEl');
  if (khqrImg && settings.abaQrImage) khqrImg.src = settings.abaQrImage;
}

function logStoreOrder(orderData) {
  try {
    const raw = localStorage.getItem('vrs_store_orders');
    const orders = raw ? JSON.parse(raw) : [];
    orders.unshift({
      id: 'VRS-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      ...orderData
    });
    localStorage.setItem('vrs_store_orders', JSON.stringify(orders.slice(0, 50)));
  } catch (e) {
    console.warn('Error saving order log:', e);
  }
}

/* --------------------------------------------------------------------------
   THEME TOGGLE
   -------------------------------------------------------------------------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('vrs_theme', theme);
  window.VRS_THEME = theme;

  const themeIcon = document.getElementById('themeToggleIcon');
  if (themeIcon) {
    if (theme === 'light') {
      themeIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    } else {
      themeIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
  }
}

function toggleTheme() {
  const newTheme = window.VRS_THEME === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info');
}

/* --------------------------------------------------------------------------
   CURRENCY SWITCHER (USD vs KHR ៛)
   -------------------------------------------------------------------------- */
function initCurrencySelector() {
  const usdBtn = document.getElementById('currencyUsdBtn');
  const khrBtn = document.getElementById('currencyKhrBtn');

  function updateButtons() {
    if (window.VRS_CURRENT_CURRENCY === 'USD') {
      usdBtn?.classList.add('is-active');
      khrBtn?.classList.remove('is-active');
    } else {
      khrBtn?.classList.add('is-active');
      usdBtn?.classList.remove('is-active');
    }
  }

  updateButtons();

  usdBtn?.addEventListener('click', () => {
    window.VRS_CURRENT_CURRENCY = 'USD';
    localStorage.setItem('vrs_currency', 'USD');
    updateButtons();
    renderCatalog();
    renderCart();
    renderWishlist();
    if (typeof updateBuilderCalculations === 'function') updateBuilderCalculations();
    showToast('Currency set to US Dollars ($)', 'info');
  });

  khrBtn?.addEventListener('click', () => {
    window.VRS_CURRENT_CURRENCY = 'KHR';
    localStorage.setItem('vrs_currency', 'KHR');
    updateButtons();
    renderCatalog();
    renderCart();
    renderWishlist();
    if (typeof updateBuilderCalculations === 'function') updateBuilderCalculations();
    showToast('Currency set to Khmer Riel (៛)', 'info');
  });
}

/* --------------------------------------------------------------------------
   LANGUAGE TOGGLE & DYNAMIC TRANSLATION (EN vs KH)
   -------------------------------------------------------------------------- */
function initLanguageSelector() {
  const langBtn = document.getElementById('langToggleBtn');
  if (!langBtn) return;

  function updateLangLabel() {
    langBtn.textContent = window.VRS_CURRENT_LANG === 'EN' ? '🇰🇭 ភាសាខ្មែរ' : '🇺🇸 English';
    if (window.VRS_CURRENT_LANG === 'KH') {
      document.body.classList.add('lang-kh');
    } else {
      document.body.classList.remove('lang-kh');
    }
  }

  updateLangLabel();

  langBtn.addEventListener('click', () => {
    window.VRS_CURRENT_LANG = window.VRS_CURRENT_LANG === 'EN' ? 'KH' : 'EN';
    localStorage.setItem('vrs_lang', window.VRS_CURRENT_LANG);
    updateLangLabel();
    applyLanguage(window.VRS_CURRENT_LANG);
    renderCatalog();
    renderCart();
    renderWishlist();
    updateShowroomStatus();
    showToast(window.VRS_CURRENT_LANG === 'KH' ? 'បានប្តូរទៅភាសាខ្មែរ' : 'Language set to English', 'info');
  });
}

function applyLanguage(lang) {
  const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.EN;

  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.placeholder = dict.search_placeholder;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  if (typeof renderStorefrontCategories === 'function') {
    renderStorefrontCategories();
  }

  const catalogTitle = document.querySelector('.catalog-section .section-title');
  const catalogSubtitle = document.querySelector('.catalog-section .section-subtitle');
  if (catalogTitle) catalogTitle.textContent = dict.catalog_title;
  if (catalogSubtitle) catalogSubtitle.textContent = dict.catalog_subtitle;

  const brandsLabel = document.querySelector('.brands-header-label');
  if (brandsLabel) brandsLabel.textContent = dict.brands_header;

  const flashTitle = document.querySelector('.flash-title');
  const flashSubtitle = document.querySelector('.flash-subtitle');
  if (flashTitle) flashTitle.textContent = dict.flash_title;
  if (flashSubtitle) flashSubtitle.textContent = dict.flash_sub;

  const builderTitle = document.querySelector('.builder-title');
  const builderSubtitle = document.querySelector('.builder-subtitle');
  if (builderTitle) builderTitle.textContent = dict.builder_title;
  if (builderSubtitle) builderSubtitle.textContent = dict.builder_subtitle;
}

/* --------------------------------------------------------------------------
   HERO SLIDER
   -------------------------------------------------------------------------- */
let heroSlideIndex = 0;
let heroSlideTimer = null;

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('heroSliderDots');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  if (!slides.length) return;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${idx === 0 ? 'is-active' : ''}`;
      dot.addEventListener('click', () => goToHeroSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function goToHeroSlide(idx) {
    slides[heroSlideIndex]?.classList.remove('is-active');
    const dots = document.querySelectorAll('.slider-dot');
    dots[heroSlideIndex]?.classList.remove('is-active');

    heroSlideIndex = (idx + slides.length) % slides.length;

    slides[heroSlideIndex]?.classList.add('is-active');
    dots[heroSlideIndex]?.classList.add('is-active');

    resetHeroTimer();
  }

  function nextHeroSlide() {
    goToHeroSlide(heroSlideIndex + 1);
  }

  function prevHeroSlide() {
    goToHeroSlide(heroSlideIndex - 1);
  }

  function resetHeroTimer() {
    clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(nextHeroSlide, 6500);
  }

  prevBtn?.addEventListener('click', prevHeroSlide);
  nextBtn?.addEventListener('click', nextHeroSlide);

  resetHeroTimer();
}

/* --------------------------------------------------------------------------
   CC COMPUTER KH MOBILE DRAWER & NAVIGATION CONTROLLER
   -------------------------------------------------------------------------- */
function initMobileNavDrawer() {
  const toggleBtns = document.querySelectorAll('[data-cc-burger-open], .cc-burger, #mobileNavToggleBtn');
  const closeBtns = document.querySelectorAll('[data-cc-burger-close], .cc-nav-drawer__close, #mobileNavCloseBtn');
  const scrims = document.querySelectorAll('[data-cc-scrim], .cc-nav-scrim, #mobileNavScrim');
  const drawers = document.querySelectorAll('[data-cc-drawer], .cc-nav-drawer, #mobileNavDrawer');

  function openDrawer() {
    drawers.forEach(d => d.classList.add('is-open'));
    scrims.forEach(s => s.classList.add('is-open'));
    document.body.classList.add('drawer-open');
    document.body.style.overflow = 'hidden';
    toggleBtns.forEach(b => b.setAttribute('aria-expanded', 'true'));
  }

  function closeDrawer() {
    drawers.forEach(d => d.classList.remove('is-open'));
    scrims.forEach(s => s.classList.remove('is-open'));
    document.body.classList.remove('drawer-open');
    document.body.style.overflow = '';
    toggleBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
  }

  toggleBtns.forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });
  closeBtns.forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  });
  scrims.forEach(s => {
    s.addEventListener('click', closeDrawer);
  });

  // Auto-close when clicking any link inside drawer
  drawers.forEach(d => {
    d.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeDrawer);
    });
  });

  // Escape key closes drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  window.openMobileNavDrawer = openDrawer;
  window.closeMobileNavDrawer = closeDrawer;
}

/* --------------------------------------------------------------------------
   DYNAMIC CATEGORIES STOREFRONT SYNCHRONIZER
   -------------------------------------------------------------------------- */
let currentSubCategory = 'all';

function renderStorefrontCategories() {
  const categories = typeof loadCategoriesData === 'function' ? loadCategoriesData() : [];
  const activeCats = categories.filter(c => c.active !== false);
  const isKhmer = window.VRS_CURRENT_LANG === 'KH';
  let currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase().split('?')[0];
  if (!currentPage || currentPage === '/') currentPage = 'index.html';

  const catPageMap = {
    laptop: 'index.html',
    desktop: 'newpc.html',
    pcpart: 'pcpart.html',
    secondhand: 'oldcomputer.html',
    peripherals: 'peripherals.html',
    storage: 'storage.html',
    network: 'network.html',
    speaker: 'speaker.html',
    printer: 'printer.html',
    accessories: 'accessories.html'
  };

  // 1. Desktop Sticky Category Nav (#categoryNavList)
  const navList = document.getElementById('categoryNavList');
  if (navList) {
    let html = '';
    activeCats.forEach(cat => {
      const pageHref = catPageMap[cat.slug] || `index.html?cat=${cat.slug}`;
      const isAct = (currentPage === pageHref.toLowerCase()) || 
                    (currentPage === 'index.html' && cat.slug === 'laptop');
      const label = isKhmer && cat.nameKh ? cat.nameKh : cat.name;
      html += `<li><a class="cc-nav__link ${isAct ? 'is-active' : ''}" href="${pageHref}">${label}</a></li>`;
    });
    html += `
      <li><a class="cc-nav__link ${window.location.hash === '#builder' ? 'is-active' : ''}" href="index.html#builder"><span style="background:#ff7a1a;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;margin-right:4px;">PRO</span> PC Builder</a></li>
      <li><a class="cc-nav__link ${currentPage === 'contactus.html' ? 'is-active' : ''}" href="contactus.html">Contact Us</a></li>
    `;
    navList.innerHTML = html;
  }

  // 2. Mobile Drawer Navigation (#mobileDrawerNavList)
  const mobileList = document.getElementById('mobileDrawerNavList');
  if (mobileList) {
    let mHtml = '';
    activeCats.forEach(cat => {
      const pageHref = catPageMap[cat.slug] || `index.html?cat=${cat.slug}`;
      const isAct = (currentPage === pageHref.toLowerCase()) || 
                    (currentPage === 'index.html' && cat.slug === 'laptop');
      const icon = cat.icon || '💻';
      const label = isKhmer && cat.nameKh ? cat.nameKh : cat.name;
      const khLabel = !isKhmer && cat.nameKh ? `<span style="font-size: 0.76rem; color: var(--text-muted); margin-left: 6px;">(${cat.nameKh})</span>` : '';
      mHtml += `<li><a class="cc-nav__link ${isAct ? 'is-active' : ''}" href="${pageHref}">${icon} ${label} ${khLabel}</a></li>`;
    });
    mHtml += `
      <li><a class="cc-nav__link" href="index.html#builder">⚙️ <span style="background:#ff7a1a;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;margin-right:4px;">PRO</span> PC Builder</a></li>
      <li><a class="cc-nav__link ${currentPage === 'contactus.html' ? 'is-active' : ''}" href="contactus.html">📍 Contact Us</a></li>
    `;
    mobileList.innerHTML = mHtml;
  }

  // 3. Catalog Filter Tags Bar (#catalogFilterTagsBar) if present on legacy pages
  const catalogFilterBar = document.getElementById('catalogFilterTagsBar');
  if (catalogFilterBar) {
    let allLabel = isKhmer ? 'ទំនិញទាំងអស់' : 'All Inventory';
    let fHtml = `<button class="filter-tag-btn ${currentCategory === 'all' ? 'is-active' : ''}" data-category-filter="all">${allLabel}</button>`;
    activeCats.forEach(cat => {
      const isAct = currentCategory === cat.slug;
      const label = isKhmer && cat.nameKh ? cat.nameKh : cat.name;
      fHtml += `<button class="filter-tag-btn ${isAct ? 'is-active' : ''}" data-category-filter="${cat.slug}">${cat.icon ? cat.icon + ' ' : ''}${label}</button>`;
    });
    catalogFilterBar.innerHTML = fHtml;
  }

  wireCategoryFilterEvents();
}

function wireCategoryFilterEvents() {
  document.querySelectorAll('button[data-category-filter]').forEach(el => {
    el.onclick = (e) => {
      e.preventDefault();
      const cat = el.getAttribute('data-category-filter');
      setStorefrontCategory(cat);
      if (typeof window.closeMobileNavDrawer === 'function') {
        window.closeMobileNavDrawer();
      }
    };
  });
}

function setStorefrontCategory(categorySlug) {
  currentCategory = categorySlug || 'all';
  currentSubCategory = 'all';

  document.querySelectorAll('[data-category-filter]').forEach(item => {
    if (item.getAttribute('data-category-filter') === currentCategory) {
      item.classList.add('is-active');
    } else {
      item.classList.remove('is-active');
    }
  });

  renderSubcategoryPills();
  renderCatalog();

  const catalogSec = document.getElementById('catalog');
  if (catalogSec && window.scrollY > 350) {
    catalogSec.scrollIntoView({ behavior: 'smooth' });
  }
}

/* --------------------------------------------------------------------------
   SUBCATEGORY & BRAND MODEL PILLS BAR (CC COMPUTER KH FEATURE)
   -------------------------------------------------------------------------- */
function renderSubcategoryPills() {
  const container = document.getElementById('subcatPillsBar');
  if (!container) return;

  container.className = 'subcat-pills-bar txtlink';

  let pills = [{ label: 'All Models', value: 'all' }];

  if (currentCategory === 'laptop') {
    pills = [
      { label: 'All Laptops', value: 'all' },
      { label: 'Vivobook', value: 'ASUS' },
      { label: 'ZenBook', value: 'ZenBook' },
      { label: 'ROG GAMING', value: 'ROG' },
      { label: 'TUF GAMING', value: 'TUF' },
      { label: 'Zephyrus', value: 'Zephyrus' },
      { label: 'Apple MacBook', value: 'APPLE' },
      { label: 'Lenovo Legion', value: 'LENOVO' },
      { label: 'MSI Gaming', value: 'MSI' },
      { label: 'Alienware / Dell', value: 'DELL' }
    ];
  } else if (currentCategory === 'desktop') {
    pills = [
      { label: 'All Desktops', value: 'all' },
      { label: 'Titan RTX 4090', value: 'titan' },
      { label: 'Apex 7800X3D', value: 'apex' },
      { label: 'Esports 1080p', value: 'esports' },
      { label: 'Creator Studio', value: 'creator' }
    ];
  } else if (currentCategory === 'pcpart' || currentCategory === 'component') {
    pills = [
      { label: 'All PC Parts', value: 'all' },
      { label: 'RTX GPUs', value: 'gpu' },
      { label: 'Ryzen / Intel CPUs', value: 'cpu' },
      { label: 'Motherboards', value: 'motherboard' },
      { label: 'DDR5 RAM', value: 'ram' },
      { label: 'Power Supply', value: 'psu' }
    ];
  } else if (currentCategory === 'secondhand') {
    pills = [
      { label: 'All 99% Pre-Owned', value: 'all' },
      { label: 'MacBook Pro 99%', value: 'macbook' },
      { label: 'RTX 3080 Ti Pre-Owned', value: 'gpu' },
      { label: 'Used Desktops', value: 'desktop' }
    ];
  } else {
    let baseList = [...PRODUCTS_DATA];
    if (currentCategory !== 'all') {
      baseList = baseList.filter(p => matchCategory(p, currentCategory));
    }
    const brands = Array.from(new Set(baseList.map(p => p.brand).filter(Boolean)));
    brands.forEach(b => pills.push({ label: b, value: b }));
  }

  container.innerHTML = pills.map(p => `
    <button class="myButton subcat-pill-btn ${currentSubCategory === p.value ? 'is-active' : ''}" onclick="setStorefrontSubCategory('${p.value}')">
      ${p.label}
    </button>
  `).join('');
}

function setStorefrontSubCategory(val) {
  currentSubCategory = val;
  renderSubcategoryPills();
  renderCatalog();
}

window.setStorefrontSubCategory = setStorefrontSubCategory;
window.setStorefrontCategory = setStorefrontCategory;

function matchCategory(product, catSlug) {
  if (!catSlug || catSlug === 'all') return true;
  const s = catSlug.toLowerCase().trim();
  const pCat = (product.category || '').toLowerCase().trim();
  const pSub = (product.subCategory || '').toLowerCase().trim();

  if (pCat === s || pSub === s) return true;
  if (s === 'pcpart' && (pCat === 'component' || pCat === 'pcpart')) return true;
  if (s === 'peripherals' && (pCat === 'peripheral' || pCat === 'peripherals' || pCat === 'monitor')) return true;
  return false;
}

/* --------------------------------------------------------------------------
   URL QUERY & HASH ROUTING (CC COMPUTER KH COMPATIBILITY)
   -------------------------------------------------------------------------- */
function handleUrlCategoryRouting() {
  const urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get('cat') || urlParams.get('category');
  if (cat) {
    setStorefrontCategory(cat);
    return;
  }
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const known = ['laptop', 'desktop', 'pcpart', 'secondhand', 'peripherals', 'storage', 'network', 'speaker', 'printer', 'accessories'];
  if (known.includes(hash)) {
    setStorefrontCategory(hash);
  }
}

/* --------------------------------------------------------------------------
   CATALOG RENDERING & FILTERING
   -------------------------------------------------------------------------- */
function initCatalog() {
  initMobileNavDrawer();
  renderStorefrontCategories();
  handleUrlCategoryRouting();

  document.querySelectorAll('[data-brand-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      const brand = chip.getAttribute('data-brand-filter');
      if (currentBrand === brand) {
        currentBrand = 'all';
        chip.classList.remove('is-active');
      } else {
        document.querySelectorAll('[data-brand-filter]').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        currentBrand = brand;
      }
      renderCatalog();
      const catSec = document.getElementById('catalog');
      if (catSec) {
        catSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const sortSelect = document.getElementById('catalogSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderCatalog();
    });
  }

  renderSubcategoryPills();
  renderCatalog();
}

function getFilteredProducts() {
  let list = [...PRODUCTS_DATA];

  // Category filter
  if (currentCategory !== 'all') {
    list = list.filter(p => matchCategory(p, currentCategory));
  }

  // Subcategory model pill filter
  if (currentSubCategory !== 'all') {
    const subQ = currentSubCategory.toLowerCase();
    list = list.filter(p => {
      return (p.subCategory && p.subCategory.toLowerCase() === subQ) ||
             (p.brand && p.brand.toLowerCase() === subQ) ||
             (p.name && p.name.toLowerCase().includes(subQ)) ||
             (p.code && p.code.toLowerCase().includes(subQ));
    });
  }

  // Brand chip filter
  if (currentBrand !== 'all') {
    list = list.filter(p => p.brand.toLowerCase() === currentBrand.toLowerCase());
  }

  // Search query filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.specs && Object.values(p.specs).some(v => String(v).toLowerCase().includes(q)))
    );
  }

  // Sort
  if (currentSort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

function renderCatalog() {
  const container = document.getElementById('productsGridContainer');
  const countBadge = document.getElementById('productsFoundCount');
  if (!container) return;

  const products = getFilteredProducts();
  if (countBadge) countBadge.textContent = `${products.length} Products Found`;

  if (products.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: var(--text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h3 style="font-size: 1.25rem; margin-bottom: 6px;">No products match your filter</h3>
        <p style="color: var(--text-secondary); margin-bottom: 16px;">Try selecting another model, clearing filters, or searching another term.</p>
        <button class="btn-hero-secondary" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  const dict = I18N_DICTIONARY[window.VRS_CURRENT_LANG] || I18N_DICTIONARY.EN;

  container.innerHTML = products.map(product => {
    const isWishlisted = wishlistItems.some(w => w.id === product.id);

    // CC Computer KH Tag Banner
    let tagClass = 'default-tag';
    let tagText = product.badge || 'DEFAULT COMPANY';
    if (tagText.includes('VIP') || tagText.includes('PRO')) {
      tagClass = 'vip-tag';
    } else if (tagText.includes('HOT') || tagText.includes('DEAL') || tagText.includes('BEST') || tagText.includes('SALE')) {
      tagClass = 'hot-deal-tag';
    }

    const specs = product.specs || {};
    const cpuVal = specs.cpu || specs.processor || '';
    const ramVal = specs.ram || specs.memory || '';
    const displayVal = specs.display || specs.screen || '';
    const gpuVal = specs.gpu || specs.graphics || '';
    const osVal = specs.os || (specs.storage ? `Storage: ${specs.storage}` : '');
    const codeVal = product.code || '';

    // Free gifts
    const giftsList = product.freeGifts && product.freeGifts.length > 0 ? product.freeGifts.join(', ') : '';

    return `
      <div class="product-card cc-product-card" id="product-${product.id}">
        <div class="card-header-bar">
          <span class="${tagClass}">${tagText}</span>
          <span class="brand-badge" style="margin-left: auto;">${product.brand}</span>
        </div>

        <div class="card-image-box">
          <img class="card-img" src="${product.image}" alt="${product.name}" loading="lazy">
          
          <button class="card-wishlist-btn ${isWishlisted ? 'is-active' : ''}" onclick="toggleWishlist('${product.id}')" title="Save to Wishlist" id="wishlist-btn-${product.id}">
            <svg class="heart-icon" viewBox="0 0 24 24" fill="${isWishlisted ? '#ef4444' : 'none'}" stroke="currentColor" stroke-width="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>

          <div class="card-quick-actions">
            <button class="btn-card-action" onclick="openQuickView('${product.id}')" title="Quick View Specs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="btn-card-action" onclick="toggleComparison('${product.id}')" title="Compare Side-by-Side">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
            </button>
          </div>
        </div>

        <h3 class="card-title" title="${product.name}" onclick="openQuickView('${product.id}')" style="cursor: pointer;">${product.name}</h3>

        <div class="cc-price-row">
          <div>
            ${product.originalPrice ? `<span class="price2">${formatPrice(product.originalPrice, window.VRS_CURRENT_CURRENCY)}</span>` : ''}
            <span class="current-price">${formatPrice(product.price, window.VRS_CURRENT_CURRENCY)}</span>
          </div>
          <span class="khr-badge">${window.VRS_CURRENT_CURRENCY === 'USD' ? `≈ ${(Math.round(product.price * EXCHANGE_RATE_KHR)).toLocaleString()} ៛` : `≈ $${product.price}`}</span>
        </div>

        <div class="cc-card-spec-box">
          ${cpuVal ? `<div class="cc-card-spec-line"><b class="blue">- CPU :</b> <b>${cpuVal}</b></div>` : ''}
          ${ramVal ? `<div class="cc-card-spec-line"><b class="blue">- RAM :</b> <b>${ramVal}</b></div>` : ''}
          ${displayVal ? `<div class="cc-card-spec-line"><b class="blue">- Display :</b> <span>${displayVal}</span></div>` : ''}
          ${gpuVal ? `<div class="cc-card-spec-line"><b class="blue">- GPU :</b> <b>${gpuVal}</b></div>` : ''}
          ${osVal ? `<div class="cc-card-spec-line"><b class="blue">- OS :</b> <span>${osVal}</span></div>` : ''}
          ${codeVal ? `<div class="cc-card-spec-line"><b class="blue">- Code :</b> <span style="color: var(--text-muted);">${codeVal}</span></div>` : ''}
          ${giftsList ? `
            <hr class="cc-spec-hr">
            <div class="cc-free-gift" title="${giftsList}">
              <span>🎁 <b>Free :</b> ${giftsList}</span>
            </div>
          ` : ''}
        </div>

        <div class="card-footer-btns">
          <button class="btn-card-cart" onclick="addToCart('${product.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span>${dict.add_to_cart}</span>
          </button>
          <button class="btn-card-telegram" onclick="buyItemViaTelegram('${product.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 4.5 2.8 11.9c-1.2.5-1.2 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.2-.4-1.7-1.9-1.8zM8.9 14.5l9-5.6c.4-.3.8-.1.5.2l-7.4 6.7-.3 3.1z"/></svg>
            <span>${dict.telegram_btn}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function resetAllFilters() {
  currentCategory = 'all';
  currentSubCategory = 'all';
  currentBrand = 'all';
  searchQuery = '';
  document.querySelectorAll('[data-category-filter]').forEach(t => t.classList.remove('is-active'));
  document.querySelectorAll('[data-category-filter="all"]').forEach(t => t.classList.add('is-active'));
  document.querySelectorAll('[data-brand-filter]').forEach(c => c.classList.remove('is-active'));
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';
  renderSubcategoryPills();
  renderCatalog();
  showToast('Filters reset to default', 'info');
}

window.renderStorefrontCategories = renderStorefrontCategories;
window.renderCatalog = renderCatalog;

/* --------------------------------------------------------------------------
   LIVE SEARCH
   -------------------------------------------------------------------------- */
function initSearch() {
  const input = document.getElementById('globalSearchInput');
  const dropdown = document.getElementById('searchResultsDropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    if (searchQuery.length < 2) {
      dropdown.classList.remove('is-open');
      renderCatalog();
      return;
    }

    const matches = PRODUCTS_DATA.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6);

    if (matches.length > 0) {
      dropdown.innerHTML = matches.map(p => `
        <div class="search-result-item" onclick="openQuickView('${p.id}'); document.getElementById('searchResultsDropdown').classList.remove('is-open');">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <div class="search-result-name">${p.name}</div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">${p.code} • ${p.brand}</div>
          </div>
          <div class="search-result-price">${formatPrice(p.price, window.VRS_CURRENT_CURRENCY)}</div>
        </div>
      `).join('');
      dropdown.classList.add('is-open');
    } else {
      dropdown.innerHTML = `<div style="padding: 12px; text-align: center; font-size: 0.85rem; color: var(--text-muted);">No products found matching "${searchQuery}"</div>`;
      dropdown.classList.add('is-open');
    }

    renderCatalog();
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('is-open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== input && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      input.focus();
      input.select();
    } else if (e.key === 'Escape') {
      dropdown.classList.remove('is-open');
      input.blur();
    }
  });
}

/* --------------------------------------------------------------------------
   SHOPPING CART & CHECKOUT
   -------------------------------------------------------------------------- */
function initCart() {
  const scrim = document.getElementById('cartDrawerScrim');
  const openBtn = document.getElementById('headerCartBtn');
  const closeBtn = document.getElementById('closeCartDrawerBtn');

  openBtn?.addEventListener('click', () => {
    renderCart();
    scrim?.classList.add('is-open');
  });

  closeBtn?.addEventListener('click', () => {
    scrim?.classList.remove('is-open');
  });

  scrim?.addEventListener('click', (e) => {
    if (e.target === scrim) scrim.classList.remove('is-open');
  });

  const applyCouponBtn = document.getElementById('applyCouponBtn');
  applyCouponBtn?.addEventListener('click', () => {
    const input = document.getElementById('couponCodeInput');
    if (input && (input.value.trim().toUpperCase() === 'VRS2026' || input.value.trim().toUpperCase() === 'GAMER50')) {
      window.VRS_COUPON_DISCOUNT = 25;
      renderCart();
      showToast('Coupon applied! Saved $25 USD discount!', 'success');
    } else {
      showToast('Invalid promo code. Try "VRS2026"', 'warning');
    }
  });

  const checkoutTgBtn = document.getElementById('cartCheckoutTelegramBtn');
  checkoutTgBtn?.addEventListener('click', checkoutCartViaTelegram);

  const checkoutKhqrBtn = document.getElementById('cartCheckoutKhqrBtn');
  checkoutKhqrBtn?.addEventListener('click', () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty!', 'warning');
      return;
    }
    scrim?.classList.remove('is-open');
    openKHQRModal();
  });

  renderCart();
}

function addToCart(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const existing = cartItems.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      code: product.code,
      qty: 1
    });
  }

  saveCart();
  renderCart();
  showToast(`Added "${product.name.substring(0, 25)}..." to Cart!`, 'success');
  document.getElementById('cartDrawerScrim')?.classList.add('is-open');
}

window.addToCartObject = function(itemObj) {
  cartItems.push({
    id: itemObj.id,
    name: itemObj.name,
    price: itemObj.price,
    image: itemObj.image,
    code: itemObj.code,
    qty: 1,
    isCustomBuild: itemObj.isCustomBuild
  });
  saveCart();
  renderCart();
  document.getElementById('cartDrawerScrim')?.classList.add('is-open');
};

function adjustCartQty(productId, delta) {
  const item = cartItems.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cartItems = cartItems.filter(i => i.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeCartItem(productId) {
  cartItems = cartItems.filter(i => i.id !== productId);
  saveCart();
  renderCart();
  showToast('Item removed from cart', 'info');
}

function saveCart() {
  localStorage.setItem('vrs_cart', JSON.stringify(cartItems));
  updateCartBadge();
}

function updateCartBadge() {
  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('headerCartCount');
  const drawerCount = document.getElementById('cartDrawerCount');
  if (badge) badge.textContent = totalCount;
  if (drawerCount) drawerCount.textContent = totalCount;
}

function renderCart() {
  const container = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotalAmount');
  const totalAmountEl = document.getElementById('cartTotalAmount');
  const khrAmountEl = document.getElementById('cartKhrAmount');
  const discountLine = document.getElementById('cartDiscountLine');
  const discountAmountEl = document.getElementById('cartDiscountAmount');
  const shippingProgress = document.getElementById('freeShippingProgress');
  const shippingPercent = document.getElementById('freeShippingPercent');
  const shippingText = document.getElementById('freeShippingText');

  updateCartBadge();

  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px 10px; text-align: center; color: var(--text-muted);">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p style="font-weight: 600;">Your shopping cart is empty.</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">Explore laptops, gaming PCs, and components to get started.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = formatPrice(0, window.VRS_CURRENT_CURRENCY);
    if (totalAmountEl) totalAmountEl.textContent = formatPrice(0, window.VRS_CURRENT_CURRENCY);
    if (khrAmountEl) khrAmountEl.textContent = '';
    if (shippingProgress) shippingProgress.style.width = '0%';
    if (shippingPercent) shippingPercent.textContent = '0%';
    if (shippingText) shippingText.textContent = 'Add $500 for FREE 2-Hour Phnom Penh Express';
    if (discountLine) discountLine.style.display = 'none';
    return;
  }

  let subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = window.VRS_COUPON_DISCOUNT || 0;
  const grandTotal = Math.max(0, subtotal - discount);

  container.innerHTML = cartItems.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}">
      <div style="flex: 1; min-width: 0;">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price, window.VRS_CURRENT_CURRENCY)} each</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="adjustCartQty('${item.id}', -1)">-</button>
          <span style="font-size: 0.85rem; font-weight: 700; min-width: 20px; text-align: center;">${item.qty}</span>
          <button class="qty-btn" onclick="adjustCartQty('${item.id}', 1)">+</button>
          <button style="margin-left: 10px; color: #ef4444; font-size: 0.75rem;" onclick="removeCartItem('${item.id}')">Remove</button>
        </div>
      </div>
      <div style="font-weight: 800; font-family: var(--font-display); font-size: 1rem; color: var(--text-primary);">
        ${formatPrice(item.price * item.qty, window.VRS_CURRENT_CURRENCY)}
      </div>
    </div>
  `).join('');

  if (subtotalEl) {
    subtotalEl.textContent = formatPrice(subtotal, window.VRS_CURRENT_CURRENCY);
  }

  if (discount > 0 && discountLine && discountAmountEl) {
    discountLine.style.display = 'flex';
    discountAmountEl.textContent = `-${formatPrice(discount, window.VRS_CURRENT_CURRENCY)}`;
  } else if (discountLine) {
    discountLine.style.display = 'none';
  }

  if (totalAmountEl) {
    totalAmountEl.textContent = formatPrice(grandTotal, window.VRS_CURRENT_CURRENCY);
  }

  if (khrAmountEl) {
    if (window.VRS_CURRENT_CURRENCY === 'USD') {
      khrAmountEl.textContent = `≈ ${(grandTotal * EXCHANGE_RATE_KHR).toLocaleString()} ៛`;
    } else {
      khrAmountEl.textContent = `≈ $${grandTotal.toLocaleString()} USD`;
    }
  }

  // Free shipping meter calculation ($500 threshold)
  const freeThreshold = 500;
  const pct = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  if (shippingProgress) shippingProgress.style.width = `${pct}%`;
  if (shippingPercent) shippingPercent.textContent = `${pct}%`;
  if (shippingText) {
    if (subtotal >= freeThreshold) {
      shippingText.textContent = '🎉 FREE 2-Hour Phnom Penh Express Delivery Unlocked!';
    } else {
      const remaining = freeThreshold - subtotal;
      shippingText.textContent = `Add $${remaining} more for FREE 2-Hour Express Delivery`;
    }
  }
}

function checkoutCartViaTelegram() {
  if (cartItems.length === 0) {
    showToast('Your cart is empty!', 'warning');
    return;
  }

  let totalUSD = 0;
  let text = `🛒 *NEW ORDER FROM VRS COMPUTER STORE*\n`;
  text += `====================================\n`;

  cartItems.forEach((item, idx) => {
    const itemTotal = item.price * item.qty;
    totalUSD += itemTotal;
    text += `${idx + 1}. *${item.name}*\n   Qty: ${item.qty} × $${item.price} = $${itemTotal}\n`;
  });

  const discount = window.VRS_COUPON_DISCOUNT || 0;
  const grandTotal = Math.max(0, totalUSD - discount);
  const totalKHR = grandTotal * EXCHANGE_RATE_KHR;

  if (discount > 0) {
    text += `🎁 Discount Coupon: -$${discount}\n`;
  }
  text += `====================================\n`;
  text += `💰 *TOTAL AMOUNT*: $${grandTotal.toLocaleString()} USD (≈ ${totalKHR.toLocaleString()} ៛)\n`;
  text += `📍 *Delivery*: Phnom Penh / Provinces Express\n`;
  text += `📞 *Hotline*: +855 98 871 314\n`;
  text += `Please send me the payment QR code and confirm delivery time!`;

  const encoded = encodeURIComponent(text);
  window.open(`https://t.me/Sounvisal?text=${encoded}`, '_blank');
}

function buyItemViaTelegram(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const khrPrice = (product.price * EXCHANGE_RATE_KHR).toLocaleString();
  let text = `👋 Hello VRS COMPUTER, I would like to order this item:\n\n`;
  text += `💻 *${product.name}*\n`;
  text += `🏷️ Model Code: ${product.code}\n`;
  text += `💰 Price: $${product.price} USD (≈ ${khrPrice} ៛)\n`;
  text += `🎁 Free Gifts: ${product.freeGifts ? product.freeGifts.join(', ') : 'Standard bundle'}\n`;
  text += `📞 Hotline: +855 98 871 314\n\n`;
  text += `Is this item currently in stock for fast delivery in Phnom Penh?`;

  const encoded = encodeURIComponent(text);
  window.open(`https://t.me/Sounvisal?text=${encoded}`, '_blank');
}

/* --------------------------------------------------------------------------
   WISHLIST SYSTEM
   -------------------------------------------------------------------------- */
function initWishlist() {
  const scrim = document.getElementById('wishlistDrawerScrim');
  const openBtn = document.getElementById('headerWishlistBtn');
  const closeBtn = document.getElementById('closeWishlistDrawerBtn');
  const moveAllBtn = document.getElementById('wishlistMoveAllBtn');
  const clearBtn = document.getElementById('wishlistClearBtn');

  openBtn?.addEventListener('click', () => {
    renderWishlist();
    scrim?.classList.add('is-open');
  });

  closeBtn?.addEventListener('click', () => {
    scrim?.classList.remove('is-open');
  });

  scrim?.addEventListener('click', (e) => {
    if (e.target === scrim) scrim.classList.remove('is-open');
  });

  moveAllBtn?.addEventListener('click', moveAllWishlistToCart);
  clearBtn?.addEventListener('click', clearWishlist);

  updateWishlistBadge();
}

function updateWishlistBadge() {
  const badge = document.getElementById('headerWishlistCount');
  const drawerCount = document.getElementById('wishlistDrawerCount');
  if (badge) badge.textContent = wishlistItems.length;
  if (drawerCount) drawerCount.textContent = wishlistItems.length;
}

function toggleWishlist(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const existingIdx = wishlistItems.findIndex(w => w.id === productId);
  if (existingIdx > -1) {
    wishlistItems.splice(existingIdx, 1);
    showToast(`Removed "${product.name.substring(0, 22)}..." from Wishlist`, 'info');
  } else {
    wishlistItems.push(product);
    showToast(`Saved "${product.name.substring(0, 22)}..." to Wishlist!`, 'success');
  }

  localStorage.setItem('vrs_wishlist', JSON.stringify(wishlistItems));
  updateWishlistBadge();
  renderCatalog();
  renderWishlist();
}

function renderWishlist() {
  const container = document.getElementById('wishlistItemsList');
  updateWishlistBadge();
  if (!container) return;

  if (wishlistItems.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px 10px; text-align: center; color: var(--text-muted);">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <p style="font-weight: 600;">Your wishlist is currently empty.</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">Click the heart icon on any product to save it for later.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = wishlistItems.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}">
      <div style="flex: 1; min-width: 0;">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price, window.VRS_CURRENT_CURRENCY)}</div>
        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button class="btn-builder-primary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="addToCart('${item.id}'); toggleWishlist('${item.id}');">Add to Cart</button>
          <button style="color: #ef4444; font-size: 0.75rem; font-weight: 600;" onclick="toggleWishlist('${item.id}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

function moveAllWishlistToCart() {
  if (wishlistItems.length === 0) {
    showToast('Wishlist is empty!', 'warning');
    return;
  }
  wishlistItems.forEach(item => {
    const existing = cartItems.find(c => c.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        code: item.code,
        qty: 1
      });
    }
  });
  wishlistItems = [];
  localStorage.setItem('vrs_wishlist', JSON.stringify([]));
  saveCart();
  renderCart();
  renderWishlist();
  document.getElementById('wishlistDrawerScrim')?.classList.remove('is-open');
  document.getElementById('cartDrawerScrim')?.classList.add('is-open');
  showToast('All wishlist items moved to cart!', 'success');
}

function clearWishlist() {
  wishlistItems = [];
  localStorage.setItem('vrs_wishlist', JSON.stringify([]));
  renderWishlist();
  renderCatalog();
  showToast('Wishlist cleared.', 'info');
}

/* --------------------------------------------------------------------------
   SHOWROOM STATUS (ICT TIMEZONE UTC+7)
   -------------------------------------------------------------------------- */
function updateShowroomStatus() {
  const statusPill = document.getElementById('showroomStatusPill');
  const statusText = document.getElementById('showroomStatusText');
  if (!statusText) return;

  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ictDate = new Date(utc + (3600000 * 7));
  const currentHours = ictDate.getHours();
  const currentMinutes = ictDate.getMinutes();
  const currentTimeDec = currentHours + (currentMinutes / 60);

  const isOpen = currentTimeDec >= 8.0 && currentTimeDec < 20.5;

  if (window.VRS_CURRENT_LANG === 'KH') {
    if (isOpen) {
      statusText.textContent = 'កំពុងបើកដំណើរការ • ៨:០០ ព្រឹក – ៨:៣០ យប់';
      statusPill?.classList.remove('is-closed');
      statusPill?.classList.add('is-open');
    } else {
      statusText.textContent = 'បានបិទសម្រាក • បើកឡើងវិញនៅម៉ោង ៨:០០ ព្រឹក';
      statusPill?.classList.remove('is-open');
      statusPill?.classList.add('is-closed');
    }
  } else {
    if (isOpen) {
      statusText.textContent = 'OPEN NOW • 8:00 AM – 8:30 PM ICT';
      statusPill?.classList.remove('is-closed');
      statusPill?.classList.add('is-open');
    } else {
      statusText.textContent = 'CLOSED NOW • Opens at 8:00 AM ICT';
      statusPill?.classList.remove('is-open');
      statusPill?.classList.add('is-closed');
    }
  }
}

/* --------------------------------------------------------------------------
   CAMBODIA BAKONG KHQR MODAL
   -------------------------------------------------------------------------- */
let khqrTimer = null;

function initKHQR() {
  const modal = document.getElementById('khqrPaymentModal');
  const closeBtn = document.getElementById('closeKhqrModalBtn');
  const confirmBtn = document.getElementById('confirmKhqrPaymentBtn');
  const invoiceModal = document.getElementById('invoiceModal');
  const invoiceCloseBtn = document.getElementById('closeInvoiceBtn');

  invoiceCloseBtn?.addEventListener('click', () => {
    invoiceModal?.classList.remove('is-open');
  });

  invoiceModal?.addEventListener('click', (e) => {
    if (e.target === invoiceModal) {
      invoiceModal.classList.remove('is-open');
    }
  });

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('is-open');
    clearInterval(khqrTimer);
  });

  confirmBtn?.addEventListener('click', () => {
    modal?.classList.remove('is-open');
    clearInterval(khqrTimer);

    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const discount = window.VRS_COUPON_DISCOUNT || 0;
      const grandTotal = Math.max(0, subtotal - discount);
      const snapshot = [...cartItems];

      cartItems = [];
      saveCart();
      renderCart();

      showToast('Payment verified via ABA KHQR! Generating official receipt...', 'success');
      logStoreOrder({
        items: snapshot,
        subtotal,
        discount,
        grandTotal,
        paymentMethod: 'ABA BANK KHQR'
      });
      showDigitalInvoice({
        items: snapshot,
        subtotal,
        discount,
        grandTotal
      });
    } else {
      showToast('Payment verified successfully! Thank you for purchasing from VRS COMPUTER.', 'success');
    }
  });
}

function showDigitalInvoice(orderData) {
  const modal = document.getElementById('invoiceModal');
  const body = document.getElementById('invoiceModalBody');
  if (!modal || !body) return;

  const invNo = 'VRS-INV-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const itemsHtml = orderData.items.map((item, idx) => `
    <tr>
      <td style="text-align: center; color: var(--text-muted); font-size: 0.8rem;">${idx + 1}</td>
      <td>
        <div style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">${item.name}</div>
        <div style="font-size: 0.76rem; color: var(--text-muted);">SKU: ${item.code || 'VRS-' + item.id} • 1-3 Yr Official Warranty</div>
      </td>
      <td style="text-align: center; font-weight: 600;">${item.qty}</td>
      <td style="text-align: right; color: var(--text-secondary);">$${item.price.toLocaleString()}</td>
      <td style="text-align: right; font-weight: 700; color: var(--accent-cyan);">$${(item.price * item.qty).toLocaleString()}</td>
    </tr>
  `).join('');

  const totalKHR = (orderData.grandTotal * EXCHANGE_RATE_KHR).toLocaleString();

  body.innerHTML = `
    <div class="invoice-meta-grid">
      <div class="invoice-meta-box">
        <div class="invoice-meta-label">Billed By (Merchant)</div>
        <div class="invoice-meta-val">VRS COMPUTER CO., LTD.</div>
        <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 3px; line-height: 1.5;">
          Preah Monivong Blvd, Phnom Penh, Cambodia<br>
          Store Manager: <strong>VISAL SOUN</strong><br>
          Hotline: <strong>+855 98 871 314</strong><br>
          Telegram: <strong><a href="https://t.me/Sounvisal" target="_blank" style="color: var(--accent-cyan); text-decoration: none;">@Sounvisal</a></strong>
        </div>
      </div>
      <div class="invoice-meta-box" style="text-align: right;">
        <div class="invoice-meta-label">Invoice Details</div>
        <div class="invoice-meta-val" style="color: var(--accent-cyan); font-family: monospace; font-size: 0.95rem;">${invNo}</div>
        <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 3px; line-height: 1.5;">
          Issued: <strong>${dateStr}</strong><br>
          Payment: <strong>ABA BANK KHQR</strong><br>
          Acc Name: <strong>VISAL SOUN</strong><br>
          USD Acc: <strong>013 997 388</strong> | KHR: <strong>013 997 391</strong>
        </div>
        <div style="margin-top: 8px;">
          <span class="invoice-stamp-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            PAID &amp; VERIFIED
          </span>
        </div>
      </div>
    </div>

    <div class="invoice-table-wrap">
      <table class="invoice-table">
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th>Item &amp; Warranty</th>
            <th style="width: 60px; text-align: center;">Qty</th>
            <th style="width: 100px; text-align: right;">Unit Price</th>
            <th style="width: 110px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>

    <div class="invoice-summary-card">
      <div class="invoice-summary-row">
        <span>Items Subtotal:</span>
        <strong style="color: var(--text-primary);">$${orderData.subtotal.toLocaleString()} USD</strong>
      </div>
      ${orderData.discount > 0 ? `
      <div class="invoice-summary-row" style="color: #10b981;">
        <span>Promo Voucher:</span>
        <strong>-$${orderData.discount.toLocaleString()} USD</strong>
      </div>` : ''}
      <div class="invoice-summary-row">
        <span>VAT / Tax (Cambodia):</span>
        <strong style="color: var(--text-secondary);">0% (Included)</strong>
      </div>
      <div class="invoice-summary-row grand-total">
        <span>Grand Total:</span>
        <span>$${orderData.grandTotal.toLocaleString()} USD</span>
      </div>
      <div class="invoice-summary-row" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
        <span>Total in Riel:</span>
        <strong style="color: var(--accent-cyan);">${totalKHR} ៛</strong>
      </div>
    </div>

    <div class="invoice-footer-actions">
      <button class="btn-invoice-print" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Print Official Tax Receipt
      </button>
      <a href="https://t.me/Sounvisal" target="_blank" rel="noopener" class="btn-builder-primary" style="padding: 10px 18px; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
        <span>Contact @Sounvisal</span>
      </a>
    </div>
  `;

  modal.classList.add('is-open');
}

function openKHQRModal() {
  const modal = document.getElementById('khqrPaymentModal');
  const totalAmountEl = document.getElementById('khqrDisplayAmount');
  const timerEl = document.getElementById('khqrCountdownTimer');
  if (!modal) return;

  let subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = window.VRS_COUPON_DISCOUNT || 0;
  const grandTotal = Math.max(0, subtotal - discount);

  if (totalAmountEl) {
    totalAmountEl.textContent = `$${grandTotal.toLocaleString()} USD (≈ ${(grandTotal * EXCHANGE_RATE_KHR).toLocaleString()} ៛)`;
  }

  let secondsLeft = 15 * 60;
  clearInterval(khqrTimer);
  khqrTimer = setInterval(() => {
    secondsLeft--;
    if (secondsLeft <= 0) {
      clearInterval(khqrTimer);
      if (timerEl) timerEl.textContent = 'Expired';
      return;
    }
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    if (timerEl) timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, 1000);

  modal.classList.add('is-open');
}

/* --------------------------------------------------------------------------
   LOCATION GOOGLE MAPS QR MODAL
   -------------------------------------------------------------------------- */
function openLocationQRModal() {
  const modal = document.getElementById('locationQrModal');
  if (!modal) return;
  const s = typeof getStoreSettings === 'function' ? getStoreSettings() : null;
  const addrEl = document.getElementById('modalQrAddress');
  if (addrEl && s && s.address) {
    addrEl.textContent = s.address;
  }
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeLocationQRModal() {
  const modal = document.getElementById('locationQrModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLocationQRModal();
  }
});

/* --------------------------------------------------------------------------
   QUICK VIEW MODAL
   -------------------------------------------------------------------------- */
function openQuickView(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickViewModal');
  const content = document.getElementById('quickViewContent');
  if (!modal || !content) return;

  const specsList = Object.entries(product.specs || {}).map(([k, v]) => `
    <tr>
      <td style="padding: 8px 12px; font-weight: 700; color: var(--text-muted); border-bottom: 1px solid var(--border-subtle); text-transform: uppercase; font-size: 0.8rem; width: 140px;">${k}</td>
      <td style="padding: 8px 12px; color: var(--text-primary); border-bottom: 1px solid var(--border-subtle); font-size: 0.88rem;">${v}</td>
    </tr>
  `).join('');

  const giftsList = product.freeGifts ? product.freeGifts.map(g => `<li>🎁 ${g}</li>`).join('') : '<li>Standard accessory kit</li>';

  content.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; align-items: start;">
      <div>
        <div style="background: var(--bg-tertiary); border-radius: var(--border-radius-md); overflow: hidden; margin-bottom: 16px; border: 1px solid var(--border-subtle);">
          <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 320px; object-fit: cover;">
        </div>
        <div style="display: flex; gap: 8px;">
          <span class="brand-badge">${product.brand}</span>
          <span class="spec-badge badge-vip">${product.badge}</span>
          <span style="margin-left: auto; font-size: 0.8rem; color: #10b981; font-weight: 700;">● Official In Stock</span>
        </div>
      </div>

      <div>
        <h2 style="font-family: var(--font-display); font-size: 1.45rem; font-weight: 800; margin-bottom: 6px;">${product.name}</h2>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">Product Code: ${product.code}</div>

        <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 18px;">
          ${product.originalPrice ? `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 1.1rem;">${formatPrice(product.originalPrice, window.VRS_CURRENT_CURRENCY)}</span>` : ''}
          <span style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 800; color: var(--accent-cyan);">${formatPrice(product.price, window.VRS_CURRENT_CURRENCY)}</span>
          <span style="font-size: 0.9rem; color: var(--text-muted);">${window.VRS_CURRENT_CURRENCY === 'USD' ? `(≈ ${(product.price * EXCHANGE_RATE_KHR).toLocaleString()} ៛)` : `($${product.price} USD)`}</span>
        </div>

        <h4 style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">Technical Specifications:</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: var(--bg-card); border-radius: 8px; overflow: hidden; border: 1px solid var(--border-subtle);">
          <tbody>
            ${specsList}
          </tbody>
        </table>

        <div style="background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 20px;">
          <strong style="color: #10b981; font-size: 0.85rem; display: block; margin-bottom: 6px;">Included Free Gift Package:</strong>
          <ul style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6;">
            ${giftsList}
          </ul>
        </div>

        <div style="display: flex; gap: 12px;">
          <button class="btn-builder-primary" style="flex: 1;" onclick="addToCart('${product.id}'); document.getElementById('quickViewModal').classList.remove('is-open');">
            Add to Cart
          </button>
          <button class="btn-builder-tg" style="flex: 1;" onclick="buyItemViaTelegram('${product.id}')">
            Order via Telegram
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('is-open');
}

document.getElementById('closeQuickViewBtn')?.addEventListener('click', () => {
  document.getElementById('quickViewModal')?.classList.remove('is-open');
});
document.getElementById('quickViewModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'quickViewModal') {
    e.target.classList.remove('is-open');
  }
});

/* --------------------------------------------------------------------------
   PRODUCT COMPARISON TOOL
   -------------------------------------------------------------------------- */
function initComparisonTool() {
  const bar = document.getElementById('compareFloatingBar');
  const closeBtn = document.getElementById('closeCompareBarBtn');
  closeBtn?.addEventListener('click', () => {
    comparisonList = [];
    bar?.classList.remove('is-show');
  });
}

function toggleComparison(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const exists = comparisonList.find(p => p.id === productId);
  if (exists) {
    comparisonList = comparisonList.filter(p => p.id !== productId);
    showToast(`Removed from comparison`, 'info');
  } else {
    if (comparisonList.length >= 3) {
      showToast('You can compare maximum 3 products at a time.', 'warning');
      return;
    }
    comparisonList.push(product);
    showToast(`Added to compare list (${comparisonList.length}/3)`, 'success');
  }

  renderComparisonBar();
}

function renderComparisonBar() {
  const bar = document.getElementById('compareFloatingBar');
  const itemsContainer = document.getElementById('compareItemsSlot');
  if (!bar || !itemsContainer) return;

  if (comparisonList.length === 0) {
    bar.classList.remove('is-show');
    return;
  }

  itemsContainer.innerHTML = comparisonList.map(item => `
    <div style="display: flex; align-items: center; gap: 8px; background: var(--bg-tertiary); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">
      <img src="${item.image}" style="width: 24px; height: 24px; border-radius: 3px; object-fit: cover;">
      <span style="max-width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</span>
      <button onclick="toggleComparison('${item.id}')" style="color: #ef4444; font-weight: bold;">✕</button>
    </div>
  `).join('');

  bar.classList.add('is-show');
}

function openComparisonModal() {
  if (comparisonList.length < 2) {
    showToast('Please select at least 2 products to compare.', 'info');
    return;
  }

  const modal = document.getElementById('compareModal');
  const table = document.getElementById('compareTableContent');
  if (!modal || !table) return;

  const allKeys = ['cpu', 'ram', 'storage', 'display', 'gpu', 'os', 'weight', 'warranty'];

  let headerRow = `<tr><th style="padding: 12px; background: var(--bg-tertiary); text-align: left;">Specifications</th>`;
  comparisonList.forEach(p => {
    headerRow += `
      <th style="padding: 12px; background: var(--bg-card); text-align: center; border-left: 1px solid var(--border-subtle);">
        <img src="${p.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; margin: 0 auto 8px; display: block;">
        <div style="font-size: 0.95rem; font-weight: 700;">${p.name}</div>
        <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-cyan); margin: 6px 0;">${formatPrice(p.price, window.VRS_CURRENT_CURRENCY)}</div>
        <button class="btn-builder-primary" style="font-size: 0.78rem; padding: 6px 14px; margin: 0 auto;" onclick="addToCart('${p.id}')">Add to Cart</button>
      </th>
    `;
  });
  headerRow += `</tr>`;

  let specRows = allKeys.map(k => {
    let row = `<tr><td style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem; background: var(--bg-tertiary);">${k}</td>`;
    comparisonList.forEach(p => {
      const val = p.specs ? (p.specs[k] || 'N/A') : 'N/A';
      row += `<td style="padding: 10px 12px; font-size: 0.85rem; border-left: 1px solid var(--border-subtle);">${val}</td>`;
    });
    row += `</tr>`;
    return row;
  }).join('');

  table.innerHTML = headerRow + specRows;
  modal.classList.add('is-open');
}

document.getElementById('closeCompareModalBtn')?.addEventListener('click', () => {
  document.getElementById('compareModal')?.classList.remove('is-open');
});

/* --------------------------------------------------------------------------
   BACK TO TOP & FLOATING TOOLS
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn?.style.setProperty('display', 'flex');
    } else {
      btn?.style.setProperty('display', 'none');
    }
  });

  btn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   TOAST NOTIFICATION HELPER
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let toast = document.getElementById('vrsToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'vrsToast';
    toast.className = 'vrs-toast';
    document.body.appendChild(toast);
  }

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toast.classList.add('is-show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('is-show');
  }, 3500);
}

window.showToast = showToast;

/* --------------------------------------------------------------------------
   CC COMPUTER PROMO POPUP CONTROLLER
   -------------------------------------------------------------------------- */
function closePopup() {
  const popup = document.getElementById('promoPopup');
  if (popup) {
    popup.classList.remove('is-open');
    sessionStorage.setItem('vrs_promo_dismissed', 'true');
  }
}

function openPopup() {
  const popup = document.getElementById('promoPopup');
  if (popup) {
    popup.classList.add('is-open');
  }
}

window.closePopup = closePopup;
window.openPopup = openPopup;

/* --------------------------------------------------------------------------
   ONE UNIVERSAL QR SCAN CONTROLLER
   Unified single QR system for easy mobile web browsing & Bakong KHQR payments
   -------------------------------------------------------------------------- */
function initOneUniversalQrModal() {
  // 1. Inject ONE QR Trigger into Header if not already present
  const headerActions = document.querySelector('.cc-actions');
  if (headerActions && !document.querySelector('.cc-qr-trigger-btn')) {
    const qrBtn = document.createElement('button');
    qrBtn.type = 'button';
    qrBtn.className = 'cc-qr-trigger-btn';
    qrBtn.setAttribute('title', 'Scan QR Code to View on Phone or Pay');
    qrBtn.setAttribute('aria-label', 'Open QR Code modal');
    qrBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
        <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
        <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
        <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
      </svg>
      <span>ONE QR</span>
    `;
    qrBtn.onclick = () => openOneUniversalQrModal('web');
    // Insert before the hotline phone button
    const ctaPhone = headerActions.querySelector('.cc-cta');
    if (ctaPhone) {
      headerActions.insertBefore(qrBtn, ctaPhone);
    } else {
      headerActions.appendChild(qrBtn);
    }
  }

  // 2. Inject floating QR button into .floating-buttons if present
  const floatingWrap = document.querySelector('.floating-buttons');
  if (floatingWrap && !floatingWrap.querySelector('.floating-button.qr-code')) {
    const floatQr = document.createElement('button');
    floatQr.type = 'button';
    floatQr.className = 'floating-button qr-code';
    floatQr.setAttribute('title', 'Scan QR to View on Phone or Pay');
    floatQr.setAttribute('aria-label', 'Open QR Code modal');
    floatQr.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20">
        <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
        <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
        <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
        <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
      </svg>
    `;
    floatQr.onclick = () => openOneUniversalQrModal('web');
    floatingWrap.insertBefore(floatQr, floatingWrap.firstChild);
  }

  // 3. Inject Modal Container if not already in DOM
  if (!document.getElementById('oneUniversalQrModal')) {
    const settings = typeof getStoreSettings === 'function' ? getStoreSettings() : {};
    const accountName = settings.abaAccountName || 'VISAL SOUN';
    const usdAcc = settings.abaUsdAccount || '013 997 388';
    const khrAcc = settings.abaKhrAccount || '013 997 391';
    const payImg = settings.abaQrImage || 'assets/images/aba-khqr.png';

    const modalDiv = document.createElement('div');
    modalDiv.id = 'oneUniversalQrModal';
    modalDiv.className = 'one-qr-modal-backdrop';
    modalDiv.setAttribute('role', 'dialog');
    modalDiv.setAttribute('aria-modal', 'true');
    modalDiv.onclick = (e) => {
      if (e.target === modalDiv) closeOneUniversalQrModal();
    };

    modalDiv.innerHTML = `
      <div class="one-qr-card">
        <div class="one-qr-header">
          <div class="one-qr-title-box">
            <div class="one-qr-badge">📱 OFFICIAL VRS SCAN CODE</div>
            <h3>Scan to Browse or Pay</h3>
            <p>Scan with your phone camera or any banking app</p>
          </div>
          <button type="button" class="one-qr-close" onclick="closeOneUniversalQrModal()" aria-label="Close">✕</button>
        </div>

        <div class="one-qr-tabs">
          <button type="button" class="one-qr-tab-btn is-active" id="qrTabWebBtn" onclick="switchOneQrTab('web')">
            📱 View Website on Mobile
          </button>
          <button type="button" class="one-qr-tab-btn" id="qrTabPayBtn" onclick="switchOneQrTab('pay')">
            💳 Pay with Bakong KHQR
          </button>
        </div>

        <!-- Tab 1: Web QR -->
        <div class="one-qr-pane is-active" id="oneQrPaneWeb">
          <div class="one-qr-image-frame">
            <img src="assets/images/vrs-website-qr.png" alt="Scan to open VRS Computer Website on Mobile" class="one-qr-main-img">
          </div>
          <div class="one-qr-info-text">
            Point your smartphone camera at this QR code to immediately view all laptops, PC parts, and real-time prices on your mobile device.
          </div>
          <div class="one-qr-url-box">
            <input type="text" id="oneQrWebUrlInput" value="${window.location.origin + window.location.pathname}" readonly>
            <button type="button" class="btn-copy-url" onclick="copyWebsiteUrl()">Copy Link</button>
          </div>
        </div>

        <!-- Tab 2: Bakong KHQR Pay -->
        <div class="one-qr-pane" id="oneQrPanePay">
          <div class="one-qr-image-frame pay-frame">
            <img id="oneQrPayImg" src="${payImg}" alt="VRS Computer ABA KHQR Standee" class="one-qr-pay-img">
          </div>
          <div class="one-qr-bank-details">
            <div class="bank-row"><span>Account Name:</span> <strong id="oneQrAccountName">${accountName}</strong></div>
            <div class="bank-row"><span>USD Account:</span> <strong id="oneQrUsdAcc">${usdAcc}</strong></div>
            <div class="bank-row"><span>KHR Account:</span> <strong id="oneQrKhrAcc">${khrAcc}</strong></div>
          </div>
          <div class="one-qr-badges-row">
            <span class="bank-pill">ABA Bank</span>
            <span class="bank-pill">Bakong KHQR</span>
            <span class="bank-pill">All 30+ Banks Accepted</span>
          </div>
        </div>

        <div class="one-qr-footer">
          <button type="button" class="btn-admin btn-admin-secondary" onclick="closeOneUniversalQrModal()">Close</button>
          <a href="qr.html" target="_blank" class="btn-admin btn-admin-primary">Full Standee Page ↗</a>
        </div>
      </div>
    `;
    document.body.appendChild(modalDiv);
  }
}

function openOneUniversalQrModal(tab = 'web') {
  initOneUniversalQrModal();
  const modal = document.getElementById('oneUniversalQrModal');
  if (modal) {
    switchOneQrTab(tab);
    modal.classList.add('is-open');
  }
}

function closeOneUniversalQrModal() {
  const modal = document.getElementById('oneUniversalQrModal');
  if (modal) modal.classList.remove('is-open');
}

function switchOneQrTab(tab) {
  const webBtn = document.getElementById('qrTabWebBtn');
  const payBtn = document.getElementById('qrTabPayBtn');
  const webPane = document.getElementById('oneQrPaneWeb');
  const payPane = document.getElementById('oneQrPanePay');

  if (tab === 'pay') {
    webBtn?.classList.remove('is-active');
    payBtn?.classList.add('is-active');
    webPane?.classList.remove('is-active');
    payPane?.classList.add('is-active');
  } else {
    webBtn?.classList.add('is-active');
    payBtn?.classList.remove('is-active');
    webPane?.classList.add('is-active');
    payPane?.classList.remove('is-active');
  }
}

function copyWebsiteUrl() {
  const input = document.getElementById('oneQrWebUrlInput');
  if (!input) return;
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value).then(() => {
    if (typeof showToast === 'function') {
      showToast('Website link copied to clipboard!', 'success');
    } else {
      alert('Website link copied to clipboard!');
    }
  }).catch(() => {
    document.execCommand('copy');
    if (typeof showToast === 'function') {
      showToast('Website link copied to clipboard!', 'success');
    }
  });
}

window.openOneUniversalQrModal = openOneUniversalQrModal;
window.closeOneUniversalQrModal = closeOneUniversalQrModal;
window.switchOneQrTab = switchOneQrTab;
window.copyWebsiteUrl = copyWebsiteUrl;

// Auto initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOneUniversalQrModal);
} else {
  initOneUniversalQrModal();
}

/* Universal Desktop Presentation for All Platforms */
(function() {
  function ensureDesktopViewport() {
    let vpMeta = document.querySelector('meta[name="viewport"]');
    if (!vpMeta) {
      vpMeta = document.createElement('meta');
      vpMeta.name = 'viewport';
      document.head.appendChild(vpMeta);
    }
    vpMeta.setAttribute('content', 'width=1260, user-scalable=yes');
  }

  ensureDesktopViewport();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureDesktopViewport);
  }
})();


