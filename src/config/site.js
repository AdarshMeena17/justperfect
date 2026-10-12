// Central site configuration. Fill the empty values when you have them.
// Nothing here is invented: empty string = "not configured yet" and the UI degrades gracefully.
export const site = {
  name: 'JUSTPERFECT',
  location: 'Indore, Madhya Pradesh, India',
  city: 'Indore',
  clientsReported: '25+', // as reported by the creators
  tools: ['Adobe After Effects', 'DaVinci Resolve'],

  // Phone for WhatsApp: digits only, WITH country code, e.g. '919XXXXXXXXX'
  phone: '',
  // Human-readable phone shown in the footer, e.g. '+91 9XXXX XXXXX'
  phoneDisplay: '',
  email: '',

  instagram: {
    harshit: '', // full URL, e.g. 'https://instagram.com/...'
    deepesh: '',
  },

  founders: [
      { id: 'harshit', name: 'Harshit Thakur', initials: 'HT', treatment: 'The Creative Eye', portrait: '/images/harshit.jpeg' },
    { id: 'deepesh', name: 'Deepesh Solanki', initials: 'DS', treatment: 'The Frame Maker', portrait: '/images/deepesh.jpeg' },
    // portrait: '/images/harshit.jpg' -> replaces the procedural panel, no layout change needed
  ],
};

export const nav = [
  { label: 'Work', id: 'work' },
  { label: 'Services', id: 'services' },
  { label: 'The Duo', id: 'duo' },
  { label: 'Contact', id: 'contact' },
];
