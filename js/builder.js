/* ==========================================================================
   VRS COMPUTER - PC BUILDER STUDIO ENGINE
   Interactive configuration, real-time wattage, compatibility & quotation
   ========================================================================== */

const BuilderState = {
  cpu: null,
  motherboard: null,
  gpu: null,
  ram: null,
  storage: null,
  cooler: null,
  psu: null,
  case: null
};

// Slot metadata definitions
const SLOT_DEFINITIONS = [
  { key: 'cpu', title: 'Processor (CPU)', icon: 'cpu', required: true },
  { key: 'motherboard', title: 'Motherboard', icon: 'grid', required: true },
  { key: 'gpu', title: 'Graphics Card (GPU)', icon: 'monitor', required: false },
  { key: 'ram', title: 'Memory (RAM)', icon: 'layers', required: true },
  { key: 'storage', title: 'Storage (SSD / M.2)', icon: 'hard-drive', required: true },
  { key: 'cooler', title: 'CPU Cooler', icon: 'wind', required: true },
  { key: 'psu', title: 'Power Supply Unit (PSU)', icon: 'zap', required: true },
  { key: 'case', title: 'Computer Case', icon: 'box', required: true }
];

let activeModalSlot = null;

// Initialize Builder
function initPCBuilder() {
  renderBuilderSlots();
  updateBuilderCalculations();

  // Attach modal close listener
  const modal = document.getElementById('partPickerModal');
  const closeBtn = document.getElementById('closePartPickerBtn');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('is-open');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('is-open');
    });
  }

  // Preset Buttons
  document.querySelectorAll('[data-builder-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-builder-preset');
      loadBuilderPreset(presetKey);
    });
  });

  // Action buttons
  const orderTgBtn = document.getElementById('builderOrderTelegramBtn');
  if (orderTgBtn) {
    orderTgBtn.addEventListener('click', orderBuildViaTelegram);
  }

  const printQuoteBtn = document.getElementById('builderPrintQuotationBtn');
  if (printQuoteBtn) {
    printQuoteBtn.addEventListener('click', printBuilderQuotation);
  }

  const addAllCartBtn = document.getElementById('builderAddToCartBtn');
  if (addAllCartBtn) {
    addAllCartBtn.addEventListener('click', addBuildToCart);
  }

  const clearBtn = document.getElementById('builderClearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearBuilder);
  }
}

// Slot fallback images
function getSlotFallbackImage(slotKey) {
  const map = {
    cpu: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80",
    motherboard: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    gpu: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80",
    ram: "https://images.unsplash.com/photo-1562975079-6a693b79da60?auto=format&fit=crop&w=400&q=80",
    storage: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80",
    cooler: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80",
    psu: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=400&q=80",
    case: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80"
  };
  return map[slotKey] || "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80";
}

// Render the 8 hardware slots
function renderBuilderSlots() {
  const container = document.getElementById('builderSlotsContainer');
  if (!container) return;

  const currentCurrency = window.VRS_CURRENT_CURRENCY || 'USD';

  container.innerHTML = SLOT_DEFINITIONS.map(slot => {
    const selectedItem = BuilderState[slot.key];

    if (selectedItem) {
      const isCustomBadge = selectedItem.isCustom 
        ? '<span class="builder-slot__status status-custom" style="background:#fef3c7; color:#92400e; border:1px solid #fde68a;">✨ Custom Spec</span>' 
        : '<span class="builder-slot__status status-selected">✓ Selected</span>';

      return `
        <div class="builder-slot is-selected" data-slot="${slot.key}">
          <div class="builder-slot__thumb">
            <img src="${selectedItem.image}" alt="${selectedItem.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80';">
          </div>
          <div class="builder-slot__info">
            <div class="builder-slot__header">
              <span class="builder-slot__type">${slot.title}</span>
              ${isCustomBadge}
            </div>
            <h4 class="builder-slot__name">${selectedItem.name}</h4>
            <p class="builder-slot__meta">${selectedItem.description || ''}</p>
          </div>
          <div class="builder-slot__actions">
            <div class="builder-slot__price">${formatPrice(selectedItem.price, currentCurrency)}</div>
            <div class="builder-slot__btn-group">
              <button type="button" class="btn-slot-change" onclick="openPartPicker('${slot.key}')">Change</button>
              <button type="button" class="btn-slot-remove" onclick="removeBuilderPart('${slot.key}')" title="Remove part">✕</button>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="builder-slot is-empty" data-slot="${slot.key}">
          <div class="builder-slot__empty-icon">
            ${getSlotIconSvg(slot.icon)}
          </div>
          <div class="builder-slot__info">
            <div class="builder-slot__header">
              <span class="builder-slot__type">${slot.title}</span>
              ${slot.required ? '<span class="builder-slot__status status-required">Required</span>' : '<span class="builder-slot__status status-optional">Optional</span>'}
            </div>
            <h4 class="builder-slot__placeholder">No ${slot.title} selected yet</h4>
            <p class="builder-slot__meta">Click select to choose from catalog or enter custom specs</p>
          </div>
          <div class="builder-slot__actions">
            <button type="button" class="btn-slot-select" onclick="openPartPicker('${slot.key}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Select ${slot.title.split(' ')[0]}
            </button>
          </div>
        </div>
      `;
    }
  }).join('');
}

// Module state for part picker modal
let pickerSearchQuery = '';
let pickerSelectedBrand = 'all';
let pickerSortOrder = 'featured';

// Switch between catalog view and custom part form
function switchPickerTab(tab) {
  const catView = document.getElementById('pickerCatalogView');
  const customView = document.getElementById('pickerCustomView');
  const catBtn = document.getElementById('tabCatalogBtn');
  const customBtn = document.getElementById('tabCustomBtn');

  if (tab === 'custom') {
    if (catView) catView.style.display = 'none';
    if (customView) customView.style.display = 'block';
    if (customBtn) {
      customBtn.style.background = '#2563eb';
      customBtn.style.color = '#ffffff';
      customBtn.style.border = 'none';
    }
    if (catBtn) {
      catBtn.style.background = '#ffffff';
      catBtn.style.color = '#334155';
      catBtn.style.border = '1px solid #cbd5e1';
    }
    setTimeout(() => {
      document.getElementById('customPartName')?.focus();
    }, 60);
  } else {
    if (catView) catView.style.display = 'block';
    if (customView) customView.style.display = 'none';
    if (catBtn) {
      catBtn.style.background = '#2563eb';
      catBtn.style.color = '#ffffff';
      catBtn.style.border = 'none';
    }
    if (customBtn) {
      customBtn.style.background = '#ffffff';
      customBtn.style.color = '#334155';
      customBtn.style.border = '1px solid #cbd5e1';
    }
  }
}

// Submit a custom component
function submitCustomPart(event) {
  if (event) event.preventDefault();
  if (!activeModalSlot) return;

  const nameInput = document.getElementById('customPartName');
  const priceInput = document.getElementById('customPartPrice');
  const brandInput = document.getElementById('customPartBrand');
  const wattageInput = document.getElementById('customPartWattage');
  const socketInput = document.getElementById('customPartSocket');
  const descInput = document.getElementById('customPartDesc');

  const name = nameInput ? nameInput.value.trim() : '';
  const price = priceInput ? parseFloat(priceInput.value) : 0;
  if (!name || isNaN(price)) {
    if (window.showToast) window.showToast('Please enter a component name and valid price.', 'warning');
    return;
  }

  const brand = brandInput && brandInput.value.trim() ? brandInput.value.trim() : 'Custom';
  const wattage = wattageInput && wattageInput.value ? parseInt(wattageInput.value) : (activeModalSlot === 'cpu' ? 125 : activeModalSlot === 'gpu' ? 250 : 25);
  const socket = socketInput ? socketInput.value.trim() : '';
  const desc = descInput && descInput.value.trim() ? descInput.value.trim() : `Custom ${activeModalSlot.toUpperCase()} hardware specified by customer`;

  const customPart = {
    id: 'custom-' + activeModalSlot + '-' + Date.now(),
    name: name,
    brand: brand,
    price: Math.max(0, price),
    tdp: wattage,
    wattage: wattage,
    socket: socket,
    ramType: socket,
    description: desc,
    image: getSlotFallbackImage(activeModalSlot),
    isCustom: true
  };

  BuilderState[activeModalSlot] = customPart;

  const modal = document.getElementById('partPickerModal');
  if (modal) modal.classList.remove('is-open');

  renderBuilderSlots();
  updateBuilderCalculations();

  if (window.showToast) {
    window.showToast(`✓ Custom ${customPart.name.substring(0, 30)} added to build!`, 'success');
  }

  // Clear form
  if (nameInput) nameInput.value = '';
  if (priceInput) priceInput.value = '';
  if (brandInput) brandInput.value = '';
  if (wattageInput) wattageInput.value = '';
  if (socketInput) socketInput.value = '';
  if (descInput) descInput.value = '';
}

// Open modal with available parts for chosen slot
function openPartPicker(slotKey) {
  activeModalSlot = slotKey;
  const modal = document.getElementById('partPickerModal');
  const modalTitle = document.getElementById('partPickerModalTitle');
  const modalSubtitle = document.getElementById('partPickerSubtitle');
  const searchInput = document.getElementById('pickerSearchInput');
  const brandChipsContainer = document.getElementById('pickerBrandChips');
  const sortSelect = document.getElementById('pickerSortSelect');
  const clearSlotBtn = document.getElementById('pickerClearSlotBtn');

  if (!modal) return;

  const slotDef = SLOT_DEFINITIONS.find(s => s.key === slotKey);
  const slotName = slotDef ? slotDef.title : slotKey.toUpperCase();
  if (modalTitle) modalTitle.textContent = `Select ${slotName}`;
  if (modalSubtitle) modalSubtitle.textContent = `Choose from verified catalog or enter your custom ${slotName} below`;

  // Update custom form placeholders based on slotKey
  const customNameInput = document.getElementById('customPartName');
  if (customNameInput) {
    if (slotKey === 'cpu') customNameInput.placeholder = 'e.g. Intel Core Ultra 9 285K or AMD Ryzen 9 9950X';
    else if (slotKey === 'gpu') customNameInput.placeholder = 'e.g. NVIDIA GeForce RTX 5080 16GB or RTX 4090';
    else if (slotKey === 'motherboard') customNameInput.placeholder = 'e.g. ASUS ROG Crosshair X670E HERO';
    else if (slotKey === 'ram') customNameInput.placeholder = 'e.g. Corsair Dominator Titanium 64GB DDR5 6000MHz';
    else if (slotKey === 'storage') customNameInput.placeholder = 'e.g. Samsung 990 PRO 4TB PCIe 4.0 NVMe';
    else if (slotKey === 'cooler') customNameInput.placeholder = 'e.g. NZXT Kraken Elite 360 RGB LCD';
    else if (slotKey === 'psu') customNameInput.placeholder = 'e.g. Seasonic PRIME TX-1300 Titanium';
    else if (slotKey === 'case') customNameInput.placeholder = 'e.g. Lian Li O11 Vision Chrome';
  }

  // Always default to catalog tab
  switchPickerTab('catalog');

  // Reset filter state
  pickerSearchQuery = '';
  pickerSelectedBrand = 'all';
  pickerSortOrder = 'featured';

  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'featured';

  // Clear slot button visibility
  if (clearSlotBtn) {
    if (BuilderState[slotKey]) {
      clearSlotBtn.style.display = 'inline-block';
      clearSlotBtn.onclick = () => {
        removeBuilderPart(slotKey);
        modal.classList.remove('is-open');
        if (window.showToast) window.showToast(`Cleared ${slotName}`, 'info');
      };
    } else {
      clearSlotBtn.style.display = 'none';
    }
  }

  // Populate brand chips
  const allParts = BUILDER_COMPONENTS[slotKey] || [];
  const uniqueBrands = Array.from(new Set(allParts.map(p => p.brand).filter(Boolean)));

  if (brandChipsContainer) {
    brandChipsContainer.innerHTML = `
      <button type="button" class="picker-chip is-active" data-picker-brand="all">All (${allParts.length})</button>
      ${uniqueBrands.map(b => `<button type="button" class="picker-chip" data-picker-brand="${b}">${b}</button>`).join('')}
    `;

    brandChipsContainer.querySelectorAll('[data-picker-brand]').forEach(chip => {
      chip.addEventListener('click', () => {
        brandChipsContainer.querySelectorAll('[data-picker-brand]').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        pickerSelectedBrand = chip.getAttribute('data-picker-brand');
        renderPartPickerList();
      });
    });
  }

  // Hook search input
  if (searchInput) {
    searchInput.oninput = (e) => {
      pickerSearchQuery = e.target.value.trim().toLowerCase();
      renderPartPickerList();
    };
  }

  // Hook sort dropdown
  if (sortSelect) {
    sortSelect.onchange = (e) => {
      pickerSortOrder = e.target.value;
      renderPartPickerList();
    };
  }

  renderPartPickerList();
  modal.classList.add('is-open');
}

// Render filtered and sorted list of components
function renderPartPickerList() {
  const slotKey = activeModalSlot;
  const modalList = document.getElementById('partPickerItemsList');
  if (!modalList || !slotKey) return;

  const currentCurrency = window.VRS_CURRENT_CURRENCY || 'USD';
  let parts = [...(BUILDER_COMPONENTS[slotKey] || [])];

  // Brand filter
  if (pickerSelectedBrand !== 'all') {
    parts = parts.filter(p => (p.brand || '').toLowerCase() === pickerSelectedBrand.toLowerCase());
  }

  // Search query filter
  if (pickerSearchQuery) {
    parts = parts.filter(p => 
      (p.name || '').toLowerCase().includes(pickerSearchQuery) ||
      (p.description || '').toLowerCase().includes(pickerSearchQuery) ||
      (p.socket || '').toLowerCase().includes(pickerSearchQuery) ||
      (p.brand || '').toLowerCase().includes(pickerSearchQuery)
    );
  }

  // Sort
  if (pickerSortOrder === 'price-asc') {
    parts.sort((a, b) => a.price - b.price);
  } else if (pickerSortOrder === 'price-desc') {
    parts.sort((a, b) => b.price - a.price);
  }

  if (parts.length === 0) {
    modalList.innerHTML = `
      <div style="padding: 40px 20px; text-align: center; color: var(--text-muted);">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <p style="font-weight: 700; color: var(--text-secondary);">No components matched your search or brand filter.</p>
        <p style="font-size: 0.82rem; margin-top: 4px;">Try searching with a broader keyword or select "All".</p>
      </div>
    `;
    return;
  }

  modalList.innerHTML = parts.map(part => {
    // Compatibility check note
    let compatBadge = '<span class="badge-compat compat-ok">✓ 100% Compatible</span>';
    
    // Motherboard socket check with CPU
    if (slotKey === 'motherboard' && BuilderState.cpu && part.socket !== BuilderState.cpu.socket) {
      compatBadge = `<span class="badge-compat compat-warn">⚠️ Socket mismatch (Needs ${BuilderState.cpu.socket})</span>`;
    }
    if (slotKey === 'cpu' && BuilderState.motherboard && part.socket !== BuilderState.motherboard.socket) {
      compatBadge = `<span class="badge-compat compat-warn">⚠️ Socket mismatch (Board is ${BuilderState.motherboard.socket})</span>`;
    }
    
    // RAM compatibility check (DDR4 vs DDR5)
    if (slotKey === 'ram' && BuilderState.motherboard && part.type !== BuilderState.motherboard.ramType) {
      compatBadge = `<span class="badge-compat compat-warn">⚠️ Requires ${BuilderState.motherboard.ramType}</span>`;
    }

    const isCurrent = BuilderState[slotKey] && BuilderState[slotKey].id === part.id;

    return `
      <div class="part-picker-card ${isCurrent ? 'is-active-choice' : ''}">
        <img class="part-picker-card__img" src="${part.image}" alt="${part.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80';">
        <div class="part-picker-card__details">
          <div class="part-picker-card__top">
            <span class="part-brand-tag">${part.brand || 'VRS'}</span>
            ${compatBadge}
          </div>
          <h4 class="part-picker-card__name">${part.name}</h4>
          <p class="part-picker-card__desc">${part.description || ''}</p>
          <div class="part-picker-card__specs">
            ${part.socket ? `<span class="spec-chip">Socket: ${part.socket}</span>` : ''}
            ${part.tdp ? `<span class="spec-chip">TDP: ${part.tdp}W</span>` : ''}
            ${part.vram ? `<span class="spec-chip">VRAM: ${part.vram}</span>` : ''}
            ${part.capacity ? `<span class="spec-chip">Capacity: ${part.capacity}</span>` : ''}
            ${part.wattage ? `<span class="spec-chip">Output: ${part.wattage}W</span>` : ''}
          </div>
        </div>
        <div class="part-picker-card__right">
          <div class="part-picker-card__price">${formatPrice(part.price, currentCurrency)}</div>
          <button class="btn-picker-choose ${isCurrent ? 'btn-picker-current' : ''}" onclick="selectBuilderPart('${slotKey}', '${part.id}')">
            ${isCurrent ? '✓ Selected' : 'Choose Part'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// User selects a component
function selectBuilderPart(slotKey, partId) {
  const parts = BUILDER_COMPONENTS[slotKey] || [];
  const part = parts.find(p => p.id === partId);
  if (!part) return;

  BuilderState[slotKey] = part;

  const modal = document.getElementById('partPickerModal');
  if (modal) modal.classList.remove('is-open');

  renderBuilderSlots();
  updateBuilderCalculations();

  if (window.showToast) {
    window.showToast(`Added ${part.name.substring(0, 30)}... to your build!`, 'success');
  }
}

// Remove component
function removeBuilderPart(slotKey) {
  BuilderState[slotKey] = null;
  renderBuilderSlots();
  updateBuilderCalculations();
}

// Update wattage, compatibility, and total price
function updateBuilderCalculations() {
  const currentCurrency = window.VRS_CURRENT_CURRENCY || 'USD';

  // Calculate total price
  let totalPriceUSD = 0;
  let estimatedWattage = 70; // baseline motherboard, fans, chipset

  if (BuilderState.cpu) {
    totalPriceUSD += BuilderState.cpu.price;
    estimatedWattage += (BuilderState.cpu.tdp || 125);
  }
  if (BuilderState.motherboard) totalPriceUSD += BuilderState.motherboard.price;
  if (BuilderState.gpu) {
    totalPriceUSD += BuilderState.gpu.price;
    estimatedWattage += (BuilderState.gpu.tdp || 250);
  }
  if (BuilderState.ram) totalPriceUSD += BuilderState.ram.price;
  if (BuilderState.storage) totalPriceUSD += BuilderState.storage.price;
  if (BuilderState.cooler) totalPriceUSD += BuilderState.cooler.price;
  if (BuilderState.psu) totalPriceUSD += BuilderState.psu.price;
  if (BuilderState.case) totalPriceUSD += BuilderState.case.price;

  // Add 15% safety headroom for spikes
  const recommendedPSU = Math.ceil((estimatedWattage * 1.3) / 50) * 50;

  // Update DOM displays
  const priceDisplay = document.getElementById('builderTotalPrice');
  const priceKhrDisplay = document.getElementById('builderTotalPriceKhr');
  if (priceDisplay) priceDisplay.textContent = formatPrice(totalPriceUSD, currentCurrency);
  if (priceKhrDisplay) {
    if (currentCurrency === 'USD') {
      priceKhrDisplay.textContent = `≈ ${(totalPriceUSD * EXCHANGE_RATE_KHR).toLocaleString()} ៛`;
    } else {
      priceKhrDisplay.textContent = `≈ $${totalPriceUSD.toLocaleString()} USD`;
    }
  }

  // Update Wattage Bar
  const wattageVal = document.getElementById('builderEstimatedWattage');
  const recPsuVal = document.getElementById('builderRecommendedPSU');
  const wattageBar = document.getElementById('builderWattageFill');

  if (wattageVal) wattageVal.textContent = `${estimatedWattage} W`;
  if (recPsuVal) recPsuVal.textContent = `${recommendedPSU} W+`;

  if (wattageBar) {
    const selectedPsuWattage = BuilderState.psu ? BuilderState.psu.wattage : recommendedPSU;
    const percentage = Math.min(100, Math.round((estimatedWattage / selectedPsuWattage) * 100));
    wattageBar.style.width = `${percentage}%`;
    if (percentage > 85) {
      wattageBar.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
    } else {
      wattageBar.style.background = 'linear-gradient(90deg, #2563eb, #10b981)';
    }
  }

  // Compatibility Checks
  const compatStatus = document.getElementById('builderCompatStatus');
  const compatDetails = document.getElementById('builderCompatDetails');
  let issues = [];

  if (BuilderState.cpu && BuilderState.motherboard) {
    if (BuilderState.cpu.socket !== BuilderState.motherboard.socket) {
      issues.push(`CPU socket (${BuilderState.cpu.socket}) is incompatible with Motherboard (${BuilderState.motherboard.socket})!`);
    }
  }

  if (BuilderState.ram && BuilderState.motherboard) {
    if (BuilderState.ram.type !== BuilderState.motherboard.ramType) {
      issues.push(`Motherboard requires ${BuilderState.motherboard.ramType} RAM, but ${BuilderState.ram.type} is selected.`);
    }
  }

  if (BuilderState.psu && BuilderState.psu.wattage < estimatedWattage) {
    issues.push(`Selected PSU (${BuilderState.psu.wattage}W) is lower than estimated peak consumption (${estimatedWattage}W).`);
  }

  if (compatStatus && compatDetails) {
    if (issues.length === 0) {
      compatStatus.className = 'compat-indicator is-compatible';
      compatStatus.innerHTML = `<span class="compat-icon">✓</span> <span>All Selected Parts 100% Compatible</span>`;
      compatDetails.textContent = 'Hardware sockets, memory standard, and power requirements are verified safe by VRS Tech Engine.';
    } else {
      compatStatus.className = 'compat-indicator is-incompatible';
      compatStatus.innerHTML = `<span class="compat-icon">⚠️</span> <span>Compatibility Warning (${issues.length})</span>`;
      compatDetails.innerHTML = issues.map(i => `<div>• ${i}</div>`).join('');
    }
  }
}

// Preset configurations
function loadBuilderPreset(presetKey) {
  if (presetKey === 'titan4090') {
    BuilderState.cpu = BUILDER_COMPONENTS.cpu[0]; // i9-14900KS
    BuilderState.motherboard = BUILDER_COMPONENTS.motherboard[0]; // ROG Maximus Z790
    BuilderState.gpu = BUILDER_COMPONENTS.gpu[0]; // ROG Strix RTX 4090
    BuilderState.ram = BUILDER_COMPONENTS.ram[0]; // Dominator 64GB
    BuilderState.storage = BUILDER_COMPONENTS.storage[0]; // 990 Pro 2TB
    BuilderState.cooler = BUILDER_COMPONENTS.cooler[0]; // Lian Li LCD 360
    BuilderState.psu = BUILDER_COMPONENTS.psu[0]; // 1000W Gold
    BuilderState.case = BUILDER_COMPONENTS.case[0]; // O11 Dynamic EVO
  } else if (presetKey === 'apex7800') {
    BuilderState.cpu = BUILDER_COMPONENTS.cpu[1]; // Ryzen 7 7800X3D
    BuilderState.motherboard = BUILDER_COMPONENTS.motherboard[1]; // MSI B650
    BuilderState.gpu = BUILDER_COMPONENTS.gpu[2]; // RTX 4070 Ti Super
    BuilderState.ram = BUILDER_COMPONENTS.ram[1]; // G.Skill Trident 32GB
    BuilderState.storage = BUILDER_COMPONENTS.storage[1]; // KC3000 1TB
    BuilderState.cooler = BUILDER_COMPONENTS.cooler[1]; // LT720 360
    BuilderState.psu = BUILDER_COMPONENTS.psu[1]; // 850W Gold
    BuilderState.case = BUILDER_COMPONENTS.case[1]; // H6 Flow
  } else if (presetKey === 'budgetEsports') {
    BuilderState.cpu = BUILDER_COMPONENTS.cpu[4]; // i5-14400F
    BuilderState.motherboard = BUILDER_COMPONENTS.motherboard[2]; // B760M D4
    BuilderState.gpu = BUILDER_COMPONENTS.gpu[3]; // RTX 4060 Ti
    BuilderState.ram = BUILDER_COMPONENTS.ram[3]; // Corsair DDR4 16GB
    BuilderState.storage = BUILDER_COMPONENTS.storage[2]; // Lexar 512GB
    BuilderState.cooler = BUILDER_COMPONENTS.cooler[2]; // Peerless Assassin
    BuilderState.psu = BUILDER_COMPONENTS.psu[2]; // 650W Bronze
    BuilderState.case = BUILDER_COMPONENTS.case[2]; // Montech Air 100
  }

  renderBuilderSlots();
  updateBuilderCalculations();
  if (window.showToast) window.showToast(`Loaded preset configuration successfully!`, 'success');
}

// Clear builder
function clearBuilder() {
  Object.keys(BuilderState).forEach(k => BuilderState[k] = null);
  renderBuilderSlots();
  updateBuilderCalculations();
  if (window.showToast) window.showToast('Build cleared.', 'info');
}

// Order via Telegram
function orderBuildViaTelegram() {
  const parts = Object.entries(BuilderState).filter(([_, part]) => part !== null);
  if (parts.length === 0) {
    if (window.showToast) window.showToast('Please select or custom-configure at least one component to order!', 'warning');
    return;
  }

  let totalUSD = 0;
  let text = `🚀 *VRS COMPUTER - CUSTOM PC BUILD QUOTATION*\n`;
  text += `===================================\n`;

  parts.forEach(([slot, part]) => {
    totalUSD += part.price;
    const customTag = part.isCustom ? ' (✨ Custom Spec)' : '';
    text += `🔹 *${slot.toUpperCase()}${customTag}*: ${part.name} - $${part.price.toLocaleString()}\n`;
    if (part.isCustom && part.description) {
      text += `   📝 Note: ${part.description}\n`;
    }
  });

  const totalKHR = totalUSD * EXCHANGE_RATE_KHR;
  text += `===================================\n`;
  text += `💰 *TOTAL ESTIMATE*: $${totalUSD.toLocaleString()} USD (≈ ${totalKHR.toLocaleString()} ៛)\n`;
  text += `🎁 *Includes*: Professional Cable Management, Thermal Paste, Windows 11 Pro Tuning, 3 Years VIP Warranty\n`;
  text += `📍 *Store*: VRS Computer Phnom Penh (Hotline: +855 98 871 314)\n`;
  text += `Please confirm part availability and assembly quote!`;

  const encoded = encodeURIComponent(text);
  window.open(`https://t.me/Sounvisal?text=${encoded}`, '_blank');
}

// Print / Download Quotation Sheet
function printBuilderQuotation() {
  const parts = Object.entries(BuilderState).filter(([_, part]) => part !== null);
  if (parts.length === 0) {
    if (window.showToast) window.showToast('Please select parts before generating a quotation.', 'warning');
    return;
  }

  const quoteNo = 'VRS-' + Math.floor(100000 + Math.random() * 900000);
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  let totalUSD = 0;

  const rows = parts.map(([slot, part], idx) => {
    totalUSD += part.price;
    const customBadge = part.isCustom ? ' <span style="background:#fef3c7; color:#92400e; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:bold;">CUSTOM</span>' : '';
    return `
      <tr>
        <td style="padding:10px; border-bottom:1px solid #ddd; text-align:center;">${idx + 1}</td>
        <td style="padding:10px; border-bottom:1px solid #ddd;">
          <strong style="text-transform:uppercase; font-size:12px; color:#555;">[${slot}]</strong>${customBadge}<br>
          ${part.name}
          ${part.isCustom && part.description ? `<br><small style="color:#64748b; font-style:italic;">Note: ${part.description}</small>` : ''}
        </td>
        <td style="padding:10px; border-bottom:1px solid #ddd; text-align:center;">1</td>
        <td style="padding:10px; border-bottom:1px solid #ddd; text-align:right;">$${part.price.toLocaleString()}</td>
        <td style="padding:10px; border-bottom:1px solid #ddd; text-align:right; font-weight:bold;">$${part.price.toLocaleString()}</td>
      </tr>
    `;
  }).join('');

  const totalKHR = (totalUSD * EXCHANGE_RATE_KHR).toLocaleString();

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Official Quotation - VRS COMPUTER (${quoteNo})</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #222; margin: 0; padding: 40px; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
        .logo-title { font-size: 26px; font-weight: 900; letter-spacing: 1px; color: #0a0d14; }
        .logo-sub { font-size: 13px; color: #666; margin-top: 4px; }
        .meta-box { text-align: right; font-size: 13px; line-height: 1.6; color: #444; }
        .table { width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 14px; }
        .th { background: #0f172a; color: #fff; padding: 12px 10px; text-align: left; }
        .total-box { margin-top: 25px; margin-left: auto; width: 340px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #f8fafc; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .total-grand { font-size: 18px; font-weight: 800; color: #2563eb; border-top: 2px solid #cbd5e1; padding-top: 8px; }
        .terms { margin-top: 40px; font-size: 12px; color: #64748b; border-top: 1px solid #eee; padding-top: 15px; }
        .stamp-area { margin-top: 40px; display: flex; justify-content: space-between; }
        .stamp-box { width: 200px; text-align: center; border-top: 1px dashed #999; padding-top: 10px; font-size: 13px; color: #444; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo-title">VRS COMPUTER</div>
          <div class="logo-sub">Official Computer Store &amp; Custom PC Workshop<br>${window.VRS_SETTINGS?.address || 'VRS Computer Shop, Krong Chbar Mon, Cambodia'}<br>Hotline: ${window.VRS_SETTINGS?.hotline || '+855 98 871 314'} | Telegram: @${window.VRS_SETTINGS?.telegramHandle || 'Sounvisal'}</div>
        </div>
        <div class="meta-box">
          <strong style="font-size:16px; color:#0284c7;">OFFICIAL PC QUOTATION</strong><br>
          <strong>Quotation No:</strong> ${quoteNo}<br>
          <strong>Date:</strong> ${today}<br>
          <strong>Validity:</strong> 7 Days from issue
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th class="th" style="width: 40px; text-align: center;">#</th>
            <th class="th">Component Description</th>
            <th class="th" style="width: 60px; text-align: center;">Qty</th>
            <th class="th" style="width: 110px; text-align: right;">Unit Price</th>
            <th class="th" style="width: 120px; text-align: right;">Total (USD)</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="total-box">
        <div class="total-row"><span>Hardware Subtotal:</span> <span>$${totalUSD.toLocaleString()}</span></div>
        <div class="total-row"><span>Custom Cable Management & Assembly:</span> <span style="color:#10b981;">FREE ($45 Value)</span></div>
        <div class="total-row"><span>BIOS & Memory EXPO/XMP Tuning:</span> <span style="color:#10b981;">FREE</span></div>
        <div class="total-row"><span>Genuine Windows 11 Setup:</span> <span style="color:#10b981;">FREE</span></div>
        <div class="total-row total-grand"><span>Total Amount (USD):</span> <span>$${totalUSD.toLocaleString()}</span></div>
        <div class="total-row" style="font-size:13px; color:#64748b; margin-top:4px;"><span>Total in Riel (KHR):</span> <span>${totalKHR} ៛</span></div>
      </div>

      <div class="terms">
        <strong>Terms & Conditions:</strong><br>
        1. All components are 100% Brand New and covered by 1-3 Years Official Manufacturer Warranty.<br>
        2. Includes Lifetime Hardware Dust Cleaning and Free Diagnostic Services at VRS Computer Service Center.<br>
        3. Payment Accepted: ABA BANK KHQR (VISAL SOUN - USD 013 997 388 / KHR 013 997 391), Bakong, Cash, or Bank Transfer.
      </div>

      <div class="stamp-area">
        <div class="stamp-box">Prepared by<br><br><br><strong>VISAL SOUN (VRS Sales)</strong></div>
        <div class="stamp-box">Customer Confirmation<br><br><br><strong>Signature & Date</strong></div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// Add entire build to cart
function addBuildToCart() {
  const parts = Object.values(BuilderState).filter(p => p !== null);
  if (parts.length === 0) {
    if (window.showToast) window.showToast('Please select components before adding to cart.', 'warning');
    return;
  }

  let totalUSD = 0;
  const buildSummary = parts.map(p => {
    totalUSD += p.price;
    return p.name;
  });

  const customBuildProduct = {
    id: 'custom-build-' + Date.now(),
    name: `Custom PC Rig (${BuilderState.cpu ? BuilderState.cpu.name.split(' ')[0] : 'Custom'} + ${BuilderState.gpu ? BuilderState.gpu.name.split(' ')[2] || 'GPU' : 'Custom'})`,
    price: totalUSD,
    originalPrice: totalUSD + 150,
    image: BuilderState.case ? BuilderState.case.image : 'assets/images/hero-custom-pc.jpg',
    code: 'VRS-CUSTOM-RIG',
    freeGifts: ['Custom Assembly & Cable Management', 'VIP 3-Year Service Card'],
    isCustomBuild: true,
    specsSummary: buildSummary.join(', ')
  };

  if (window.addToCartObject) {
    window.addToCartObject(customBuildProduct);
    if (window.showToast) window.showToast('Custom PC build successfully added to Cart!', 'success');
  }
}

// Helper SVG icons
function getSlotIconSvg(icon) {
  switch (icon) {
    case 'cpu':
      return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`;
    case 'grid':
      return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18M9 21V9"></path></svg>`;
    case 'monitor':
      return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;
    case 'layers':
      return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`;
    case 'hard-drive':
      return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>`;
    case 'wind':
      return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>`;
    case 'zap':
      return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
    case 'box':
    default:
      return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;
  }
}

// Global window exposure
window.initPCBuilder = initPCBuilder;
window.renderBuilderSlots = renderBuilderSlots;
window.openPartPicker = openPartPicker;
window.selectBuilderPart = selectBuilderPart;
window.removeBuilderPart = removeBuilderPart;
window.switchPickerTab = switchPickerTab;
window.submitCustomPart = submitCustomPart;
window.loadBuilderPreset = loadBuilderPreset;
window.clearBuilder = clearBuilder;
window.orderBuildViaTelegram = orderBuildViaTelegram;
window.printBuilderQuotation = printBuilderQuotation;
window.addBuildToCart = addBuildToCart;
window.BuilderState = BuilderState;
