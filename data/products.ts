/**
 * Catatan Integritas Data:
 * Seluruh data produk di bawah merupakan data demonstrasi untuk purwarupa antarmuka e-commerce Bedi Commerce.
 * Spesifikasi teknis, harga, stok, dan gambar digunakan sebagai referensi demonstrasi desain fungsional.
 */
import { Product, ProductCategory } from "@/types/product";

export const PRODUCT_CATEGORIES: ("Semua" | ProductCategory)[] = [
  "Semua",
  "Audio",
  "Elektronik",
  "Perlengkapan Meja",
  "Pakaian & Tas",
  "Gaya Hidup",
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "bedi-01",
    name: "Studio-01 Wireless Headphones",
    tagline: "Headphone over-ear dengan ANC dan driver 40mm",
    description:
      "Headphone nirkabel dengan bantalan telinga busa memori dan driver bio-selulosa 40mm. Dilengkapi koneksi Bluetooth 5.4, Active Noise Cancelling, dan daya tahan baterai hingga 45 jam.",
    price: 349,
    originalPrice: 399,
    discountPercentage: 13,
    imageUrl:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    category: "Audio",
    rating: 4.9,
    reviewsCount: 184,
    inStock: true,
    stockCount: 18,
    badge: "Terlaris",
    visualTheme: {
      gradient: "from-amber-500/20 via-orange-500/10 to-stone-900/40",
      icon: "headphones",
      accentColor: "#f59e0b",
    },
    features: ["Baterai hingga 45 jam", "Bluetooth 5.4", "Active Noise Cancelling"],
  },
  {
    id: "bedi-02",
    name: "K-75 Mechanical Keyboard",
    tagline: "Keyboard mekanis 75% dengan gasket mount dan switch hot-swap",
    description:
      "Keyboard mekanis tata letak 75% dengan bodi aluminium CNC, keycaps PBT double-shot, dan switch linear terlumasi. Mendukung koneksi nirkabel dan kabel USB-C.",
    price: 189,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    category: "Perlengkapan Meja",
    rating: 4.8,
    reviewsCount: 96,
    inStock: true,
    stockCount: 8,
    badge: "Baru",
    visualTheme: {
      gradient: "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
      icon: "keyboard",
      accentColor: "#3b82f6",
    },
    features: ["Tata letak 75%", "Bodi aluminium CNC", "Koneksi nirkabel & kabel"],
  },
  {
    id: "bedi-03",
    name: "CS-02 Digital Watch",
    tagline: "Jam tangan digital dengan layar micro-OLED dan bodi titanium",
    description:
      "Jam tangan digital berbodi titanium dengan layar micro-OLED anti gores. Mendukung pelacakan aktivitas harian, GPS, dan daya tahan baterai hingga 7 hari.",
    price: 429,
    originalPrice: 479,
    discountPercentage: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    category: "Elektronik",
    rating: 4.7,
    reviewsCount: 112,
    inStock: true,
    stockCount: 12,
    badge: "Diskon",
    visualTheme: {
      gradient: "from-cyan-500/20 via-teal-500/10 to-slate-900/40",
      icon: "watch",
      accentColor: "#06b6d4",
    },
    features: ["Baterai hingga 7 hari", "Bodi titanium Grade 5", "Tahan air 50 meter"],
  },
  {
    id: "bedi-04",
    name: "Commuter Daypack 22L",
    tagline: "Tas ransel kerja tahan air dengan kompartemen laptop 16 inci",
    description:
      "Ransel berkapasitas 22 liter berbahan kain Cordura tahan percikan air. Dilengkapi kompartemen busa pelindung untuk laptop 16 inci dan sistem bukaan clamshell.",
    price: 219,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    category: "Pakaian & Tas",
    rating: 4.9,
    reviewsCount: 204,
    inStock: true,
    stockCount: 22,
    badge: "Terlaris",
    visualTheme: {
      gradient: "from-emerald-500/20 via-teal-500/10 to-stone-900/40",
      icon: "bag",
      accentColor: "#10b981",
    },
    features: ["Kapasitas 22L", "Bahan Cordura tahan cuaca", "Kompartemen laptop 16 inci"],
  },
  {
    id: "bedi-05",
    name: "Lumina Task Lamp",
    tagline: "Lampu meja kerja LED dengan kontrol sentuh dan High-CRI 98+",
    description:
      "Lampu meja kerja dengan rangka logam dan dudukan kuningan padat. Dilengkapi pengatur kecerahan sensor sentuh dan pencahayaan LED spektrum alami yang nyaman di mata.",
    price: 159,
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    category: "Perlengkapan Meja",
    rating: 4.6,
    reviewsCount: 78,
    inStock: true,
    stockCount: 3,
    badge: "Terbatas",
    visualTheme: {
      gradient: "from-yellow-500/20 via-amber-500/10 to-zinc-900/40",
      icon: "lamp",
      accentColor: "#eab308",
    },
    features: ["Spektrum High-CRI 98+", "Sensor sentuh peredup", "Dudukan kuningan padat"],
  },
  {
    id: "bedi-06",
    name: "Precision Wireless Mouse M-03",
    tagline: "Mouse nirkabel ergonomis dengan sensor optik 8.000 DPI",
    description:
      "Mouse nirkabel berdesain kontur ergonomis dengan tombol micro-switch senyap. Menggunakan sensor optik beresolusi hingga 8.000 DPI dan baterai isi ulang melalui port USB-C.",
    price: 119,
    imageUrl:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    category: "Perlengkapan Meja",
    rating: 4.8,
    reviewsCount: 145,
    inStock: true,
    stockCount: 15,
    visualTheme: {
      gradient: "from-purple-500/20 via-indigo-500/10 to-slate-900/40",
      icon: "mouse",
      accentColor: "#a855f7",
    },
    features: ["Sensor optik 8.000 DPI", "Isi daya cepat USB-C", "Klik hening tactile"],
  },
  {
    id: "bedi-07",
    name: "SoundBlock Portable Speaker",
    tagline: "Speaker portabel berbodi kayu walnut dengan suara 360 derajat",
    description:
      "Speaker nirkabel dengan selubung kayu walnut dan penutup kain akustik. Menghasilkan suara 360 derajat dengan daya tahan baterai hingga 28 jam dan sertifikasi tahan air IPX7.",
    price: 269,
    originalPrice: 299,
    discountPercentage: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    category: "Audio",
    rating: 4.9,
    reviewsCount: 167,
    inStock: true,
    stockCount: 9,
    badge: "Diskon",
    visualTheme: {
      gradient: "from-orange-500/20 via-rose-500/10 to-stone-900/40",
      icon: "speaker",
      accentColor: "#f97316",
    },
    features: ["Daya baterai 28 jam", "Stereo pairing nirkabel", "Standar tahan air IPX7"],
  },
  {
    id: "bedi-08",
    name: "Ceramic Travel Tumbler 470ml",
    tagline: "Tumbler stainless steel berlapis keramik tahan panas dan dingin",
    description:
      "Tumbler berkapasitas 470ml (16oz) dengan insulasi vakum ganda. Lapisan dalam keramik menjaga keaslian rasa minuman tanpa bau logam, tahan panas 8 jam dan dingin 24 jam.",
    price: 48,
    imageUrl:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    category: "Gaya Hidup",
    rating: 4.7,
    reviewsCount: 312,
    inStock: true,
    stockCount: 34,
    badge: "Terlaris",
    visualTheme: {
      gradient: "from-rose-500/20 via-pink-500/10 to-stone-900/40",
      icon: "cup",
      accentColor: "#f43f5e",
    },
    features: ["Kapasitas 470ml / 16oz", "Lapisan dalam keramik", "Insulasi vakum ganda"],
  },
  {
    id: "bedi-09",
    name: "Merino All-Weather Jacket",
    tagline: "Jaket wol merino tahan angin dengan lapisan penolak air",
    description:
      "Jaket bertudung berbahan wol merino 19.5 mikron dengan lapisan luar penolak air (DWR). Dilengkapi ritsleting YKK tahan air dan potongan ergonomis untuk kenyamanan harian.",
    price: 320,
    imageUrl:
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80",
    category: "Pakaian & Tas",
    rating: 4.8,
    reviewsCount: 89,
    inStock: false,
    stockCount: 0,
    badge: "Terbatas",
    visualTheme: {
      gradient: "from-slate-500/20 via-zinc-500/10 to-neutral-900/40",
      icon: "jacket",
      accentColor: "#64748b",
    },
    features: ["Serat wol merino 19.5µ", "Lapisan DWR penolak air", "Ritsleting YKK tahan air"],
  },
  {
    id: "bedi-10",
    name: "Portable OLED Monitor 15.6\"",
    tagline: "Monitor portabel 15.6 inci 4K OLED dengan koneksi USB-C",
    description:
      "Monitor eksternal portabel berbobot ringan dengan panel 4K UHD OLED 15.6 inci. Terhubung langsung menggunakan satu kabel USB-C ke laptop atau komputer meja.",
    price: 499,
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    category: "Elektronik",
    rating: 4.9,
    reviewsCount: 64,
    inStock: true,
    stockCount: 6,
    badge: "Baru",
    visualTheme: {
      gradient: "from-violet-500/20 via-fuchsia-500/10 to-slate-900/40",
      icon: "laptop",
      accentColor: "#8b5cf6",
    },
    features: ["Resolusi 4K UHD (3840x2160)", "Panel warna 10-bit", "Konektivitas single USB-C"],
  },
  {
    id: "bedi-11",
    name: "Walnut Monitor Stand",
    tagline: "Dudukan monitor kayu walnut solid dengan riser baja",
    description:
      "Dudukan monitor berbahan kayu walnut solid dengan kaki baja kokoh. Menopang monitor pada posisi pandang yang lebih ergonomis dan menyediakan ruang simpan meja kerja.",
    price: 135,
    imageUrl:
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&auto=format&fit=crop&q=80",
    category: "Perlengkapan Meja",
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    stockCount: 19,
    visualTheme: {
      gradient: "from-stone-500/20 via-amber-700/10 to-neutral-900/40",
      icon: "desk",
      accentColor: "#78716c",
    },
    features: ["Kayu walnut solid", "Kapasitas beban hingga 45kg", "Bantalan gabus pelindung"],
  },
  {
    id: "bedi-12",
    name: "Rangefinder Camera 35mm",
    tagline: "Kamera analog format 35mm dengan lensa 40mm f/2.0",
    description:
      "Kamera analog manual 35mm dengan shutter mekanis dan lensa tetap 40mm f/2.0 berlapis. Rangka bodi logam bertekstur dengan jendela bidik rangefinder yang jernih.",
    price: 680,
    imageUrl:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
    category: "Gaya Hidup",
    rating: 4.8,
    reviewsCount: 47,
    inStock: true,
    stockCount: 2,
    badge: "Terbatas",
    visualTheme: {
      gradient: "from-zinc-500/20 via-stone-500/10 to-black/40",
      icon: "camera",
      accentColor: "#71717a",
    },
    features: ["Shutter mekanis manual", "Lensa tetap 40mm f/2.0", "Bodi logam bertekstur"],
  },
];
