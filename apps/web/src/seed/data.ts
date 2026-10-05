/**
 * Seed content. Copy comes from the Figma design (rDltaXMELvK7SJVvtuMZH0), with the placeholder
 * issues fixed ("Employees", "B2C Customers"). Items marked PLACEHOLDER are not in the design and
 * exist so every catalog page has content; the client should replace them.
 *
 * Images live in ./assets (downloaded once from Figma). They are design placeholders: confirm
 * usage rights or replace them before launch.
 */

export type SeedMedia = { file: string; alt: string }

export const media = {
  homeHero: { file: 'home-hero.jpg', alt: 'Surgical team operating under theatre lights' },
  contactHero: { file: 'contact-hero.jpg', alt: 'Modern operating room' },
  map: { file: 'map.jpg', alt: 'Map of Smart Care Medical locations in Cairo' },
  lineSurgical: { file: 'line-surgical.jpg', alt: 'Stainless steel surgical forceps and scissors' },
  lineFurniture: { file: 'line-furniture.jpg', alt: 'Electric hospital bed with side rails' },
  lineAi: { file: 'line-ai.jpg', alt: 'Monitor showing AI analysis of brain MRI scans' },
  scissors: { file: 'product-scissors.jpg', alt: 'Precision dissection scissors on a teal drape' },
  forceps: { file: 'product-forceps.jpg', alt: 'Micro-suture forceps on a steel tray' },
  laparoscope: { file: 'product-laparoscope.jpg', alt: 'High-definition laparoscope' },
  clamps: { file: 'product-clamps.jpg', alt: 'Two arterial hemostatic clamps' },
  electrode: { file: 'product-electrode.jpg', alt: 'Bipolar electro-surgical electrode handpiece' },
  needleHolder: {
    file: 'product-needle-holder.jpg',
    alt: 'Tungsten needle holder with gold handles',
  },
  miconvey: { file: 'partner-miconvey.png', alt: 'Miconvey logo' },
  medicone: { file: 'partner-medicone.png', alt: 'Medicone logo' },
  nuliferay: { file: 'partner-nuliferay.png', alt: 'NuLIFEray logo' },
  dermavline: { file: 'partner-dermavline.png', alt: 'DermaVline logo' },
} satisfies Record<string, SeedMedia>

export type MediaKey = keyof typeof media

export const productLines = [
  {
    title: 'Surgical Specialties',
    slug: 'surgical-specialties',
    description:
      'Browse high-precision, trusted clinical instruments manufactured under strict clinical compliance for surgery rooms worldwide.',
    coverImage: 'lineSurgical',
    ctaLabel: 'Browse Instruments',
    catalog: { allLabel: 'All Surgical Tools', searchPlaceholder: 'Search instruments...' },
    order: 1,
  },
  {
    title: 'Medical Furniture',
    slug: 'medical-furniture',
    // PLACEHOLDER description
    description:
      'Hospital beds, stretchers, and examination furniture built for patient comfort and daily ward use.',
    coverImage: 'lineFurniture',
    ctaLabel: 'Explore Furniture',
    catalog: { allLabel: 'All Furniture', searchPlaceholder: 'Search furniture...' },
    order: 2,
  },
  {
    title: 'AI Diagnostics & Software',
    slug: 'ai-diagnostics',
    // PLACEHOLDER description
    description:
      'AI-assisted imaging and hospital software that help clinical teams reach decisions faster.',
    coverImage: 'lineAi',
    ctaLabel: 'View AI Solutions',
    catalog: { allLabel: 'All Solutions', searchPlaceholder: 'Search solutions...' },
    order: 3,
  },
] as const satisfies ReadonlyArray<{ coverImage: MediaKey } & Record<string, unknown>>

export type LineSlug = (typeof productLines)[number]['slug']

export const categories = [
  { title: 'Urology', slug: 'urology', line: 'surgical-specialties', order: 1 },
  { title: 'Plastic Surgery', slug: 'plastic-surgery', line: 'surgical-specialties', order: 2 },
  {
    title: 'General & Innovation',
    slug: 'general-innovation',
    line: 'surgical-specialties',
    order: 3,
  },
  // PLACEHOLDER categories
  { title: 'Hospital Beds', slug: 'hospital-beds', line: 'medical-furniture', order: 1 },
  {
    title: 'Examination & Procedure',
    slug: 'examination-procedure',
    line: 'medical-furniture',
    order: 2,
  },
  { title: 'Imaging AI', slug: 'imaging-ai', line: 'ai-diagnostics', order: 1 },
  { title: 'Hospital Software', slug: 'hospital-software', line: 'ai-diagnostics', order: 2 },
] as const satisfies ReadonlyArray<{ line: LineSlug } & Record<string, unknown>>

type CategorySlug = (typeof categories)[number]['slug']

type SeedProduct = {
  title: string
  slug: string
  description: string
  image: MediaKey
  line: LineSlug
  category: CategorySlug
}

const surgical = (p: Omit<SeedProduct, 'line'>): SeedProduct => ({
  ...p,
  line: 'surgical-specialties',
})

export const products: SeedProduct[] = [
  // From the design
  surgical({
    title: 'Precision Dissection Scissors',
    slug: 'precision-dissection-scissors',
    description:
      'High-precision medical instrument crafted for extreme durability and sterile hospital performance.',
    image: 'scissors',
    category: 'urology',
  }),
  surgical({
    title: 'Micro-Suture Forceps Ultra',
    slug: 'micro-suture-forceps-ultra',
    description:
      'High-precision medical instrument crafted for extreme durability and sterile hospital performance.',
    image: 'forceps',
    category: 'plastic-surgery',
  }),
  surgical({
    title: 'High-Definition Laparoscope',
    slug: 'high-definition-laparoscope',
    description:
      'High-precision medical instrument crafted for extreme durability and sterile hospital performance.',
    image: 'laparoscope',
    category: 'urology',
  }),
  surgical({
    title: 'Arterial Hemostatic Clamps',
    slug: 'arterial-hemostatic-clamps',
    description:
      'High-precision medical instrument crafted for extreme durability and sterile hospital performance.',
    image: 'clamps',
    category: 'general-innovation',
  }),
  surgical({
    title: 'Bipolar Electro-Surgical Electrode',
    slug: 'bipolar-electro-surgical-electrode',
    description:
      'High-precision medical instrument crafted for extreme durability and sterile hospital performance.',
    image: 'electrode',
    category: 'general-innovation',
  }),
  surgical({
    title: 'Tungsten Needle Holder',
    slug: 'tungsten-needle-holder',
    description:
      'High-precision medical instrument crafted for extreme durability and sterile hospital performance.',
    image: 'needleHolder',
    category: 'plastic-surgery',
  }),
  // PLACEHOLDER surgical products, so pagination has three pages
  surgical({
    title: 'Cystoscopy Grasping Forceps',
    slug: 'cystoscopy-grasping-forceps',
    description: 'Fine-jaw grasping forceps for flexible and rigid cystoscopy procedures.',
    image: 'forceps',
    category: 'urology',
  }),
  surgical({
    title: 'Lithotripsy Probe Set',
    slug: 'lithotripsy-probe-set',
    description: 'Reusable probe set for intracorporeal stone fragmentation.',
    image: 'electrode',
    category: 'urology',
  }),
  surgical({
    title: 'Ureteral Access Sheath',
    slug: 'ureteral-access-sheath',
    description: 'Hydrophilic-coated sheath for smooth, repeated ureteroscope access.',
    image: 'laparoscope',
    category: 'urology',
  }),
  surgical({
    title: 'Fine Iris Scissors',
    slug: 'fine-iris-scissors',
    description: 'Sharp, delicate scissors for precise soft-tissue work in aesthetic surgery.',
    image: 'scissors',
    category: 'plastic-surgery',
  }),
  surgical({
    title: 'Double Skin Hook Retractor',
    slug: 'double-skin-hook-retractor',
    description: 'Lightweight retractor for gentle skin-flap handling.',
    image: 'needleHolder',
    category: 'plastic-surgery',
  }),
  surgical({
    title: 'Mosquito Hemostat',
    slug: 'mosquito-hemostat',
    description: 'Small curved hemostat for clamping fine vessels.',
    image: 'clamps',
    category: 'general-innovation',
  }),
  surgical({
    title: 'Monopolar Cautery Pencil',
    slug: 'monopolar-cautery-pencil',
    description: 'Hand-switched cautery pencil with a smoke-reducing tip.',
    image: 'electrode',
    category: 'general-innovation',
  }),
  surgical({
    title: 'DeBakey Atraumatic Forceps',
    slug: 'debakey-atraumatic-forceps',
    description: 'Atraumatic tissue forceps for vascular and general procedures.',
    image: 'forceps',
    category: 'general-innovation',
  }),
  // PLACEHOLDER products for the other lines
  {
    title: 'Electric ICU Bed',
    slug: 'electric-icu-bed',
    description: 'Five-function electric bed with side rails and a built-in scale.',
    image: 'lineFurniture',
    line: 'medical-furniture',
    category: 'hospital-beds',
  },
  {
    title: 'Patient Transfer Stretcher',
    slug: 'patient-transfer-stretcher',
    description: 'Height-adjustable stretcher with a radiolucent top.',
    image: 'lineFurniture',
    line: 'medical-furniture',
    category: 'hospital-beds',
  },
  {
    title: 'Examination Couch',
    slug: 'examination-couch',
    description: 'Two-section couch with an adjustable backrest for clinics.',
    image: 'lineFurniture',
    line: 'medical-furniture',
    category: 'examination-procedure',
  },
  {
    title: 'Neuro MRI Analysis Suite',
    slug: 'neuro-mri-analysis-suite',
    description: 'AI-assisted segmentation and volumetry for brain MRI studies.',
    image: 'lineAi',
    line: 'ai-diagnostics',
    category: 'imaging-ai',
  },
  {
    title: 'Hospital Operations Dashboard',
    slug: 'hospital-operations-dashboard',
    description: 'Real-time bed, theatre, and inventory overview for hospital managers.',
    image: 'lineAi',
    line: 'ai-diagnostics',
    category: 'hospital-software',
  },
]

export const partners: { name: string; logo: MediaKey; order: number }[] = [
  { name: 'Miconvey', logo: 'miconvey', order: 1 },
  { name: 'Medicone', logo: 'medicone', order: 2 },
  { name: 'NuLIFEray', logo: 'nuliferay', order: 3 },
  { name: 'DermaVline', logo: 'dermavline', order: 4 },
]

export const faqs = [
  {
    question: 'What medical & surgical products do you distribute?',
    answer:
      'We supply a wide range of specialized surgical tools, urology instruments, sterile plastic surgery solutions, and advanced MedTech software across the MENA region.',
  },
  {
    question: 'How can I request a physical sample or custom demo?',
    answer:
      'Specialists and procurement managers can request on-site clinical demonstrations and sterile trial packages directly via our main Contact form or by calling support.',
  },
  {
    question: 'Do you offer specialized training for your surgical instruments?',
    answer:
      'Yes, all complex medical installations and custom urological software suites come with comprehensive hands-on clinical training conducted by our resident surgical specialist team.',
  },
  {
    question: 'What are your standard shipping and sterile compliance policies?',
    answer:
      'All instruments are packaged and shipped under class-100 sterile compliance protocols. Standard logistics deliver within 48-72 hours across primary regional hospitals.',
  },
]

export const siteSettings = {
  phone: '+20 123 456 789',
  email: 'contact@smartcareco.com',
  whatsappNumber: '20123456789',
  workingHours: 'Sun–Thu 8:00 AM – 5:00 PM',
  address: { street: 'Cairo Medical Hub, Sector 4', city: 'Cairo', country: 'Egypt' },
  mapUrl: 'https://maps.google.com/?q=Cairo,Egypt',
  seo: {
    siteName: 'Smart Care Medical',
    title: 'Smart Care Medical | Surgical Instruments & MedTech Supplier in MENA',
    description:
      'Smart Care Medical supplies hospitals across MENA with surgical instruments, medical furniture, and AI diagnostics software.',
  },
}

export const homePage = {
  hero: {
    title: 'Sustainable Solutions that Enable High-Quality, Cost-Effective Care',
    subtitle: '12+ years supplying hospitals and specialists with high-quality surgical solutions.',
    primaryCtaLabel: 'Explore Products',
    secondaryCtaLabel: 'Request Information',
  },
  about: {
    title: 'The Care You Deserve',
    intro:
      'We supply hospitals and surgical specialists with dependable clinical tools and MedTech infrastructure.',
    // Order matches the bento grid: wide, narrow / narrow, wide / wide, narrow.
    stats: [
      {
        value: '12+',
        label: 'Years of Experience',
        description: 'delivering dependable surgical products and trusted clinical support.',
      },
      { value: '500+', label: 'Hospitals', description: 'rely on our products every day.' },
      {
        value: '4+',
        label: 'Countries Served',
        description: 'serving hospitals across the MENA region.',
      },
      {
        value: '6',
        label: 'Surgical Specialties',
        description: 'supporting surgeons across multiple specialties.',
      },
      {
        value: '100+',
        label: 'Employees',
        description: 'dedicated professionals supporting healthcare providers every day.',
      },
      {
        value: '1,000+',
        label: 'B2C Customers',
        description: 'trusting our products for their healthcare needs.',
      },
    ],
  },
  sections: {
    productLinesTitle: 'Our Product Lines',
    // PLACEHOLDER: not in the design
    productsIntro:
      'Surgical instruments, medical furniture, and AI diagnostics, sourced from trusted manufacturers and supported by our clinical team.',
    partnersTitle: 'Our Partners',
    contactTitle: 'Get In Touch',
    contactIntro:
      'Have a general inquiry, need technical assistance, or want to explore partnership opportunities? Reach out to our team.',
    whatsappLabel: 'Chat on WhatsApp',
  },
}

export const contactPage = {
  hero: { title: "Let's Talk About Your Surgical Needs" },
  intro: {
    eyebrow: 'Direct Assistance',
    title: 'Enterprise Surgical Procurement',
    body: 'Our medical product experts are ready to assist you with instrument customization, volume quotes, and clinic implementation trials.',
    expectTitle: 'What to expect',
    expectations: [
      { text: 'Response within 12 business hours' },
      { text: 'Direct specialist consultation access' },
      { text: 'Custom catalog pricing lists available' },
    ],
  },
  channels: {
    eyebrow: 'Other Ways To Reach Us',
    title: 'Connect Directly with our Medical Units',
    phoneTitle: 'Call Procurement',
    emailTitle: 'Support & Inquiries',
    addressTitle: 'Headquarters',
    emailNote: 'Direct medical queue tracking',
  },
  sections: {
    faqEyebrow: 'Help Center',
    faqTitle: 'Common Inquiries & Direct Answers',
    partnersTitle: 'Surgical Manufacturing Partners & Compliance',
  },
}
