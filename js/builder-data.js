/* ==========================================================================
   VRS COMPUTER - PC BUILDER COMPONENT DATA & COMPATIBILITY MATRIX
   Authentic hardware catalog with accurate sockets, TDP, RAM types & distinct images
   ========================================================================== */

const DEFAULT_BUILDER_COMPONENTS = {
  cpu: [
    {
      id: "b-cpu-01",
      name: "Intel Core i9-14900KS (24C / 32T, up to 6.2GHz)",
      brand: "Intel",
      socket: "LGA1700",
      tdp: 253,
      price: 589,
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80",
      description: "Ultimate flagship desktop processor for extreme gaming, compilation and 3D rendering."
    },
    {
      id: "b-cpu-02",
      name: "AMD Ryzen 7 7800X3D (8C / 16T with 3D V-Cache)",
      brand: "AMD",
      socket: "AM5",
      tdp: 120,
      price: 439,
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80",
      description: "Undisputed champion of gaming frame rates and high thermal efficiency."
    },
    {
      id: "b-cpu-03",
      name: "Intel Core i7-14700K (20C / 28T, up to 5.6GHz)",
      brand: "Intel",
      socket: "LGA1700",
      tdp: 253,
      price: 389,
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80",
      description: "Sweet-spot powerhouse for 4K gaming, streaming, video editing and multitasking."
    },
    {
      id: "b-cpu-04",
      name: "AMD Ryzen 5 7600X (6C / 12T, up to 5.3GHz)",
      brand: "AMD",
      socket: "AM5",
      tdp: 105,
      price: 219,
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80",
      description: "Exceptional price-to-performance esports gaming processor on the future-proof AM5 platform."
    },
    {
      id: "b-cpu-05",
      name: "Intel Core i5-14400F (10C / 16T, up to 4.7GHz)",
      brand: "Intel",
      socket: "LGA1700",
      tdp: 65,
      price: 189,
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80",
      description: "Best budget choice for high FPS 1080p and 1440p gaming with low power draw."
    }
  ],

  motherboard: [
    {
      id: "b-mb-01",
      name: "ASUS ROG MAXIMUS Z790 DARK HERO (Wi-Fi 7)",
      brand: "ASUS",
      socket: "LGA1700",
      ramType: "DDR5",
      formFactor: "ATX",
      price: 599,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
      description: "Premium ROG flagship with 20+1 power stages, PCIe 5.0 and Dual Thunderbolt 4."
    },
    {
      id: "b-mb-02",
      name: "MSI MAG B650 TOMAHAWK WIFI AM5",
      brand: "MSI",
      socket: "AM5",
      ramType: "DDR5",
      formFactor: "ATX",
      price: 219,
      image: "https://images.unsplash.com/photo-1562975079-6a693b79da60?auto=format&fit=crop&w=400&q=80",
      description: "Rock-solid AM5 board with heavy duty VRM cooling and 2.5G LAN."
    },
    {
      id: "b-mb-03",
      name: "ASUS PRIME B760M-A WIFI D4",
      brand: "ASUS",
      socket: "LGA1700",
      ramType: "DDR4",
      formFactor: "Micro-ATX",
      price: 145,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
      description: "Reliable, high-value Micro-ATX board with built-in Wi-Fi 6 for DDR4 builds."
    },
    {
      id: "b-mb-04",
      name: "GIGABYTE X670 AORUS ELITE AX AM5",
      brand: "GIGABYTE",
      socket: "AM5",
      ramType: "DDR5",
      formFactor: "ATX",
      price: 269,
      image: "https://images.unsplash.com/photo-1562975079-6a693b79da60?auto=format&fit=crop&w=400&q=80",
      description: "Robust power delivery with quad M.2 slots for high-speed NVMe storage."
    }
  ],

  gpu: [
    {
      id: "b-gpu-01",
      name: "ASUS ROG Strix GeForce RTX 4090 24GB GDDR6X OC",
      brand: "ASUS",
      vram: "24GB",
      tdp: 450,
      length: "357mm",
      price: 2199,
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80",
      description: "The undisputed king of graphics cards for 4K Ray Tracing, generative AI and 3D animation."
    },
    {
      id: "b-gpu-02",
      name: "MSI GeForce RTX 4080 SUPER 16GB GAMING X SLIM",
      brand: "MSI",
      vram: "16GB",
      tdp: 320,
      length: "322mm",
      price: 1149,
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80",
      description: "Uncompromised 4K gaming power with sleek slim-form factor Tri-Frozr 3 cooling."
    },
    {
      id: "b-gpu-03",
      name: "Gigabyte GeForce RTX 4070 Ti SUPER Gaming OC 16GB",
      brand: "GIGABYTE",
      vram: "16GB",
      tdp: 285,
      length: "300mm",
      price: 849,
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80",
      description: "Sweet spot for 1440p ultra-high refresh and 4K DLSS 3 Frame Generation gaming."
    },
    {
      id: "b-gpu-04",
      name: "ASUS Dual GeForce RTX 4060 Ti 8GB EVO",
      brand: "ASUS",
      vram: "8GB",
      tdp: 160,
      length: "227mm",
      price: 399,
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80",
      description: "Max-efficiency 1080p and 1440p gaming with DLSS 3 and Axial-tech dual fans."
    },
    {
      id: "b-gpu-05",
      name: "ZOTAC GAMING GeForce RTX 3060 12GB Twin Edge",
      brand: "ZOTAC",
      vram: "12GB",
      tdp: 170,
      length: "224mm",
      price: 279,
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80",
      description: "Top-selling budget GPU with generous 12GB VRAM for creative work and esports."
    }
  ],

  ram: [
    {
      id: "b-ram-01",
      name: "Corsair Dominator Titanium RGB 64GB (2x32GB) DDR5 6000MHz",
      brand: "CORSAIR",
      type: "DDR5",
      capacity: "64GB",
      price: 320,
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80",
      description: "Ultra-premium memory with swappable top bars and precision IC tuning."
    },
    {
      id: "b-ram-02",
      name: "G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5 6000MHz CL30",
      brand: "G.SKILL",
      type: "DDR5",
      capacity: "32GB",
      price: 129,
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80",
      description: "Optimized specifically for AMD EXPO with tight CL30 latency timings."
    },
    {
      id: "b-ram-03",
      name: "Kingston Fury Beast RGB 16GB (2x8GB) DDR5 5600MHz",
      brand: "KINGSTON",
      type: "DDR5",
      capacity: "16GB",
      price: 75,
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80",
      description: "Affordable entry into blazing-fast DDR5 performance with customizable RGB."
    },
    {
      id: "b-ram-04",
      name: "Corsair Vengeance RGB PRO 16GB (2x8GB) DDR4 3600MHz",
      brand: "CORSAIR",
      type: "DDR4",
      capacity: "16GB",
      price: 55,
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80",
      description: "High performance DDR4 with dynamic multi-zone RGB lighting for DDR4 boards."
    }
  ],

  storage: [
    {
      id: "b-ssd-01",
      name: "Samsung 990 PRO 2TB NVMe PCIe 4.0 M.2 SSD (7450 MB/s)",
      brand: "SAMSUNG",
      type: "NVMe Gen4",
      capacity: "2TB",
      price: 185,
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80",
      description: "Peak PCIe 4.0 speed for instantaneous level loads and heavy creative assets."
    },
    {
      id: "b-ssd-02",
      name: "Kingston KC3000 1TB PCIe 4.0 NVMe M.2 (7000 MB/s)",
      brand: "KINGSTON",
      type: "NVMe Gen4",
      capacity: "1TB",
      price: 99,
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80",
      description: "High-end Gen 4x4 NVMe controller with graphene aluminum heat spreader."
    },
    {
      id: "b-ssd-03",
      name: "Lexar NM790 512GB M.2 2280 PCIe Gen 4x4",
      brand: "LEXAR",
      type: "NVMe Gen4",
      capacity: "512GB",
      price: 55,
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80",
      description: "Rapid budget SSD with low power consumption and high endurance."
    }
  ],

  cooler: [
    {
      id: "b-col-01",
      name: "Lian Li Galahad II LCD 360mm ARGB Liquid AIO (Black)",
      brand: "LIAN LI",
      type: "AIO Liquid 360mm",
      tdpCapacity: 350,
      price: 249,
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80",
      description: "Stunning 2.88\" IPS LCD screen with 480x480 resolution for custom GIFs & hardware telemetry."
    },
    {
      id: "b-col-02",
      name: "DeepCool LT720 360mm High-Performance Liquid Cooler",
      brand: "DEEPCOOL",
      type: "AIO Liquid 360mm",
      tdpCapacity: 300,
      price: 139,
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80",
      description: "Multidimensional infinity mirror pump design with 4th-gen high-flow water pump."
    },
    {
      id: "b-col-03",
      name: "Thermalright Peerless Assassin 120 SE ARGB Air Cooler",
      brand: "THERMALRIGHT",
      type: "Dual Tower Air Cooler",
      tdpCapacity: 220,
      price: 45,
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80",
      description: "Legendary twin-tower heatsink with 6 heat pipes that beats pricier liquid coolers."
    }
  ],

  psu: [
    {
      id: "b-psu-01",
      name: "Corsair RM1000e 1000W 80+ Gold Fully Modular ATX 3.0",
      brand: "CORSAIR",
      wattage: 1000,
      efficiency: "80+ Gold",
      pcie5Ready: true,
      price: 169,
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80",
      description: "Native PCIe 5.0 12V-2x6 cable included, 105°C-rated Japanese capacitors, zero RPM fan mode."
    },
    {
      id: "b-psu-02",
      name: "MSI MAG A850GL PCIE5 850W 80+ Gold ATX 3.0",
      brand: "MSI",
      wattage: 850,
      efficiency: "80+ Gold",
      pcie5Ready: true,
      price: 125,
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80",
      description: "Dual-color 16-pin connector ensures foolproof visual verification for RTX 40 cards."
    },
    {
      id: "b-psu-03",
      name: "Corsair CX650 650W 80+ Bronze Non-Modular",
      brand: "CORSAIR",
      wattage: 650,
      efficiency: "80+ Bronze",
      pcie5Ready: false,
      price: 65,
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80",
      description: "Reliable power delivery for mainstream budget esports configurations."
    }
  ],

  case: [
    {
      id: "b-cas-01",
      name: "Lian Li O11 Dynamic EVO RGB Dual Glass (Black)",
      brand: "LIAN LI",
      formFactor: "ATX / E-ATX",
      price: 179,
      image: "assets/images/hero-custom-pc.jpg",
      description: "Showpiece dual-chamber glass showcase with top & bottom ambient diffused RGB strips."
    },
    {
      id: "b-cas-02",
      name: "NZXT H6 Flow RGB Compact Dual-Chamber Glass",
      brand: "NZXT",
      formFactor: "ATX",
      price: 135,
      image: "assets/images/hero-gaming.jpg",
      description: "Angled front corner housing 3 pre-installed 120mm RGB fans for maximum GPU intake airflow."
    },
    {
      id: "b-cas-03",
      name: "Montech AIR 100 ARGB Micro-ATX (4 Fans Included)",
      brand: "MONTECH",
      formFactor: "Micro-ATX",
      price: 65,
      image: "assets/images/hero-creator.jpg",
      description: "Ultra-fine mesh front panel with 4 silent ARGB fans pre-installed and magnetic side glass door."
    }
  ]
};

function loadBuilderComponents() {
  try {
    const raw = localStorage.getItem('vrs_custom_builder_parts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading custom builder components:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_BUILDER_COMPONENTS));
}

var BUILDER_COMPONENTS = loadBuilderComponents();
