# ⚡ VRS COMPUTER - Next-Gen Computer Store & Custom PC Configurator

> A high-end, modern e-commerce and showcase website designed for **VRS COMPUTER**, inspired by Cambodian computer retailers like CC Computer (`cccomputerkh.com`), but rebuilt from the ground up with state-of-the-art cyber-luxe aesthetics, responsive design, and powerful interactive tools.

---

## 🌟 Key Features & Innovations (Compared to CC Computer)

| Feature | CC Computer (`cccomputerkh.com`) | **VRS COMPUTER** (This Project) |
| :--- | :--- | :--- |
| **Design & UI** | 1990s/2000s table layout, fixed `width=1280` | **Cyber-Luxe Glassmorphic design**, 100% mobile responsive |
| **Dark & Light Mode** | None (fixed white with table borders) | **Seamless One-Click Dark/Light Mode** with persistence |
| **Currency Support** | Fixed USD only | **Dual Currency Engine** with live toggle: **USD ($)** & **KHR (៛)** |
| **Bilingual Support** | Basic static text | **One-Click Language Switch**: English & **ភាសាខ្មែរ (Khmer)** |
| **PC Builder** | None (Users must manually contact) | **Interactive Custom PC Builder Studio** with live wattage & compatibility |
| **Quotation Tool** | Manual phone/chat quotation | **Instant Official PDF/Printable Quotation Sheet** with company stamp |
| **Cambodian Payments** | Phone call only | **Bakong KHQR Modal** (ABA PAY, ACLEDA, Wing, Canadia) |
| **Ordering** | Basic links | **1-Click Pre-formatted Telegram & WhatsApp Order** with full specs |
| **Product Comparison** | None | **Side-by-Side Spec Comparison Drawer** (up to 3 products) |
| **Detailed Specs** | Messy bullet text | **Structured Spec Box + VIP Badges + Free Gifts Bundle list** |

---

## 📁 Project Structure

```
d:/VRS Computer/
├── assets/
│   ├── images/
│   │   ├── hero-gaming.jpg        # Flagship 8K Gaming Laptop & PC Showcase
│   │   ├── hero-creator.jpg       # Creator Studio & Workstations Showcase
│   │   └── hero-custom-pc.jpg     # Liquid-Cooled Custom Gaming PC Showcase
│   └── icons/
├── css/
│   ├── theme.css                  # Design tokens, color palette, dark/light themes & fonts
│   ├── style.css                  # Master application styles, layout, header, footer, modals
│   └── builder.css                # PC Builder Studio component slots, wattage meter & presets
├── js/
│   ├── products.js                # Authoritative product database with Cambodian market specs & gifts
│   ├── builder-data.js            # Hardware parts catalog for the PC Builder Studio
│   ├── builder.js                 # PC Builder logic: wattage calculations, compatibility checks, quotation
│   └── app.js                     # Main client logic: search, filter, dual currency, cart, KHQR modal
├── index.html                     # Main application entry point
└── README.md                      # Documentation & maintenance guide
```

---

## 🚀 How to Run Locally

You can run this project with any static HTTP server or open `index.html` directly in your browser:

### Option 1: Using Python
```bash
python -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Using Node.js / npx
```bash
npx serve .
```

### Option 3: Direct Browser Launch
Double click [`index.html`](file:///d:/VRS%20Computer/index.html) to open it directly in Chrome, Edge, Brave, or Firefox.

---

## 🛠️ How to Customize

### 1. Updating Products
Open [`js/products.js`](file:///d:/VRS%20Computer/js/products.js) to add or edit laptops, desktops, components, monitors, or peripherals:
```javascript
{
  id: "lap-custom-01",
  name: "Your Laptop Name",
  brand: "ASUS",
  category: "laptop",
  subCategory: "gaming",
  price: 1299,
  originalPrice: 1499,
  code: "VRS-CODE-01",
  condition: "Brand New",
  badge: "VIP SPECS",
  specs: {
    cpu: "Intel Core i7-14700HX",
    ram: "16GB DDR5",
    storage: "1TB NVMe SSD",
    gpu: "RTX 4060 8GB"
  },
  freeGifts: ["Tactical Backpack", "Gaming Mouse", "Mousepad"]
}
```

### 2. Changing the Exchange Rate (USD to KHR)
In [`js/products.js`](file:///d:/VRS%20Computer/js/products.js):
```javascript
const EXCHANGE_RATE_KHR = 4100; // Change to current rate (e.g., 4120)
```

### 3. Updating Store Contacts & Telegram
In [`index.html`](file:///d:/VRS%20Computer/index.html) and [`js/app.js`](file:///d:/VRS%20Computer/js/app.js):
- Telegram: Replace `vrscomputerkh` with your actual Telegram username or channel link.
- Phone Hotlines: `012 888 999` and `096 888 999`.
- Address: Preah Monivong Blvd, Phnom Penh.

---

## 🌐 Free 1-Click Deployment
This project is 100% static with zero complex build dependencies:
- **Vercel**: Run `vercel` or drag & drop folder into Vercel Dashboard.
- **Netlify**: Drag & drop folder into Netlify Drop.
- **GitHub Pages**: Push to repository and enable GitHub Pages on `main` branch.
