/* ==========================================================================
   VRS COMPUTER - STORE ADMINISTRATION & CONTROL PANEL LOGIC
   Full control over products, PC builder parts, contact info & ABA KHQR
   ========================================================================== */

// Global State for Admin
let currentTab = 'dashboard';
let currentBuilderSlot = 'cpu';
let currentPasscode = '';
let activeEditingProductId = null;
let activeEditingPartId = null;

// Temporary holder for uploaded image data URL
let tempProductImageDataUrl = null;
let tempPartImageDataUrl = null;
let tempAbaQrImageDataUrl = null;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initSecurity();
  initSidebar();
  initSettingsForm();
  initPaymentForm();
  initCategoriesTab();
  initProductsTab();
  initBuilderTab();
  initCouponsTab();
  initOrdersTab();
  refreshAllData();
});

/* --------------------------------------------------------------------------
   SECURITY & PASSCODE SCREEN
   -------------------------------------------------------------------------- */
function initSecurity() {
  const isAuthed = sessionStorage.getItem('vrs_admin_session') === 'authorized';
  const screen = document.getElementById('passcodeScreen');
  
  if (isAuthed && screen) {
    screen.style.display = 'none';
  }

  // Numpad clicks
  document.querySelectorAll('.numpad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      handlePasscodeKey(key);
    });
  });

  // Physical keyboard support
  document.addEventListener('keydown', (e) => {
    if (sessionStorage.getItem('vrs_admin_session') === 'authorized') return;
    if (e.key >= '0' && e.key <= '9') {
      handlePasscodeKey(e.key);
    } else if (e.key === 'Backspace') {
      handlePasscodeKey('back');
    } else if (e.key === 'Escape') {
      handlePasscodeKey('clear');
    }
  });

  // Lock button
  document.getElementById('lockAdminBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('vrs_admin_session');
    currentPasscode = '';
    updatePasscodeDots();
    if (screen) screen.style.display = 'flex';
    showAdminToast('Screen locked for security.', 'info');
  });
}

function handlePasscodeKey(key) {
  if (key === 'clear') {
    currentPasscode = '';
  } else if (key === 'back') {
    currentPasscode = currentPasscode.slice(0, -1);
  } else if (currentPasscode.length < 4 && !isNaN(key)) {
    currentPasscode += key;
  }

  updatePasscodeDots();

  if (currentPasscode.length === 4) {
    validatePasscode();
  }
}

function updatePasscodeDots() {
  const dots = document.querySelectorAll('#passcodeDots .passcode-dot');
  dots.forEach((dot, idx) => {
    if (idx < currentPasscode.length) {
      dot.classList.add('is-filled');
    } else {
      dot.classList.remove('is-filled');
    }
  });
}

function validatePasscode() {
  const savedPin = localStorage.getItem(STORAGE_KEYS.PIN) || '8888';
  if (currentPasscode === savedPin) {
    sessionStorage.setItem('vrs_admin_session', 'authorized');
    showAdminToast('Welcome back, Visal Soun! Admin unlocked.', 'success');
    const screen = document.getElementById('passcodeScreen');
    if (screen) {
      screen.style.opacity = '0';
      screen.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        screen.style.display = 'none';
      }, 300);
    }
  } else {
    showAdminToast('Incorrect PIN. Please try again.', 'error');
    const card = document.querySelector('.passcode-card');
    card.style.animation = 'shake 0.3s ease';
    setTimeout(() => {
      card.style.animation = '';
      currentPasscode = '';
      updatePasscodeDots();
    }, 300);
  }
}

function changeAdminPin() {
  const curr = document.getElementById('pinCurrentInput').value.trim();
  const next = document.getElementById('pinNewInput').value.trim();
  const savedPin = localStorage.getItem(STORAGE_KEYS.PIN) || '8888';

  if (curr !== savedPin) {
    showAdminToast('Current PIN does not match!', 'error');
    return;
  }
  if (!next || next.length !== 4 || isNaN(next)) {
    showAdminToast('New PIN must be exactly 4 digits!', 'error');
    return;
  }

  localStorage.setItem(STORAGE_KEYS.PIN, next);
  document.getElementById('pinCurrentInput').value = '';
  document.getElementById('pinNewInput').value = '';
  showAdminToast('Admin PIN successfully updated!', 'success');
}

/* --------------------------------------------------------------------------
   SIDEBAR & TAB SWITCHING
   -------------------------------------------------------------------------- */
function initSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  const backdrop = document.getElementById('adminSidebarBackdrop');
  const mobileToggle = document.getElementById('adminMobileToggle');
  const closeBtn = document.getElementById('adminSidebarCloseBtn');

  function openMobileSidebar() {
    sidebar?.classList.add('is-open');
    backdrop?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    sidebar?.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (sidebar?.classList.contains('is-open')) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
  });

  closeBtn?.addEventListener('click', closeMobileSidebar);
  backdrop?.addEventListener('click', closeMobileSidebar);

  document.querySelectorAll('.admin-sidebar .nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');
      if (tab) switchTab(tab);
      if (window.innerWidth <= 1024) {
        closeMobileSidebar();
      }
    });
  });

  document.getElementById('quickAddProductBtn')?.addEventListener('click', () => {
    switchTab('products');
    openProductModal();
    if (window.innerWidth <= 1024) {
      closeMobileSidebar();
    }
  });
}


function switchTab(tabId) {
  currentTab = tabId;

  // Sidebar link active states
  document.querySelectorAll('.admin-sidebar .nav-item').forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('is-active');
    } else {
      item.classList.remove('is-active');
    }
  });

  // Tab panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('is-active');
  });
  const activePane = document.getElementById(`tab-${tabId}`);
  if (activePane) activePane.classList.add('is-active');

  // Update Topbar Title
  const titles = {
    dashboard: 'Store Overview & Metrics',
    products: 'Products & Inventory Manager',
    categories: 'Store Categories & Navigation Manager',
    builder: 'PC Builder Hardware & Compatibility',
    payment: 'ABA Bank KHQR & Payment Settings',
    orders: 'Customer Orders & Invoices Record',
    coupons: 'Promotional Coupons & Vouchers',
    settings: 'Store Contact & General Info',
    backup: 'Backup, Export & Data Sync'
  };
  const titleEl = document.getElementById('pageTitleText');
  if (titleEl) titleEl.textContent = titles[tabId] || 'Store Administration';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --------------------------------------------------------------------------
   DATA REFRESH & STATS
   -------------------------------------------------------------------------- */
function refreshAllData() {
  // Update live products, categories, and parts from storage
  PRODUCTS_DATA = loadProductsData();
  CATEGORIES_DATA = typeof loadCategoriesData === 'function' ? loadCategoriesData() : [];
  BUILDER_COMPONENTS = loadBuilderComponents();
  VRS_SETTINGS = getStoreSettings();

  updateDashboardStats();
  renderAdminCategories();
  populateCategoryDropdowns();
  renderAdminProductsTable();
  renderAdminBuilderTable();
  renderAdminOrdersTable();
  renderAdminCouponsTable();
}

function updateDashboardStats() {
  const totalProducts = PRODUCTS_DATA.length;
  const inStock = PRODUCTS_DATA.filter(p => p.inStock).length;
  const outOfStock = totalProducts - inStock;

  let builderPartsCount = 0;
  Object.values(BUILDER_COMPONENTS).forEach(partsArr => {
    if (Array.isArray(partsArr)) builderPartsCount += partsArr.length;
  });

  const ordersRaw = localStorage.getItem('vrs_store_orders');
  const orders = ordersRaw ? JSON.parse(ordersRaw) : [];

  // Update DOM elements
  document.getElementById('statTotalProducts').textContent = totalProducts;
  document.getElementById('statInStockCount').textContent = inStock;
  document.getElementById('statOutOfStockCount').textContent = outOfStock;
  document.getElementById('statBuilderParts').textContent = builderPartsCount;
  document.getElementById('statTotalOrders').textContent = orders.length;
  document.getElementById('statExchangeRate').textContent = `${(VRS_SETTINGS.exchangeRateKHR || 4100).toLocaleString()} ៛`;

  // Sidebar badges
  const sideProd = document.getElementById('sidebarProductCount');
  if (sideProd) sideProd.textContent = totalProducts;

  const sideCat = document.getElementById('sidebarCategoryCount');
  if (sideCat) sideCat.textContent = (typeof loadCategoriesData === 'function' ? loadCategoriesData().length : 0);

  const sideBuild = document.getElementById('sidebarBuilderCount');
  if (sideBuild) sideBuild.textContent = builderPartsCount;

  const sideOrders = document.getElementById('sidebarOrderCount');
  if (sideOrders) sideOrders.textContent = orders.length;

  // Render quick preview of 5 orders on dashboard
  const dashOrdersTbody = document.getElementById('dashboardOrdersTableBody');
  if (dashOrdersTbody) {
    if (orders.length === 0) {
      dashOrdersTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--admin-text-dim);">No customer orders logged yet. Orders verified via KHQR checkout will appear here.</td></tr>`;
    } else {
      dashOrdersTbody.innerHTML = orders.slice(0, 5).map(ord => {
        const dateStr = ord.timestamp ? new Date(ord.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
        const itemCount = ord.items ? ord.items.reduce((s, i) => s + (i.qty || 1), 0) : 1;
        const totalKHR = (ord.grandTotal * (VRS_SETTINGS.exchangeRateKHR || 4100)).toLocaleString();
        return `
          <tr>
            <td><strong style="color: var(--admin-cyan); font-family: monospace;">${ord.id}</strong></td>
            <td style="color: var(--admin-text-muted); font-size: 0.8rem;">${dateStr}</td>
            <td><strong>${itemCount} Items</strong> <span style="font-size: 0.76rem; color: var(--admin-text-dim);">(${ord.items ? ord.items.map(i => i.name).slice(0, 2).join(', ') : 'Parts'}...)</span></td>
            <td><strong style="color: #fff;">$${ord.grandTotal?.toLocaleString()} USD</strong></td>
            <td style="color: var(--admin-cyan); font-size: 0.82rem;">${totalKHR} ៛</td>
            <td><span style="font-size: 0.76rem; color: var(--admin-emerald);">${ord.paymentMethod || 'ABA KHQR'}</span></td>
            <td><span class="badge-pill badge-in-stock">VERIFIED</span></td>
          </tr>
        `;
      }).join('');
    }
  }
}

/* --------------------------------------------------------------------------
   STORE CATEGORIES & NAVIGATION MANAGER
   Allows editing, deleting, reordering and creating categories
   -------------------------------------------------------------------------- */
let activeEditingCategoryId = null;

function initCategoriesTab() {
  document.getElementById('adminCategorySearch')?.addEventListener('input', renderAdminCategories);
  document.getElementById('adminCategoryStatusFilter')?.addEventListener('change', renderAdminCategories);
}

function renderAdminCategories() {
  const tbody = document.getElementById('adminCategoriesTableBody');
  if (!tbody) return;

  CATEGORIES_DATA = typeof loadCategoriesData === 'function' ? loadCategoriesData() : [];
  const search = (document.getElementById('adminCategorySearch')?.value || '').toLowerCase().trim();
  const status = document.getElementById('adminCategoryStatusFilter')?.value || 'all';

  let filtered = [...CATEGORIES_DATA];

  if (status === 'active') {
    filtered = filtered.filter(c => c.active !== false);
  } else if (status === 'hidden') {
    filtered = filtered.filter(c => c.active === false);
  }

  if (search) {
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(search) ||
      (c.nameKh && c.nameKh.toLowerCase().includes(search)) ||
      c.slug.toLowerCase().includes(search)
    );
  }

  // Update sidebar badge
  const badge = document.getElementById('sidebarCategoryCount');
  if (badge) badge.textContent = CATEGORIES_DATA.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 36px; color: var(--admin-text-muted);">No categories match your search or filter. Click <strong>➕ Add New Category</strong> above to create one.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((cat, idx) => {
    // Live product count
    const assignedCount = PRODUCTS_DATA.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const cSlug = cat.slug.toLowerCase();
      if (pCat === cSlug) return true;
      if (cSlug === 'pcpart' && pCat === 'component') return true;
      if (cSlug === 'peripherals' && (pCat === 'peripheral' || pCat === 'monitor')) return true;
      return false;
    }).length;

    const statusBadge = cat.active !== false
      ? `<span class="badge-pill badge-in-stock" style="cursor:pointer;" title="Click to hide from navbar" onclick="toggleCategoryActive('${cat.id}')">✓ Shown on Navbar</span>`
      : `<span class="badge-pill badge-out-of-stock" style="cursor:pointer;" title="Click to show on navbar" onclick="toggleCategoryActive('${cat.id}')">✕ Hidden</span>`;

    return `
      <tr>
        <td style="font-weight: 800; color: var(--admin-cyan);">
          <div style="display: flex; align-items: center; gap: 4px;">
            <span>#${cat.order || (idx + 1)}</span>
            <div style="display: flex; flex-direction: column; gap: 2px; margin-left: 6px;">
              <button type="button" class="btn-icon" style="width: 20px; height: 18px; font-size: 0.65rem;" title="Move Up in Storefront Navbar" onclick="moveCategoryOrder('${cat.id}', -1)">▲</button>
              <button type="button" class="btn-icon" style="width: 20px; height: 18px; font-size: 0.65rem;" title="Move Down in Storefront Navbar" onclick="moveCategoryOrder('${cat.id}', 1)">▼</button>
            </div>
          </div>
        </td>
        <td style="text-align: center; font-size: 1.35rem;">
          ${cat.icon || '📦'}
        </td>
        <td>
          <strong style="color: #fff; font-size: 0.95rem; text-transform: uppercase;">${cat.name}</strong>
          ${cat.desc ? `<div style="font-size: 0.74rem; color: var(--admin-text-dim); margin-top: 2px;">${cat.desc}</div>` : ''}
        </td>
        <td>
          <span style="font-size: 0.86rem; color: var(--admin-text-muted); font-family: var(--font-khmer, inherit);">${cat.nameKh || '—'}</span>
        </td>
        <td>
          <code style="background: rgba(0,242,254,0.08); color: var(--admin-cyan); padding: 3px 8px; border-radius: 4px; font-size: 0.78rem; font-family: monospace;">${cat.slug}</code>
        </td>
        <td style="text-align: center;">
          <span class="badge-pill" style="background: var(--admin-bg-elevated); color: #fff; border: 1px solid var(--admin-border-subtle);">${assignedCount} products</span>
        </td>
        <td>
          ${statusBadge}
        </td>
        <td>
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-icon" title="Edit Category" onclick="openCategoryModal('${cat.id}')">✏️</button>
            <button class="btn-icon btn-icon-danger" title="Delete Category" onclick="deleteCategory('${cat.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openCategoryModal(categoryId = null) {
  activeEditingCategoryId = categoryId;
  const modal = document.getElementById('categoryModal');
  const title = document.getElementById('categoryModalTitle');
  if (!modal) return;

  if (categoryId) {
    const cat = CATEGORIES_DATA.find(c => c.id === categoryId);
    if (!cat) return;
    title.textContent = `Edit Category: ${cat.name}`;
    document.getElementById('catEditId').value = cat.id;
    document.getElementById('catName').value = cat.name;
    document.getElementById('catNameKh').value = cat.nameKh || '';
    document.getElementById('catSlug').value = cat.slug;
    document.getElementById('catIcon').value = cat.icon || '💻';
    document.getElementById('catOrder').value = cat.order || 1;
    document.getElementById('catActive').checked = cat.active !== false;
    document.getElementById('catDesc').value = cat.desc || '';
  } else {
    title.textContent = 'Add New Category to Storefront';
    document.getElementById('categoryForm')?.reset();
    document.getElementById('catEditId').value = '';
    document.getElementById('catOrder').value = CATEGORIES_DATA.length + 1;
    document.getElementById('catActive').checked = true;
    document.getElementById('catIcon').value = '💻';
  }

  modal.classList.add('is-open');
}

function closeCategoryModal() {
  document.getElementById('categoryModal')?.classList.remove('is-open');
  activeEditingCategoryId = null;
}

function autoGenerateCategorySlug() {
  const editId = document.getElementById('catEditId')?.value;
  if (editId) return; // Don't overwrite existing slug on edit unless user explicitly types it
  const name = document.getElementById('catName')?.value || '';
  const slugInput = document.getElementById('catSlug');
  if (slugInput) {
    slugInput.value = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }
}

function saveCategoryFromModal() {
  const name = document.getElementById('catName')?.value.trim();
  const nameKh = document.getElementById('catNameKh')?.value.trim();
  let slug = (document.getElementById('catSlug')?.value || '').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');
  const icon = document.getElementById('catIcon')?.value.trim() || '💻';
  const order = parseInt(document.getElementById('catOrder')?.value, 10) || 1;
  const active = document.getElementById('catActive')?.checked ?? true;
  const desc = document.getElementById('catDesc')?.value.trim();
  const editId = document.getElementById('catEditId')?.value;

  if (!name) {
    showAdminToast('Please provide a category name!', 'error');
    return;
  }

  if (!slug) {
    slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }

  // Check unique slug
  const duplicate = CATEGORIES_DATA.find(c => c.slug.toLowerCase() === slug && c.id !== editId);
  if (duplicate) {
    showAdminToast(`A category with slug "${slug}" already exists! Please use a unique slug.`, 'error');
    return;
  }

  if (editId) {
    const idx = CATEGORIES_DATA.findIndex(c => c.id === editId);
    if (idx !== -1) {
      CATEGORIES_DATA[idx] = {
        ...CATEGORIES_DATA[idx],
        name,
        nameKh,
        slug,
        icon,
        order,
        active,
        desc
      };
      showAdminToast(`Category "${name}" updated successfully!`, 'success');
    }
  } else {
    const newCat = {
      id: 'cat-' + Date.now().toString(36),
      slug,
      name,
      nameKh,
      icon,
      order,
      active,
      desc
    };
    CATEGORIES_DATA.push(newCat);
    showAdminToast(`New category "${name}" added to store!`, 'success');
  }

  // Re-sort by order
  CATEGORIES_DATA.sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));

  saveCategoriesData(CATEGORIES_DATA);
  closeCategoryModal();
  renderAdminCategories();
  populateCategoryDropdowns();
  updateDashboardStats();
}

function deleteCategory(categoryId) {
  const cat = CATEGORIES_DATA.find(c => c.id === categoryId);
  if (!cat) return;

  const assignedCount = PRODUCTS_DATA.filter(p => {
    const pCat = (p.category || '').toLowerCase();
    const cSlug = cat.slug.toLowerCase();
    return pCat === cSlug || (cSlug === 'pcpart' && pCat === 'component') || (cSlug === 'peripherals' && (pCat === 'peripheral' || pCat === 'monitor'));
  }).length;

  let confirmMsg = `Are you sure you want to permanently delete category "${cat.name}"?`;
  if (assignedCount > 0) {
    confirmMsg += `\n\n⚠️ ${assignedCount} products are currently assigned to this category. They will remain in your database, but this category will be removed from your customer storefront navigation bar.`;
  }

  if (!confirm(confirmMsg)) {
    return;
  }

  CATEGORIES_DATA = CATEGORIES_DATA.filter(c => c.id !== categoryId);
  saveCategoriesData(CATEGORIES_DATA);
  renderAdminCategories();
  populateCategoryDropdowns();
  updateDashboardStats();
  showAdminToast(`Category "${cat.name}" deleted successfully.`, 'info');
}

function toggleCategoryActive(categoryId) {
  const cat = CATEGORIES_DATA.find(c => c.id === categoryId);
  if (!cat) return;
  cat.active = (cat.active === false);
  saveCategoriesData(CATEGORIES_DATA);
  renderAdminCategories();
  showAdminToast(`Category "${cat.name}" is now ${cat.active ? 'visible on navbar' : 'hidden from navbar'}.`, 'info');
}

function moveCategoryOrder(categoryId, direction) {
  const idx = CATEGORIES_DATA.findIndex(c => c.id === categoryId);
  if (idx === -1) return;

  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= CATEGORIES_DATA.length) return;

  // Swap order values
  const currentOrder = CATEGORIES_DATA[idx].order || (idx + 1);
  const targetOrder = CATEGORIES_DATA[targetIdx].order || (targetIdx + 1);

  CATEGORIES_DATA[idx].order = targetOrder;
  CATEGORIES_DATA[targetIdx].order = currentOrder;

  // Swap in array
  const temp = CATEGORIES_DATA[idx];
  CATEGORIES_DATA[idx] = CATEGORIES_DATA[targetIdx];
  CATEGORIES_DATA[targetIdx] = temp;

  CATEGORIES_DATA.sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
  saveCategoriesData(CATEGORIES_DATA);
  renderAdminCategories();
  showAdminToast('Category order updated!', 'info');
}

function resetCategoriesToDefault() {
  if (!confirm('Reset all categories back to the official 10 default store categories (LAPTOP, DESKTOP, PC Part, Second Hand, etc.)?')) {
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  CATEGORIES_DATA = loadCategoriesData();
  saveCategoriesData(CATEGORIES_DATA);
  renderAdminCategories();
  populateCategoryDropdowns();
  updateDashboardStats();
  showAdminToast('Categories restored to official store defaults!', 'success');
}

function populateCategoryDropdowns() {
  const prodCatSelect = document.getElementById('prodCategory');
  const filterCatSelect = document.getElementById('adminCategoryFilter');

  if (prodCatSelect && Array.isArray(CATEGORIES_DATA)) {
    const currentVal = prodCatSelect.value;
    prodCatSelect.innerHTML = CATEGORIES_DATA.map(c => `
      <option value="${c.slug}">${c.name} ${c.icon ? '(' + c.icon + ')' : ''}</option>
    `).join('');
    if (currentVal && CATEGORIES_DATA.some(c => c.slug === currentVal)) {
      prodCatSelect.value = currentVal;
    }
  }

  if (filterCatSelect && Array.isArray(CATEGORIES_DATA)) {
    const currentFilter = filterCatSelect.value;
    filterCatSelect.innerHTML = `
      <option value="all">All Categories</option>
      ${CATEGORIES_DATA.map(c => `<option value="${c.slug}">${c.name} (${c.icon || '💻'})</option>`).join('')}
    `;
    if (currentFilter && (currentFilter === 'all' || CATEGORIES_DATA.some(c => c.slug === currentFilter))) {
      filterCatSelect.value = currentFilter;
    }
  }
}

/* --------------------------------------------------------------------------
   PRODUCTS CATALOG MANAGER
   -------------------------------------------------------------------------- */
function initProductsTab() {
  document.getElementById('adminProductSearch')?.addEventListener('input', renderAdminProductsTable);
  document.getElementById('adminCategoryFilter')?.addEventListener('change', renderAdminProductsTable);
  document.getElementById('adminStockFilter')?.addEventListener('change', renderAdminProductsTable);
}

function renderAdminProductsTable() {
  const tbody = document.getElementById('adminProductsTableBody');
  if (!tbody) return;

  const search = (document.getElementById('adminProductSearch')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('adminCategoryFilter')?.value || 'all';
  const stock = document.getElementById('adminStockFilter')?.value || 'all';

  let filtered = [...PRODUCTS_DATA];

  if (cat !== 'all') {
    filtered = filtered.filter(p => p.category === cat || p.subCategory === cat);
  }
  if (stock === 'inStock') {
    filtered = filtered.filter(p => p.inStock);
  } else if (stock === 'outOfStock') {
    filtered = filtered.filter(p => !p.inStock);
  }
  if (search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search) ||
      (p.code && p.code.toLowerCase().includes(search)) ||
      (p.brand && p.brand.toLowerCase().includes(search))
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 36px; color: var(--admin-text-muted);">No products match your search or filter.</td></tr>`;
    return;
  }

  const rate = VRS_SETTINGS.exchangeRateKHR || 4100;

  tbody.innerHTML = filtered.map(p => {
    const khrPrice = (p.price * rate).toLocaleString();
    const stockPill = p.inStock 
      ? `<span class="badge-pill badge-in-stock" style="cursor:pointer;" onclick="toggleProductStock('${p.id}')">✓ In Stock</span>`
      : `<span class="badge-pill badge-out-of-stock" style="cursor:pointer;" onclick="toggleProductStock('${p.id}')">✕ Out of Stock</span>`;
    
    return `
      <tr>
        <td>
          <img src="${p.image}" class="product-cell-thumb" alt="${p.name}" onerror="this.src='assets/images/hero-gaming.jpg'">
        </td>
        <td>
          <strong style="color: #fff; font-size: 0.9rem;">${p.name}</strong>
          <div style="font-size: 0.74rem; color: var(--admin-text-dim); font-family: monospace;">SKU: ${p.code || 'N/A'} ${p.featured ? '• ⭐ Featured' : ''}</div>
        </td>
        <td><span style="font-size: 0.8rem; text-transform: capitalize; color: var(--admin-text-muted);">${p.category}</span></td>
        <td><span style="font-size: 0.82rem; font-weight: 700; color: var(--admin-cyan);">${p.brand}</span></td>
        <td><strong style="color: #fff;">$${p.price.toLocaleString()}</strong></td>
        <td><span style="color: var(--admin-text-muted); font-size: 0.8rem;">${khrPrice} ៛</span></td>
        <td>${stockPill}</td>
        <td>
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-icon" title="Edit Product" onclick="openProductModal('${p.id}')">✏️</button>
            <button class="btn-icon btn-icon-danger" title="Delete Product" onclick="deleteProduct('${p.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function toggleProductStock(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;
  product.inStock = !product.inStock;
  saveProductsToStorage();
  renderAdminProductsTable();
  updateDashboardStats();
  showAdminToast(`Stock for "${product.name}" updated to ${product.inStock ? 'In Stock' : 'Out of Stock'}.`, 'info');
}

function deleteProduct(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;
  if (!confirm(`Are you sure you want to permanently delete "${product.name}" from the store catalog?`)) {
    return;
  }
  PRODUCTS_DATA = PRODUCTS_DATA.filter(p => p.id !== productId);
  saveProductsToStorage();
  renderAdminProductsTable();
  updateDashboardStats();
  showAdminToast(`"${product.name}" deleted from catalog.`, 'info');
}

function saveProductsToStorage() {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(PRODUCTS_DATA));
}

/* --------------------------------------------------------------------------
   PRODUCT MODAL (ADD / EDIT)
   -------------------------------------------------------------------------- */
function openProductModal(productId = null) {
  activeEditingProductId = productId;
  tempProductImageDataUrl = null;

  const modal = document.getElementById('productModal');
  const title = document.getElementById('productModalTitle');
  const previewWrap = document.getElementById('prodImagePreviewWrap');
  const previewImg = document.getElementById('prodImagePreviewImg');
  const specsContainer = document.getElementById('specsContainer');
  specsContainer.innerHTML = '';

  if (productId) {
    const p = PRODUCTS_DATA.find(item => item.id === productId);
    if (!p) return;
    title.textContent = `Edit Product: ${p.name}`;
    document.getElementById('prodEditId').value = p.id;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodBrand').value = p.brand;
    document.getElementById('prodCategory').value = p.category || 'laptop';
    document.getElementById('prodSubCategory').value = p.subCategory || '';
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodOriginalPrice').value = p.originalPrice || '';
    document.getElementById('prodCode').value = p.code || '';
    document.getElementById('prodBadge').value = p.badge || '';
    document.getElementById('prodInStock').value = p.inStock ? 'true' : 'false';
    document.getElementById('prodFeatured').checked = !!p.featured;
    document.getElementById('prodImageUrl').value = p.image || '';
    document.getElementById('prodFreeGifts').value = (p.freeGifts || []).join('\n');

    // Populate specs
    if (p.specs && typeof p.specs === 'object') {
      Object.entries(p.specs).forEach(([k, v]) => {
        addSpecRow(k, v);
      });
    }

    if (p.image) {
      previewWrap.style.display = 'flex';
      previewImg.src = p.image;
    } else {
      previewWrap.style.display = 'none';
    }
  } else {
    title.textContent = 'Add New Product to Store Catalog';
    document.getElementById('productForm').reset();
    document.getElementById('prodEditId').value = '';
    document.getElementById('prodCode').value = 'VRS-' + Math.floor(1000 + Math.random() * 9000);
    previewWrap.style.display = 'none';

    // Add common default specs
    addSpecRow('cpu', '');
    addSpecRow('ram', '');
    addSpecRow('storage', '');
    addSpecRow('gpu', '');
    addSpecRow('warranty', '2 Years Official Warranty');
  }

  modal.classList.add('is-open');
}

function closeProductModal() {
  document.getElementById('productModal')?.classList.remove('is-open');
}

function addSpecRow(key = '', val = '') {
  const container = document.getElementById('specsContainer');
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.gap = '8px';
  row.innerHTML = `
    <input type="text" class="form-input spec-key" placeholder="Key (e.g. cpu, ram, display)" value="${key}" style="width: 130px; text-transform: lowercase;">
    <input type="text" class="form-input spec-val" placeholder="Specification details..." value="${val}" style="flex: 1;">
    <button type="button" class="btn-icon btn-icon-danger" onclick="this.parentElement.remove()" title="Remove line">✕</button>
  `;
  container.appendChild(row);
}

function handleProductImageFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    tempProductImageDataUrl = event.target.result;
    const previewWrap = document.getElementById('prodImagePreviewWrap');
    const previewImg = document.getElementById('prodImagePreviewImg');
    previewWrap.style.display = 'flex';
    previewImg.src = tempProductImageDataUrl;
    document.getElementById('prodImageUrl').value = '';
    showAdminToast('Product image uploaded successfully!', 'success');
  };
  reader.readAsDataURL(file);
}

function saveProductFromModal() {
  const name = document.getElementById('prodName').value.trim();
  const brand = document.getElementById('prodBrand').value.trim();
  const category = document.getElementById('prodCategory').value;
  const subCategory = document.getElementById('prodSubCategory').value.trim() || category;
  const price = parseFloat(document.getElementById('prodPrice').value);
  const originalPrice = parseFloat(document.getElementById('prodOriginalPrice').value) || (price + 150);
  const code = document.getElementById('prodCode').value.trim() || 'VRS-' + Date.now().toString(36).toUpperCase();
  const badge = document.getElementById('prodBadge').value.trim() || 'NEW ARRIVAL';
  const inStock = document.getElementById('prodInStock').value === 'true';
  const featured = document.getElementById('prodFeatured').checked;
  const imageUrlInput = document.getElementById('prodImageUrl').value.trim();

  if (!name || isNaN(price) || price <= 0) {
    showAdminToast('Please provide a valid product name and price!', 'error');
    return;
  }

  // Image source: uploaded data URL > direct link > fallback placeholder
  const image = tempProductImageDataUrl || imageUrlInput || 'assets/images/hero-gaming.jpg';

  // Build specs object
  const specs = {};
  document.querySelectorAll('#specsContainer > div').forEach(row => {
    const k = row.querySelector('.spec-key')?.value.trim();
    const v = row.querySelector('.spec-val')?.value.trim();
    if (k && v) specs[k] = v;
  });

  // Free gifts
  const giftsRaw = document.getElementById('prodFreeGifts').value;
  const freeGifts = giftsRaw.split('\n').map(s => s.trim()).filter(Boolean);

  if (activeEditingProductId) {
    // Edit existing
    const idx = PRODUCTS_DATA.findIndex(p => p.id === activeEditingProductId);
    if (idx !== -1) {
      PRODUCTS_DATA[idx] = {
        ...PRODUCTS_DATA[idx],
        name,
        brand,
        category,
        subCategory,
        price,
        originalPrice,
        code,
        badge,
        inStock,
        featured,
        image,
        specs,
        freeGifts
      };
      showAdminToast(`Product "${name}" updated successfully!`, 'success');
    }
  } else {
    // Add new product
    const newId = 'custom-' + Date.now().toString(36);
    const newProd = {
      id: newId,
      name,
      brand,
      category,
      subCategory,
      price,
      originalPrice,
      code,
      condition: "Brand New",
      badge,
      rating: 5.0,
      reviewsCount: 1,
      inStock,
      featured,
      image,
      specs,
      freeGifts
    };
    PRODUCTS_DATA.unshift(newProd);
    showAdminToast(`"${name}" added to store catalog!`, 'success');
  }

  saveProductsToStorage();
  closeProductModal();
  renderAdminProductsTable();
  updateDashboardStats();
}

/* --------------------------------------------------------------------------
   PC BUILDER PARTS MANAGER
   -------------------------------------------------------------------------- */
function initBuilderTab() {
  switchBuilderSlot('cpu');
}

function switchBuilderSlot(slot) {
  currentBuilderSlot = slot;
  document.querySelectorAll('#builderSlotFilterRow .btn-admin').forEach(btn => {
    if (btn.getAttribute('data-slot') === slot) {
      btn.className = 'btn-admin btn-admin-primary';
    } else {
      btn.className = 'btn-admin btn-admin-secondary';
    }
  });
  renderAdminBuilderTable();
}

function renderAdminBuilderTable() {
  const tbody = document.getElementById('adminBuilderTableBody');
  if (!tbody) return;

  const parts = BUILDER_COMPONENTS[currentBuilderSlot] || [];
  const rate = VRS_SETTINGS.exchangeRateKHR || 4100;

  if (parts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 36px; color: var(--admin-text-muted);">No components configured in this slot yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = parts.map(part => {
    const khrPrice = (part.price * rate).toLocaleString();
    const specsSummary = [
      part.socket ? `Socket: ${part.socket}` : '',
      part.wattage ? `${part.wattage}W` : '',
      part.tdp ? `${part.tdp}W TDP` : '',
      part.ramType ? part.ramType : '',
      part.formFactor ? part.formFactor : ''
    ].filter(Boolean).join(' • ') || part.description || 'Standard';

    return `
      <tr>
        <td>
          <img src="${part.image || 'assets/images/hero-custom-pc.jpg'}" class="product-cell-thumb" alt="${part.name}" onerror="this.src='assets/images/hero-custom-pc.jpg'">
        </td>
        <td>
          <strong style="color: #fff; font-size: 0.9rem;">${part.name}</strong>
          <div style="font-size: 0.74rem; color: var(--admin-text-dim);">${part.description || ''}</div>
        </td>
        <td><strong style="color: var(--admin-cyan);">${part.brand}</strong></td>
        <td><span style="font-size: 0.8rem; color: var(--admin-text-muted);">${specsSummary}</span></td>
        <td><strong style="color: #fff;">$${part.price.toLocaleString()}</strong></td>
        <td><span style="color: var(--admin-text-muted); font-size: 0.8rem;">${khrPrice} ៛</span></td>
        <td>
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-icon" title="Edit Component" onclick="openBuilderPartModal('${part.id}')">✏️</button>
            <button class="btn-icon btn-icon-danger" title="Delete Component" onclick="deleteBuilderPart('${part.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openBuilderPartModal(partId = null) {
  activeEditingPartId = partId;
  tempPartImageDataUrl = null;

  const modal = document.getElementById('builderPartModal');
  const title = document.getElementById('builderPartModalTitle');

  if (partId) {
    let foundPart = null;
    let foundSlot = currentBuilderSlot;

    for (const [slot, arr] of Object.entries(BUILDER_COMPONENTS)) {
      const match = arr.find(p => p.id === partId);
      if (match) {
        foundPart = match;
        foundSlot = slot;
        break;
      }
    }

    if (!foundPart) return;
    title.textContent = `Edit Component: ${foundPart.name}`;
    document.getElementById('partEditId').value = foundPart.id;
    document.getElementById('partSlotSelect').value = foundSlot;
    document.getElementById('partName').value = foundPart.name;
    document.getElementById('partBrand').value = foundPart.brand;
    document.getElementById('partPrice').value = foundPart.price;
    document.getElementById('partSocket').value = foundPart.socket || '';
    document.getElementById('partTdp').value = foundPart.tdp || foundPart.wattage || '';
    document.getElementById('partImageUrl').value = foundPart.image || '';
    document.getElementById('partDesc').value = foundPart.description || '';
  } else {
    title.textContent = 'Add Component to PC Builder';
    document.getElementById('builderPartForm').reset();
    document.getElementById('partEditId').value = '';
    document.getElementById('partSlotSelect').value = currentBuilderSlot;
  }

  modal.classList.add('is-open');
}

function closeBuilderPartModal() {
  document.getElementById('builderPartModal')?.classList.remove('is-open');
}

function handlePartImageFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    tempPartImageDataUrl = event.target.result;
    document.getElementById('partImageUrl').value = '';
    showAdminToast('Component image uploaded!', 'success');
  };
  reader.readAsDataURL(file);
}

function saveBuilderPartFromModal() {
  const slot = document.getElementById('partSlotSelect').value;
  const name = document.getElementById('partName').value.trim();
  const brand = document.getElementById('partBrand').value.trim();
  const price = parseFloat(document.getElementById('partPrice').value);
  const socket = document.getElementById('partSocket').value.trim();
  const tdp = parseInt(document.getElementById('partTdp').value) || 0;
  const desc = document.getElementById('partDesc').value.trim();
  const imageUrlInput = document.getElementById('partImageUrl').value.trim();

  if (!name || isNaN(price) || price <= 0) {
    showAdminToast('Please provide a component name and valid price!', 'error');
    return;
  }

  const image = tempPartImageDataUrl || imageUrlInput || 'assets/images/hero-custom-pc.jpg';

  if (!BUILDER_COMPONENTS[slot]) {
    BUILDER_COMPONENTS[slot] = [];
  }

  if (activeEditingPartId) {
    // Look up and update
    for (const [s, arr] of Object.entries(BUILDER_COMPONENTS)) {
      const idx = arr.findIndex(p => p.id === activeEditingPartId);
      if (idx !== -1) {
        arr.splice(idx, 1);
        break;
      }
    }
  }

  const newPart = {
    id: activeEditingPartId || ('b-cust-' + Date.now().toString(36)),
    name,
    brand,
    price,
    socket: socket || undefined,
    tdp: tdp || undefined,
    wattage: slot === 'psu' ? tdp : undefined,
    image,
    description: desc || undefined
  };

  BUILDER_COMPONENTS[slot].unshift(newPart);
  saveBuilderPartsToStorage();
  closeBuilderPartModal();
  switchBuilderSlot(slot);
  updateDashboardStats();
  showAdminToast(`Component "${name}" saved to PC Builder!`, 'success');
}

function deleteBuilderPart(partId) {
  if (!confirm('Are you sure you want to remove this component from the PC Builder?')) return;
  for (const [slot, arr] of Object.entries(BUILDER_COMPONENTS)) {
    const idx = arr.findIndex(p => p.id === partId);
    if (idx !== -1) {
      arr.splice(idx, 1);
      break;
    }
  }
  saveBuilderPartsToStorage();
  renderAdminBuilderTable();
  updateDashboardStats();
  showAdminToast('Component removed from PC Builder.', 'info');
}

function saveBuilderPartsToStorage() {
  localStorage.setItem(STORAGE_KEYS.BUILDER_PARTS, JSON.stringify(BUILDER_COMPONENTS));
}

/* --------------------------------------------------------------------------
   ABA BANK KHQR & PAYMENT SETTINGS
   -------------------------------------------------------------------------- */
function initPaymentForm() {
  const s = VRS_SETTINGS;
  document.getElementById('settingAbaAccountName').value = s.abaAccountName || 'VISAL SOUN';
  document.getElementById('settingAbaUsdAccount').value = s.abaUsdAccount || '013 997 388';
  document.getElementById('settingAbaKhrAccount').value = s.abaKhrAccount || '013 997 391';

  // Live input sync to preview card
  ['AbaAccountName', 'AbaUsdAccount', 'AbaKhrAccount'].forEach(f => {
    document.getElementById(`setting${f}`)?.addEventListener('input', updatePaymentPreview);
  });

  // QR file upload
  document.getElementById('abaQrFileInput')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      tempAbaQrImageDataUrl = event.target.result;
      document.getElementById('previewAbaQrImg').src = tempAbaQrImageDataUrl;
      showAdminToast('New ABA QR Code image loaded into preview! Click Save to activate.', 'success');
    };
    reader.readAsDataURL(file);
  });

  updatePaymentPreview();
}

function updatePaymentPreview() {
  const name = document.getElementById('settingAbaAccountName').value || 'VISAL SOUN';
  const usd = document.getElementById('settingAbaUsdAccount').value || '013 997 388';
  const khr = document.getElementById('settingAbaKhrAccount').value || '013 997 391';

  document.getElementById('previewAbaName').textContent = name;
  document.getElementById('previewAbaUsd').textContent = usd;
  document.getElementById('previewAbaKhr').textContent = khr;
}

function restoreDefaultAbaQr() {
  tempAbaQrImageDataUrl = 'assets/images/aba-khqr.png';
  document.getElementById('previewAbaQrImg').src = tempAbaQrImageDataUrl;
  showAdminToast('Reset to default uploaded ABA QR image. Click Save to apply.', 'info');
}

function savePaymentSettings() {
  const s = getStoreSettings();
  s.abaAccountName = document.getElementById('settingAbaAccountName').value.trim() || 'VISAL SOUN';
  s.abaUsdAccount = document.getElementById('settingAbaUsdAccount').value.trim() || '013 997 388';
  s.abaKhrAccount = document.getElementById('settingAbaKhrAccount').value.trim() || '013 997 391';

  if (tempAbaQrImageDataUrl) {
    s.abaQrImage = tempAbaQrImageDataUrl;
  }

  saveStoreSettings(s);
  VRS_SETTINGS = s;
  showAdminToast('ABA Bank KHQR payment credentials successfully updated!', 'success');
}

/* --------------------------------------------------------------------------
   STORE & CONTACT SETTINGS
   -------------------------------------------------------------------------- */
function initSettingsForm() {
  const s = VRS_SETTINGS;
  document.getElementById('settingStoreName').value = s.storeName || 'VRS COMPUTER';
  document.getElementById('settingTagline').value = s.tagline || '';
  document.getElementById('settingHotline').value = s.hotline || '+855 98 871 314';
  document.getElementById('settingTelegramHandle').value = s.telegramHandle || 'Sounvisal';
  document.getElementById('settingWhatsappNumber').value = s.whatsappNumber || '85598871314';
  document.getElementById('settingExchangeRate').value = s.exchangeRateKHR || 4100;
  document.getElementById('settingAddress').value = s.address || 'VRS Computer Shop, Krong Chbar Mon, Cambodia';
  if (document.getElementById('settingGoogleMapsUrl')) {
    document.getElementById('settingGoogleMapsUrl').value = s.googleMapsUrl || 'https://maps.app.goo.gl/yCtUfzkAvsytpT6A7?g_st=it';
  }
  if (document.getElementById('settingMapEmbedUrl')) {
    document.getElementById('settingMapEmbedUrl').value = s.mapEmbedUrl || 'https://maps.google.com/maps?q=VRS+Computer+Shop,+Krong+Chbar+Mon&t=&z=15&ie=UTF8&iwloc=&output=embed';
  }
  document.getElementById('settingHoursWeekday').value = s.hoursWeekday || '8:00 AM - 8:30 PM ICT';
  document.getElementById('settingHoursSunday').value = s.hoursSunday || '8:00 AM - 8:30 PM ICT';
  document.getElementById('settingTickerAnnouncement').value = s.tickerAnnouncement || '';
}

function saveStoreSettingsForm() {
  const s = getStoreSettings();
  s.storeName = document.getElementById('settingStoreName').value.trim();
  s.tagline = document.getElementById('settingTagline').value.trim();
  s.hotline = document.getElementById('settingHotline').value.trim();
  s.hotlineRaw = s.hotline.replace(/[^0-9+]/g, '');
  s.telegramHandle = document.getElementById('settingTelegramHandle').value.trim().replace(/^@/, '');
  s.telegramUrl = `https://t.me/${s.telegramHandle}`;
  s.whatsappNumber = document.getElementById('settingWhatsappNumber').value.trim().replace(/[^0-9]/g, '');
  s.whatsappUrl = `https://api.whatsapp.com/send/?phone=${s.whatsappNumber}`;
  s.exchangeRateKHR = parseInt(document.getElementById('settingExchangeRate').value) || 4100;
  s.address = document.getElementById('settingAddress').value.trim() || 'VRS Computer Shop, Krong Chbar Mon, Cambodia';
  if (document.getElementById('settingGoogleMapsUrl')) {
    s.googleMapsUrl = document.getElementById('settingGoogleMapsUrl').value.trim() || 'https://maps.app.goo.gl/yCtUfzkAvsytpT6A7?g_st=it';
  }
  if (document.getElementById('settingMapEmbedUrl')) {
    s.mapEmbedUrl = document.getElementById('settingMapEmbedUrl').value.trim() || 'https://maps.google.com/maps?q=VRS+Computer+Shop,+Krong+Chbar+Mon&t=&z=15&ie=UTF8&iwloc=&output=embed';
  }
  s.hoursWeekday = document.getElementById('settingHoursWeekday').value.trim();
  s.hoursSunday = document.getElementById('settingHoursSunday').value.trim();
  s.tickerAnnouncement = document.getElementById('settingTickerAnnouncement').value.trim();

  saveStoreSettings(s);
  VRS_SETTINGS = s;
  EXCHANGE_RATE_KHR = s.exchangeRateKHR;

  refreshAllData();
  showAdminToast('Store settings, location & map saved! Synced to storefront.', 'success');
}

/* --------------------------------------------------------------------------
   COUPONS & PROMOTIONAL VOUCHERS
   -------------------------------------------------------------------------- */
function initCouponsTab() {
  const raw = localStorage.getItem(STORAGE_KEYS.COUPONS);
  if (!raw) {
    // Seed standard promotional coupons
    const initialCoupons = [
      { code: 'VRS2026', discount: 20, minSpend: 100, active: true },
      { code: 'GAMER50', discount: 50, minSpend: 800, active: true },
      { code: 'VIP100', discount: 100, minSpend: 1500, active: true }
    ];
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(initialCoupons));
  }
}

function renderAdminCouponsTable() {
  const tbody = document.getElementById('adminCouponsTableBody');
  if (!tbody) return;

  const raw = localStorage.getItem(STORAGE_KEYS.COUPONS);
  const coupons = raw ? JSON.parse(raw) : [];

  if (coupons.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 24px; color: var(--admin-text-dim);">No active discount coupons.</td></tr>`;
    return;
  }

  tbody.innerHTML = coupons.map(c => `
    <tr>
      <td><strong style="color: var(--admin-cyan); font-family: monospace; font-size: 0.95rem;">${c.code}</strong></td>
      <td><strong style="color: var(--admin-emerald);">$${c.discount} USD OFF</strong></td>
      <td style="color: var(--admin-text-muted);">$${c.minSpend || 0}</td>
      <td><span class="badge-pill ${c.active ? 'badge-in-stock' : 'badge-out-of-stock'}">${c.active ? 'ACTIVE' : 'DISABLED'}</span></td>
      <td>
        <div class="action-btns" style="justify-content: flex-end;">
          <button class="btn-icon btn-icon-danger" title="Delete Coupon" onclick="deleteCoupon('${c.code}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function addCoupon() {
  const code = (document.getElementById('newCouponCode').value || '').trim().toUpperCase();
  const discount = parseFloat(document.getElementById('newCouponDiscount').value);
  const minSpend = parseFloat(document.getElementById('newCouponMinSpend').value) || 0;

  if (!code || isNaN(discount) || discount <= 0) {
    showAdminToast('Please provide a coupon code and valid discount amount!', 'error');
    return;
  }

  const raw = localStorage.getItem(STORAGE_KEYS.COUPONS);
  const coupons = raw ? JSON.parse(raw) : [];

  if (coupons.some(c => c.code === code)) {
    showAdminToast(`Coupon "${code}" already exists!`, 'error');
    return;
  }

  coupons.unshift({ code, discount, minSpend, active: true });
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));

  document.getElementById('newCouponCode').value = '';
  document.getElementById('newCouponDiscount').value = '';
  document.getElementById('newCouponMinSpend').value = '0';

  renderAdminCouponsTable();
  showAdminToast(`Voucher "${code}" created with -$${discount} discount!`, 'success');
}

function deleteCoupon(code) {
  const raw = localStorage.getItem(STORAGE_KEYS.COUPONS);
  let coupons = raw ? JSON.parse(raw) : [];
  coupons = coupons.filter(c => c.code !== code);
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  renderAdminCouponsTable();
  showAdminToast(`Coupon "${code}" deleted.`, 'info');
}

/* --------------------------------------------------------------------------
   ORDERS & INVOICES LOG
   -------------------------------------------------------------------------- */
function initOrdersTab() {
  renderAdminOrdersTable();
}

function renderAdminOrdersTable() {
  const tbody = document.getElementById('adminOrdersTableBody');
  if (!tbody) return;

  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  const orders = raw ? JSON.parse(raw) : [];

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 36px; color: var(--admin-text-dim);">No customer orders logged in system. Completed purchases will be saved here automatically.</td></tr>`;
    return;
  }

  const rate = VRS_SETTINGS.exchangeRateKHR || 4100;

  tbody.innerHTML = orders.map(ord => {
    const dateStr = ord.timestamp ? new Date(ord.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
    const itemsText = (ord.items || []).map(i => `${i.qty || 1}x ${i.name}`).join('<br>');
    const totalKHR = ((ord.grandTotal || 0) * rate).toLocaleString();

    return `
      <tr>
        <td><strong style="color: var(--admin-cyan); font-family: monospace;">${ord.id}</strong></td>
        <td style="color: var(--admin-text-muted); font-size: 0.8rem; white-space: nowrap;">${dateStr}</td>
        <td style="font-size: 0.82rem; line-height: 1.4;">${itemsText}</td>
        <td style="color: var(--admin-text-muted);">$${ord.subtotal?.toLocaleString() || 0}</td>
        <td style="color: var(--admin-emerald);">-$${ord.discount || 0}</td>
        <td><strong style="color: #fff; font-size: 0.95rem;">$${ord.grandTotal?.toLocaleString()} USD</strong></td>
        <td><span style="color: var(--admin-cyan); font-size: 0.82rem;">${totalKHR} ៛</span></td>
        <td><span class="badge-pill badge-in-stock">${ord.paymentMethod || 'ABA KHQR'}</span></td>
        <td style="text-align: right;">
          <button class="btn-admin btn-admin-secondary" style="font-size: 0.74rem; padding: 4px 10px;" onclick="printOrderInvoice('${ord.id}')">
            Print 🖨️
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function clearOrdersLog() {
  if (!confirm('Are you sure you want to clear the customer orders history?')) return;
  localStorage.removeItem(STORAGE_KEYS.ORDERS);
  renderAdminOrdersTable();
  updateDashboardStats();
  showAdminToast('Orders log cleared.', 'info');
}

function printOrderInvoice(orderId) {
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  const orders = raw ? JSON.parse(raw) : [];
  const ord = orders.find(o => o.id === orderId);
  if (!ord) return;

  const printWindow = window.open('', '_blank');
  const itemsRows = (ord.items || []).map((it, idx) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>${it.name}</strong><br><span style="font-size: 11px; color: #666;">SKU: ${it.code || 'VRS'} • 1-3 Yr Warranty</span></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${it.qty || 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${it.price?.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">$${((it.price || 0) * (it.qty || 1)).toLocaleString()}</td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${ord.id} - VRS COMPUTER</title>
      <style>
        body { font-family: -apple-system, sans-serif; padding: 40px; color: #111; }
        .hdr { display: flex; justify-content: space-between; border-bottom: 3px solid #005696; padding-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 14px; }
        th { background: #0f172a; color: #fff; padding: 10px; text-align: left; }
        .summary { width: 300px; margin-left: auto; margin-top: 20px; border: 1px solid #ccc; padding: 14px; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="hdr">
        <div>
          <h2 style="margin: 0; color: #005696;">VRS COMPUTER CO., LTD.</h2>
          <div style="font-size: 13px; color: #666;">Preah Monivong Blvd, Phnom Penh<br>Hotline: ${VRS_SETTINGS.hotline} | Telegram: @${VRS_SETTINGS.telegramHandle}</div>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0; color: #10b981;">PAID &amp; VERIFIED</h3>
          <div style="font-size: 13px;">Invoice: <strong>${ord.id}</strong><br>Date: ${new Date(ord.timestamp).toLocaleDateString()}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr><th style="width:40px; text-align:center;">#</th><th>Item Description</th><th style="width:60px; text-align:center;">Qty</th><th style="width:110px; text-align:right;">Unit Price</th><th style="width:120px; text-align:right;">Total</th></tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>
      <div class="summary">
        <div>Subtotal: <strong>$${ord.subtotal?.toLocaleString()} USD</strong></div>
        ${ord.discount ? `<div style="color:#10b981;">Discount: -$${ord.discount} USD</div>` : ''}
        <div style="font-size: 16px; font-weight: bold; margin-top: 8px; border-top: 1px solid #eee; padding-top: 6px;">Grand Total: $${ord.grandTotal?.toLocaleString()} USD</div>
      </div>
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/* --------------------------------------------------------------------------
   BACKUP, EXPORT & RESTORE (JSON)
   -------------------------------------------------------------------------- */
function exportStoreData() {
  const exportPayload = {
    storeName: "VRS COMPUTER",
    exportedAt: new Date().toISOString(),
    version: "3.5",
    settings: getStoreSettings(),
    categories: loadCategoriesData(),
    products: loadProductsData(),
    builderParts: loadBuilderComponents(),
    coupons: JSON.parse(localStorage.getItem(STORAGE_KEYS.COUPONS) || '[]'),
    orders: JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vrs_computer_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showAdminToast('Store backup (with categories) successfully downloaded!', 'success');
}

function importStoreData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid JSON structure');
      }

      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      if (Array.isArray(data.categories)) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
      if (Array.isArray(data.products)) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
      if (data.builderParts && typeof data.builderParts === 'object') localStorage.setItem(STORAGE_KEYS.BUILDER_PARTS, JSON.stringify(data.builderParts));
      if (Array.isArray(data.coupons)) localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(data.coupons));
      if (Array.isArray(data.orders)) localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));

      showAdminToast('Backup restored successfully! Reloading data...', 'success');
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      showAdminToast('Failed to import backup: invalid JSON file format!', 'error');
    }
  };
  reader.readAsText(file);
}

function resetFactoryDefaults() {
  if (!confirm('⚠️ WARNING: This will reset all products, categories, hardware builder parts, and store settings to initial factory defaults. Are you sure you want to proceed?')) {
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.BUILDER_PARTS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.COUPONS);

  showAdminToast('Store reset to factory defaults. Refreshing...', 'info');
  setTimeout(() => {
    location.reload();
  }, 1000);
}

/* --------------------------------------------------------------------------
   TOAST NOTIFICATION ENGINE
   -------------------------------------------------------------------------- */
function showAdminToast(message, type = 'info') {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <span style="font-weight: 900; font-size: 1rem;">${icons[type] || '•'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
