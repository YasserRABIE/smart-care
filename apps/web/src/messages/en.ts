/**
 * Fixed UI text that is not content (content lives in the CMS). Kept in one place so it can move
 * to next-intl when Arabic is added.
 */
export const messages = {
  common: {
    home: 'Home',
    products: 'Products',
    sendInquiry: 'Send Inquiry',
    opensInNewTab: '(opens in a new tab)',
  },
  catalog: {
    searchLabel: 'Search products',
    resultsCount: (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`,
    emptyTitle: 'No products found',
    emptyWithQuery: (query: string) => `Nothing matches “${query}”. Try another search term.`,
    emptyCategory: 'There are no products in this category yet.',
    clearFilters: 'Clear filters',
  },
  form: {
    title: 'Send us a Message',
    name: 'Full Name',
    namePlaceholder: 'Ahmed Ali',
    email: 'Email Address',
    emailPlaceholder: 'ahmed@example.com',
    subject: 'Subject',
    subjectPlaceholder: 'How can we help you?',
    message: 'Message',
    messagePlaceholder: 'Type your message here...',
    intro: 'Fill this in and we will open WhatsApp with your message ready to send.',
    submit: 'Send via WhatsApp',
    about: 'About',
    removeProduct: 'Remove product from inquiry',
    openedTitle: 'Continue in WhatsApp',
    openedBody: 'We opened WhatsApp with your message ready. Press send there to reach our team.',
    openAgain: 'Open WhatsApp',
    editMessage: 'Edit message',
    startNew: 'Start a new message',
  },
  contact: {
    openMap: 'Open in Google Maps',
    mapTitle: 'Map showing the Smart Care Medical office',
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has moved.',
    backHome: 'Back to home',
    browseProducts: 'Browse products',
  },
  error: {
    title: 'Something went wrong',
    description: 'Please try again. If the problem continues, contact us by phone or email.',
    retry: 'Try again',
  },
} as const
