/* ==========================================================================
   VRS COMPUTER - AUTHENTIC PRODUCT DATABASE & INVENTORY
   Authoritative inventory with Cambodian market specs, bundles & dual currency
   ========================================================================== */

// Storage Keys for Admin Controller & Store Data
const STORAGE_KEYS = {
  SETTINGS: 'vrs_store_settings',
  PRODUCTS: 'vrs_custom_products',
  CATEGORIES: 'vrs_store_categories',
  BUILDER_PARTS: 'vrs_custom_builder_parts',
  ORDERS: 'vrs_store_orders',
  COUPONS: 'vrs_store_coupons',
  PIN: 'vrs_admin_pin'
};

// Default Store Settings
const DEFAULT_STORE_SETTINGS = {
  storeName: "VRS COMPUTER",
  tagline: "Premier Laptops, Custom Gaming PCs & Parts in Cambodia",
  hotline: "+855 98 871 314",
  hotlineRaw: "+85598871314",
  telegramHandle: "Sounvisal",
  telegramUrl: "https://t.me/Sounvisal",
  whatsappNumber: "85598871314",
  whatsappUrl: "https://api.whatsapp.com/send/?phone=85598871314",
  address: "VRS Computer Shop, Krong Chbar Mon, Cambodia",
  googleMapsUrl: "https://maps.app.goo.gl/yCtUfzkAvsytpT6A7?g_st=it",
  mapEmbedUrl: "https://maps.google.com/maps?q=VRS+Computer+Shop,+Krong+Chbar+Mon&t=&z=15&ie=UTF8&iwloc=&output=embed",
  hoursWeekday: "8:00 AM - 8:30 PM ICT",
  hoursSunday: "8:00 AM - 8:30 PM ICT",
  exchangeRateKHR: 4100,
  abaAccountName: "VISAL SOUN",
  abaUsdAccount: "013 997 388",
  abaKhrAccount: "013 997 391",
  abaQrImage: "assets/images/aba-khqr.png",
  tickerAnnouncement: "⚡ SPECIAL PROMO: Free Genuine Windows 11 Pro + 3 Years VIP Warranty on all Custom PC Builds & RTX Laptops • Fast Express Delivery Across Phnom Penh & All 24 Provinces!"
};

function getStoreSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.googleMapsUrl) parsed.googleMapsUrl = DEFAULT_STORE_SETTINGS.googleMapsUrl;
      if (!parsed.mapEmbedUrl) parsed.mapEmbedUrl = DEFAULT_STORE_SETTINGS.mapEmbedUrl;
      if (!parsed.address || parsed.address.includes("Monivong")) {
        parsed.address = DEFAULT_STORE_SETTINGS.address;
      }
      return { ...DEFAULT_STORE_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn('Error reading store settings:', e);
  }
  return { ...DEFAULT_STORE_SETTINGS };
}

function saveStoreSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

let VRS_SETTINGS = getStoreSettings();
let EXCHANGE_RATE_KHR = VRS_SETTINGS.exchangeRateKHR || 4100;

// Default Seed Products (Cambodian Market Hardware)
const DEFAULT_PRODUCTS_DATA = [
  // ==================== LAPTOPS (GAMING, ULTRABOOK, MAC) ====================
  {
    id: "lap-01",
    name: "ASUS ROG Strix SCAR 16 (2026 Edition)",
    brand: "ROG",
    category: "laptop",
    subCategory: "gaming",
    price: 2499,
    originalPrice: 2799,
    code: "VRS-ROG-G634JZ-01",
    condition: "Brand New",
    badge: "VIP SPECS",
    rating: 4.9,
    reviewsCount: 38,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Intel Core Ultra 9 185H (16 Cores, up to 5.1GHz)",
      ram: "32GB DDR5 5600MHz (Dual Channel)",
      storage: "1TB PCIe 4.0 NVMe M.2 SSD",
      display: "16\" ROG Nebula HDR QHD+ 240Hz Mini-LED",
      gpu: "NVIDIA GeForce RTX 4080 12GB (175W TGP)",
      os: "Windows 11 Home Licensed",
      weight: "2.50 Kg | Eclipse Gray with RGB Armor Cap",
      warranty: "2 Years Official ASUS Cambodia Warranty"
    },
    freeGifts: [
      "ROG Ranger Backpack ($99 value)",
      "ROG Gladius III Wireless Mouse",
      "VRS Precision Gaming Deskpad",
      "Cleaning Kit & Keyboard Shield"
    ]
  },
  {
    id: "lap-02",
    name: "ASUS TUF Gaming A15 Mecha Gray",
    brand: "TUF",
    category: "laptop",
    subCategory: "gaming",
    price: 999,
    originalPrice: 1149,
    code: "VRS-TUF-FA507NV",
    condition: "Brand New",
    badge: "BEST SELLER",
    rating: 4.8,
    reviewsCount: 64,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "AMD Ryzen 7 7735HS (8 Cores, up to 4.75GHz)",
      ram: "16GB DDR5 4800MHz Dual Channel",
      storage: "512GB PCIe 4.0 NVMe M.2 SSD",
      display: "15.6\" FHD (1920x1080) 144Hz IPS G-SYNC",
      gpu: "NVIDIA GeForce RTX 4060 8GB GDDR6 (140W)",
      os: "Windows 11 Home Licensed",
      weight: "2.20 Kg | MIL-STD-810H Military Grade",
      warranty: "2 Years ASUS Cambodia Warranty"
    },
    freeGifts: [
      "TUF Gaming Backpack",
      "ASUS TUF M3 Gaming Mouse",
      "Gaming Mousepad",
      "Maintenance Cleaning Kit"
    ]
  },
  {
    id: "lap-03",
    name: "Lenovo Legion Pro 7i Gen 9 (i9-14900HX / RTX 4090)",
    brand: "LENOVO",
    category: "laptop",
    subCategory: "gaming",
    price: 2799,
    originalPrice: 3099,
    code: "VRS-LEGION-PRO7I",
    condition: "Brand New",
    badge: "VIP SPECS",
    rating: 5.0,
    reviewsCount: 22,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Intel Core i9-14900HX (24 Cores / 32 Threads)",
      ram: "32GB (2x16GB) DDR5-5600MHz",
      storage: "2TB (2x 1TB) NVMe M.2 Gen4 TLC",
      display: "16\" WQXGA (2560x1600) IPS 240Hz 500nits",
      gpu: "NVIDIA GeForce RTX 4090 16GB GDDR6 (175W)",
      os: "Windows 11 Pro Licensed",
      weight: "2.62 Kg | Onyx Grey Per-Key RGB",
      warranty: "3 Years Lenovo Legion Ultimate Support"
    },
    freeGifts: [
      "Lenovo Legion Armored Backpack",
      "Legion M300 RGB Mouse",
      "VRS Pro Headset",
      "Aluminum Laptop Stand"
    ]
  },
  {
    id: "lap-04",
    name: "Apple MacBook Pro 16\" Space Black (M3 Max)",
    brand: "APPLE",
    category: "laptop",
    subCategory: "macbook",
    price: 3499,
    originalPrice: 3699,
    code: "VRS-MBP16-M3MAX",
    condition: "Brand New",
    badge: "FLAGSHIP",
    rating: 5.0,
    reviewsCount: 19,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Apple M3 Max (16-core CPU, 12P + 4E)",
      ram: "48GB Unified High-Bandwidth Memory",
      storage: "1TB Superfast SSD Storage",
      display: "16.2\" Liquid Retina XDR 120Hz ProMotion 1600 nits",
      gpu: "40-core GPU with Ray Tracing",
      os: "macOS Sonoma (Free lifetime updates)",
      weight: "2.16 Kg | Space Black Anodized Aluminum",
      warranty: "1 Year Official Apple Warranty Worldwide"
    },
    freeGifts: [
      "Tomtoc Luxury Protective Sleeve ($45 value)",
      "Anker 8-in-1 USB-C Hub 4K HDMI",
      "Microfiber Screen Cloth",
      "Free Software Setup Support"
    ]
  },
  {
    id: "lap-05",
    name: "ASUS Zenbook 14 OLED UX3405 Slim & Light",
    brand: "ASUS",
    category: "laptop",
    subCategory: "ultrabook",
    price: 1399,
    originalPrice: 1549,
    code: "VRS-ZENBOOK-UX3405",
    condition: "Brand New",
    badge: "PREMIUM",
    rating: 4.9,
    reviewsCount: 28,
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Intel Core Ultra 7 155H with AI Boost NPU",
      ram: "32GB LPDDR5X 7467MHz Onboard",
      storage: "1TB M.2 NVMe PCIe 4.0 SSD",
      display: "14.0\" 3K (2880 x 1800) OLED 120Hz 0.2ms 100% DCI-P3",
      gpu: "Intel Arc Graphics",
      os: "Windows 11 Home + MS Office",
      weight: "1.20 Kg | Ponder Blue All-Metal Chassis",
      warranty: "2 Years ASUS Global Warranty"
    },
    freeGifts: [
      "Zenbook Leather Protective Sleeve",
      "USB-C Rapid 65W GaN Charger",
      "Wireless Optical Mouse",
      "Screen Cleaning Kit"
    ]
  },
  {
    id: "lap-06",
    name: "ASUS Vivobook 15 X1504VA Quiet Blue",
    brand: "ASUS",
    category: "laptop",
    subCategory: "ultrabook",
    price: 499,
    originalPrice: 579,
    code: "VRS-ASUS-X1504VA",
    condition: "Brand New",
    badge: "BUDGET CHOICE",
    rating: 4.7,
    reviewsCount: 52,
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Intel Core i3-1315U (6 Cores / 8 Threads)",
      ram: "8GB DDR4 3200MHz (Upgradeable)",
      storage: "512GB M.2 NVMe PCIe 3.0 SSD",
      display: "15.6\" FHD (1920 x 1080) Anti-glare",
      gpu: "Intel UHD Graphics",
      os: "Windows 11 Home Licensed",
      weight: "1.70 Kg | Quiet Blue with Antimicrobial Guard",
      warranty: "2 Years ASUS Cambodia Warranty"
    },
    freeGifts: [
      "ASUS Standard Backpack",
      "Wireless Optical Mouse",
      "VRS Custom Mousepad",
      "Cleaning Kit"
    ]
  },
  {
    id: "lap-07",
    name: "MSI Raider GE78 HX (i9-14900HX / RTX 4080)",
    brand: "MSI",
    category: "laptop",
    subCategory: "gaming",
    price: 2999,
    originalPrice: 3399,
    code: "VRS-MSI-GE78HX",
    condition: "Brand New",
    badge: "VIP SPECS",
    rating: 4.9,
    reviewsCount: 14,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Intel Core i9-14900HX (24 Cores / 32 Threads)",
      ram: "64GB DDR5 5600MHz (2x32GB)",
      storage: "2TB NVMe PCIe Gen5 SSD SuperSpeed",
      display: "17\" QHD+ (2560x1600) 240Hz 100% DCI-P3 IPS",
      gpu: "NVIDIA GeForce RTX 4080 12GB (175W)",
      os: "Windows 11 Pro Licensed",
      weight: "3.10 Kg | Core Black with Mystic Light Bar",
      warranty: "2 Years MSI Official Warranty"
    },
    freeGifts: [
      "MSI Gaming Backpack",
      "MSI M99 RGB Gaming Mouse",
      "Gaming Headset",
      "VRS Pro Mousepad"
    ]
  },
  {
    id: "lap-08",
    name: "Apple MacBook Air 15\" Midnight (M3 Chip)",
    brand: "APPLE",
    category: "laptop",
    subCategory: "macbook",
    price: 1299,
    originalPrice: 1399,
    code: "VRS-MBA15-M3",
    condition: "Brand New",
    badge: "HOT DEAL",
    rating: 4.9,
    reviewsCount: 47,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Apple M3 chip (8-core CPU, 4P + 4E)",
      ram: "16GB Unified High-Bandwidth Memory",
      storage: "512GB Fast SSD Storage",
      display: "15.3\" Liquid Retina with True Tone (2880 x 1864)",
      gpu: "10-core GPU with 100GB/s bandwidth",
      os: "macOS Sonoma",
      weight: "1.51 Kg | Midnight Aluminum Finish",
      warranty: "1 Year Official Apple Warranty in Cambodia"
    },
    freeGifts: [
      "Premium Felt Laptop Sleeve",
      "USB-C to Dual USB-A + HDMI Adapter",
      "Silicone Keyboard Protector",
      "VRS Lifetime macOS Support"
    ]
  },

  // ==================== CUSTOM DESKTOP PCS ====================
  {
    id: "dt-01",
    name: "VRS Signature Elite Gaming PC (i9-14900KS + RTX 4090)",
    brand: "VRS",
    category: "desktop",
    subCategory: "gaming",
    price: 3899,
    originalPrice: 4299,
    code: "VRS-RIG-TITAN-4090",
    condition: "Brand New",
    badge: "FLAGSHIP",
    rating: 5.0,
    reviewsCount: 17,
    inStock: true,
    featured: true,
    image: "assets/images/hero-custom-pc.jpg",
    specs: {
      cpu: "Intel Core i9-14900KS Special Edition (24C/32T up to 6.2GHz)",
      ram: "64GB (2x32GB) Corsair Dominator Titanium DDR5 6600MHz",
      storage: "2TB Samsung 990 PRO NVMe PCIe 4.0 (7,450 MB/s)",
      display: "Supports up to 4x 4K / 8K Displays",
      gpu: "ASUS ROG Strix GeForce RTX 4090 24GB GDDR6X OC",
      motherboard: "ASUS ROG MAXIMUS Z790 DARK HERO Wi-Fi 7",
      cooling: "Thermaltake ARGB Liquid Cooler 360mm",
      psu: "Corsair RM1200x Shift 1200W 80+ Gold Modular",
      case: "Lian Li O11 Dynamic EVO RGB Panoramic Glass",
      os: "Windows 11 Pro Activated & Tested",
      warranty: "3 Years Comprehensive VRS Warranty"
    },
    freeGifts: [
      "Custom Braided Sleeved Cable Extensions",
      "VRS ARGB Anti-Sag GPU Bracket",
      "Razer DeathAdder Wireless Gaming Mouse",
      "Free Lifetime Interior Dust Cleaning"
    ]
  },
  {
    id: "dt-02",
    name: "VRS Apex Esports PC (Ryzen 7 7800X3D + RTX 4070 Ti Super)",
    brand: "VRS",
    category: "desktop",
    subCategory: "gaming",
    price: 1999,
    originalPrice: 2249,
    code: "VRS-RIG-APEX-7800",
    condition: "Brand New",
    badge: "BEST VALUE",
    rating: 4.9,
    reviewsCount: 43,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "AMD Ryzen 7 7800X3D (8 Cores, 3D V-Cache)",
      ram: "32GB (2x16GB) G.Skill Trident Z5 DDR5 6000MHz CL30",
      storage: "1TB Kingston KC3000 PCIe 4.0 NVMe (7,000 MB/s)",
      display: "Multi-monitor DisplayPort 1.4a & HDMI 2.1a",
      gpu: "MSI GeForce RTX 4070 Ti SUPER 16GB Gaming Slim",
      motherboard: "MSI MAG B650 TOMAHAWK WIFI AM5",
      cooling: "DeepCool 360mm High-Performance Liquid Cooler",
      psu: "MSI MAG A850GL 850W 80+ Gold ATX 3.0",
      case: "NZXT Dual-Chamber Compact Glass Chassis",
      os: "Windows 11 Pro Game Optimized",
      warranty: "3 Years Parts & Labor Warranty"
    },
    freeGifts: [
      "Magnetic ARGB Lightbar",
      "Braided Cable Extensions",
      "Mechanical Gaming Keyboard & Pad",
      "3-Year Free Thermal Repasting"
    ]
  },
  {
    id: "dt-03",
    name: "VRS Core Esports PC (i5-14400F + RTX 4060 8GB)",
    brand: "VRS",
    category: "desktop",
    subCategory: "gaming",
    price: 849,
    originalPrice: 949,
    code: "VRS-RIG-GLADIATOR",
    condition: "Brand New",
    badge: "HOT DEAL",
    rating: 4.8,
    reviewsCount: 88,
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Intel Core i5-14400F (10 Cores, up to 4.7GHz)",
      ram: "16GB (2x8GB) Corsair Vengeance DDR4 3600MHz",
      storage: "512GB Lexar NM790 M.2 PCIe 4.0 NVMe",
      gpu: "Gigabyte GeForce RTX 4060 EAGLE OC 8GB",
      motherboard: "ASUS PRIME B760M-A WIFI D4",
      cooling: "Thermalright Assassin King 120 SE ARGB Tower",
      psu: "650W 80+ Bronze Certified PSU",
      case: "Montech AIR 100 ARGB Tempered Glass (4 Fans)",
      os: "Windows 11 Home 64-bit",
      warranty: "2 Years Official Warranty"
    },
    freeGifts: [
      "Gaming RGB Mouse & Keyboard Combo",
      "VRS Large Deskpad",
      "High-speed LAN Cable (5m)",
      "Free Windows & Office Setup"
    ]
  },
  {
    id: "dt-04",
    name: "VRS Studio Creator Workstation (Ryzen 9 9950X + RTX 4080 Super)",
    brand: "VRS",
    category: "desktop",
    subCategory: "workstation",
    price: 3199,
    originalPrice: 3499,
    code: "VRS-RIG-STUDIO-9950",
    condition: "Brand New",
    badge: "CREATOR PRO",
    rating: 5.0,
    reviewsCount: 11,
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "AMD Ryzen 9 9950X (16C / 32T, up to 5.7GHz Zen 5)",
      ram: "64GB (2x32GB) Kingston Fury DDR5 6000MHz",
      storage: "2TB Samsung 990 PRO + 4TB Seagate IronWolf NAS",
      gpu: "ASUS ProArt GeForce RTX 4080 SUPER 16GB OC",
      motherboard: "ASUS ProArt X670E-CREATOR WIFI with USB4 & 10G",
      cooling: "Noctua NH-D15 chromax.black Ultra-Quiet Air Cooler",
      psu: "be quiet! 1000W 80+ Platinum ATX 3.0",
      case: "Fractal Design North Charcoal (Real Walnut Front)",
      os: "Windows 11 Pro Workstation",
      warranty: "3 Years Comprehensive Studio Warranty"
    },
    freeGifts: [
      "Display Color Calibration Support",
      "VRS Studio Desk Accessories Bundle",
      "Custom Silent Fan Tuning",
      "Priority Technician Hotline"
    ]
  },

  // ==================== PC COMPONENTS ====================
  {
    id: "part-01",
    name: "ASUS ROG Strix GeForce RTX 4090 24GB OC Edition",
    brand: "ROG",
    category: "component",
    subCategory: "gpu",
    price: 2199,
    originalPrice: 2399,
    code: "VRS-GPU-ROG4090",
    condition: "Brand New",
    badge: "TOP GPU",
    rating: 5.0,
    reviewsCount: 29,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80",
    specs: {
      gpu: "NVIDIA AD102 (16,384 CUDA Cores)",
      clock: "Boost Clock: 2640 MHz (OC Mode)",
      vram: "24GB GDDR6X (384-bit, 21 Gbps)",
      cooling: "Patented Vented Exoskeleton & Axial-tech Fans",
      power: "850W minimum recommended PSU (16-pin 12VHPWR)",
      warranty: "3 Years Official ASUS Warranty"
    },
    freeGifts: ["ROG Graphics Card Support Bracket", "Velcro Cable Organizers"]
  },
  {
    id: "part-02",
    name: "AMD Ryzen 7 7800X3D Processor Boxed",
    brand: "AMD",
    category: "component",
    subCategory: "cpu",
    price: 439,
    originalPrice: 489,
    code: "VRS-CPU-7800X3D",
    condition: "Brand New",
    badge: "TOP GAMING CPU",
    rating: 5.0,
    reviewsCount: 77,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80",
    specs: {
      socket: "AM5 (Zen 4 Architecture)",
      cores: "8 Cores / 16 Threads",
      baseClock: "4.2 GHz Base / 5.0 GHz Max Boost",
      cache: "96MB 3D V-Cache (104MB Total)",
      tdp: "120W TDP",
      warranty: "3 Years Official AMD Box Warranty"
    },
    freeGifts: ["Thermal Grizzly Kryonaut Thermal Paste (1g)", "Free Installation at Store"]
  },
  {
    id: "part-03",
    name: "Samsung 990 PRO 2TB NVMe M.2 SSD with Heatsink",
    brand: "SAMSUNG",
    category: "component",
    subCategory: "storage",
    price: 195,
    originalPrice: 235,
    code: "VRS-SSD-990PRO-2TB",
    condition: "Brand New",
    badge: "BEST SPEED",
    rating: 4.9,
    reviewsCount: 95,
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
    specs: {
      interface: "PCIe Gen 4.0 x4, NVMe 2.0",
      seqRead: "Up to 7,450 MB/s",
      seqWrite: "Up to 6,900 MB/s",
      tbw: "1,200 TBW Endurance",
      compatibility: "PC & PlayStation 5 Ready with integrated heatsink",
      warranty: "5 Years Samsung Official Warranty"
    },
    freeGifts: ["Magnetic M.2 Screwdriver", "Free OS Cloning / Data Migration"]
  },
  {
    id: "part-04",
    name: "Corsair Dominator Titanium RGB DDR5 32GB (2x16GB) 6000MHz",
    brand: "CORSAIR",
    category: "component",
    subCategory: "ram",
    price: 185,
    originalPrice: 215,
    code: "VRS-RAM-DOM-32GB",
    condition: "Brand New",
    badge: "PREMIUM",
    rating: 4.9,
    reviewsCount: 31,
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=80",
    specs: {
      speed: "DDR5-6000MHz CL30-36-36-76",
      capacity: "32GB (2 x 16GB Modules)",
      voltage: "1.40V (Intel XMP 3.0 & AMD EXPO)",
      features: "11 Vibrant Individually Addressable RGB LEDs",
      warranty: "Lifetime Limited Manufacturer Warranty"
    },
    freeGifts: ["VRS Anti-Static Wrist Strap"]
  },
  {
    id: "part-05",
    name: "Lian Li O11 Dynamic EVO RGB Panoramic Case (Black)",
    brand: "LIAN LI",
    category: "component",
    subCategory: "case",
    price: 179,
    originalPrice: 199,
    code: "VRS-CASE-O11D-RGB",
    condition: "Brand New",
    badge: "BEST SELLER",
    rating: 5.0,
    reviewsCount: 60,
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    specs: {
      dimensions: "(D) 478mm x (W) 290mm x (H) 471mm",
      support: "E-ATX, ATX, Micro-ATX, Mini-ITX",
      radiator: "Up to 3x 360mm Radiators simultaneously",
      features: "Dual L-shaped RGB strips, reversible chassis design",
      warranty: "1 Year Official Warranty"
    },
    freeGifts: ["Vertical GPU Mount Kit Discount Coupon (20%)"]
  },

  // ==================== CERTIFIED PRE-OWNED ====================
  {
    id: "sh-01",
    name: "Certified Pre-Owned MacBook Pro 14\" M1 Pro (16GB / 512GB) Space Gray",
    brand: "APPLE",
    category: "secondhand",
    subCategory: "macbook",
    price: 1150,
    originalPrice: 1999,
    code: "VRS-SH-MBP14-M1P",
    condition: "Grade-A 99% Clean",
    badge: "CERTIFIED 99%",
    rating: 4.8,
    reviewsCount: 41,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Apple M1 Pro 8-Core CPU / 14-Core GPU",
      ram: "16GB Unified Memory",
      storage: "512GB Fast NVMe SSD",
      display: "14.2\" Liquid Retina XDR 120Hz ProMotion (Flawless zero scratches)",
      battery: "Original Battery Health 92% (Low cycle count)",
      os: "macOS Sonoma fresh factory restored",
      warranty: "6 Months VRS Hardware Warranty + Lifetime Software Service"
    },
    freeGifts: [
      "Original Apple 67W MagSafe 3 Charger",
      "Protective Hard Shell Case",
      "VRS Laptop Sleeve & Mousepad"
    ]
  },
  {
    id: "sh-02",
    name: "Certified Pre-Owned ASUS ROG Zephyrus G14 (Ryzen 9 / RTX 3060)",
    brand: "ROG",
    category: "secondhand",
    subCategory: "gaming",
    price: 799,
    originalPrice: 1450,
    code: "VRS-SH-GA401QM",
    condition: "Grade-A 98% Clean",
    badge: "HOT BARGAIN",
    rating: 4.7,
    reviewsCount: 34,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "AMD Ryzen 9 5900HS (8 Cores / 16 Threads)",
      ram: "16GB DDR4 3200MHz",
      storage: "1TB M.2 NVMe SSD",
      display: "14\" QHD (2560x1440) 120Hz 100% DCI-P3",
      gpu: "NVIDIA GeForce RTX 3060 6GB GDDR6",
      os: "Windows 11 Home 64-bit",
      weight: "1.60 Kg | Moonlight White Chassis",
      warranty: "6 Months Comprehensive Store Warranty"
    },
    freeGifts: [
      "Original ASUS Power Adapter",
      "VRS Gaming Backpack",
      "Wireless Gaming Mouse & Pad"
    ]
  },
  {
    id: "sh-03",
    name: "Certified Pre-Owned Dell Latitude 7420 Carbon (i7 / 16GB / 512GB)",
    brand: "DELL",
    category: "secondhand",
    subCategory: "ultrabook",
    price: 430,
    originalPrice: 890,
    code: "VRS-SH-LAT7420",
    condition: "Grade-A 97% Clean",
    badge: "OFFICE SPECIAL",
    rating: 4.8,
    reviewsCount: 56,
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Intel Core i7-1185G7 vPro (4 Cores / 8 Threads)",
      ram: "16GB LPDDR4x 4267MHz",
      storage: "512GB NVMe PCIe M.2 SSD",
      display: "14.0\" FHD (1920x1080) Anti-Glare Carbon Fiber",
      gpu: "Intel Iris Xe Graphics",
      weight: "1.22 Kg | Ultra-durable Carbon Chassis",
      warranty: "6 Months Warranty (1 to 1 replacement if motherboard issue)"
    },
    freeGifts: ["Dell Original Type-C Charger", "Standard Backpack", "Wireless Mouse"]
  },

  // ==================== MONITORS ====================
  {
    id: "mon-01",
    name: "Samsung Odyssey OLED G9 49\" Curved Dual QHD 240Hz",
    brand: "SAMSUNG",
    category: "monitor",
    subCategory: "gaming",
    price: 1299,
    originalPrice: 1599,
    code: "VRS-MON-OLED-G9",
    condition: "Brand New",
    badge: "ULTIMATE SCREEN",
    rating: 4.9,
    reviewsCount: 18,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    specs: {
      screenSize: "49\" 1800R Curved OLED Ultra-Wide (32:9 Aspect Ratio)",
      resolution: "Dual QHD (5120 x 1440)",
      refreshRate: "240Hz Refresh Rate with 0.03ms Response Time (GtG)",
      hdr: "DisplayHDR True Black 400 & Neo Quantum Processor",
      ports: "HDMI 2.1, Micro HDMI 2.1, DisplayPort 1.4, USB Hub",
      warranty: "3 Years Official Samsung Warranty with Burn-In Protection"
    },
    freeGifts: ["Heavy Duty Monitor Arm Bracket ($85 value)", "High-speed 8K DP 1.4 Cable"]
  },
  {
    id: "mon-02",
    name: "ASUS ROG Swift OLED PG27AQDM 27\" QHD 240Hz",
    brand: "ROG",
    category: "monitor",
    subCategory: "gaming",
    price: 799,
    originalPrice: 899,
    code: "VRS-MON-PG27AQDM",
    condition: "Brand New",
    badge: "ESPORTS WEAPON",
    rating: 5.0,
    reviewsCount: 27,
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80",
    specs: {
      screenSize: "26.5\" Anti-Glare OLED (16:9)",
      resolution: "2560 x 1440 QHD",
      refreshRate: "240Hz Refresh Rate, 0.03ms Response Time",
      color: "99% DCI-P3, Delta E < 2 Factory Pre-calibrated",
      features: "Custom Heatsink & Intelligent Voltage Optimization to protect OLED",
      warranty: "3 Years Official ASUS Warranty"
    },
    freeGifts: ["ROG Screen Cleaning Cloth", "ROG LED Projection Stand Kit"]
  },

  // ==================== PERIPHERALS & GEAR ====================
  {
    id: "per-01",
    name: "Logitech G PRO X SUPERLIGHT 2 Wireless Mouse",
    brand: "LOGITECH",
    category: "peripheral",
    subCategory: "mouse",
    price: 145,
    originalPrice: 169,
    code: "VRS-ACC-GPX2-W",
    condition: "Brand New",
    badge: "PRO CHOICE",
    rating: 4.9,
    reviewsCount: 112,
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    specs: {
      sensor: "HERO 2 Sensor (Up to 32,000 DPI, 500+ IPS, 40G)",
      pollingRate: "Up to 4000Hz (0.25ms response time)",
      switches: "LIGHTFORCE Hybrid Optical-Mechanical Switches",
      weight: "60 grams Featherlight",
      battery: "Up to 95 hours continuous motion",
      warranty: "2 Years Logitech Official Warranty"
    },
    freeGifts: ["Corepad Skatez Grip Tape", "VRS Esports Carry Pouch"]
  },
  {
    id: "per-02",
    name: "Razer Huntsman V3 Pro TKL Analog Keyboard",
    brand: "RAZER",
    category: "peripheral",
    subCategory: "keyboard",
    price: 199,
    originalPrice: 229,
    code: "VRS-ACC-HUNT-V3TKL",
    condition: "Brand New",
    badge: "RAPID TRIGGER",
    rating: 4.8,
    reviewsCount: 49,
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    specs: {
      switchType: "Razer Gen-2 Analog Optical Switches with Rapid Trigger",
      actuationRange: "0.1mm to 4.0mm adjustable per-key actuation",
      keycaps: "Textured Double-shot PBT Keycaps",
      topPlate: "Aircraft-grade 5052 Brushed Aluminum",
      wristRest: "Magnetic Firm Leatherette Wrist Rest",
      warranty: "2 Years Official Razer Warranty"
    },
    freeGifts: ["Razer Coiled Cable ($25 value)", "Keycap & Switch Puller"]
  }
];

// Dynamic Product Loader (Admin custom products take precedence)
function loadProductsData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading custom products:', e);
  }
  return [...DEFAULT_PRODUCTS_DATA];
}

var PRODUCTS_DATA = loadProductsData();

// ==================== STORE CATEGORIES SYSTEM (CC COMPUTER KH STRUCTURE) ====================
const DEFAULT_CATEGORIES = [
  { id: "cat-laptop", slug: "laptop", name: "LAPTOP", nameKh: "កុំព្យូទ័រយួរដៃ (Laptop)", icon: "💻", order: 1, active: true, desc: "Gaming, Ultrabooks & Apple MacBooks" },
  { id: "cat-desktop", slug: "desktop", name: "DESKTOP", nameKh: "កុំព្យូទ័រលើតុ (Desktop)", icon: "🖥️", order: 2, active: true, desc: "Custom Water-Cooled & Pre-Built Gaming PCs" },
  { id: "cat-pcpart", slug: "pcpart", name: "PC Part", nameKh: "គ្រឿងបន្លាស់ (PC Part)", icon: "⚙️", order: 3, active: true, desc: "CPUs, GPUs, Motherboards, RAM & Coolers" },
  { id: "cat-secondhand", slug: "secondhand", name: "second hand", nameKh: "មួយទឹក (Second Hand)", icon: "🔄", order: 4, active: true, desc: "Certified 99% Pre-Owned PCs & Laptops" },
  { id: "cat-peripherals", slug: "peripherals", name: "Peripherals", nameKh: "គ្រឿងបរិក្ខារ (Peripherals)", icon: "⌨️", order: 5, active: true, desc: "Gaming Mice, Mechanical Keyboards & Headsets" },
  { id: "cat-storage", slug: "storage", name: "Storage", nameKh: "អង្គចងចាំ (Storage SSD/HDD)", icon: "💾", order: 6, active: true, desc: "NVMe M.2 Gen4 SSDs & External Drives" },
  { id: "cat-network", slug: "network", name: "Network", nameKh: "ប្រព័ន្ធណេតវើក (Network/WiFi)", icon: "📡", order: 7, active: true, desc: "WiFi 6E/7 Routers, Mesh & Network Cards" },
  { id: "cat-speaker", slug: "speaker", name: "Speaker", nameKh: "បាស & កាស (Speaker/Audio)", icon: "🔊", order: 8, active: true, desc: "Hi-Fi Studio Monitors, Soundbars & Speakers" },
  { id: "cat-printer", slug: "printer", name: "Printer", nameKh: "ម៉ាស៊ីនព្រីន (Printer)", icon: "🖨️", order: 9, active: true, desc: "Laser, Ink Tank & Office Photo Printers" },
  { id: "cat-accessories", slug: "accessories", name: "Accessories", nameKh: "គ្រឿងបន្ថែម (Accessories)", icon: "🎒", order: 10, active: true, desc: "Bags, Sleeves, Hubs, Cables & Cleaners" }
];

function loadCategoriesData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
      }
    }
  } catch (e) {
    console.warn('Error loading custom categories:', e);
  }
  return [...DEFAULT_CATEGORIES];
}

function saveCategoriesData(categories) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.CATEGORIES_DATA = categories;
  } catch (e) {
    console.error('Error saving categories:', e);
  }
}

var CATEGORIES_DATA = loadCategoriesData();

function getCategoryBySlug(slug) {
  if (!slug) return null;
  const s = slug.toLowerCase().trim();
  return CATEGORIES_DATA.find(c => c.slug.toLowerCase() === s) || null;
}

// Helper functions for Currency formatting
function formatPrice(usdPrice, currency = 'USD') {
  if (currency === 'KHR') {
    const khr = Math.round(usdPrice * EXCHANGE_RATE_KHR);
    return khr.toLocaleString('en-US') + ' ៛';
  }
  return '$' + usdPrice.toLocaleString('en-US');
}

function calculateSavings(original, current) {
  if (!original || original <= current) return 0;
  return original - current;
}

