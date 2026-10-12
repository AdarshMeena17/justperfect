// ─────────────────────────────────────────────────────────────────────────────
// MEDIA MANIFEST — the only place portfolio files are referenced.
//
// To go live with a real clip, edit ONE entry:
//   src:    '/media/events/evt-01.mp4'      (H.264 MP4)
//   srcWebm:'/media/events/evt-01.webm'     (optional)
//   poster: '/posters/evt-01.jpg'
//   title / description / alt as appropriate.
// Leave src/poster as null to keep the generated placeholder artwork.
// Every entry below is a PLACEHOLDER, not client work.
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES = ['Events', 'Influencer', 'Business', 'Weddings', 'Basic Edits', 'Gym & Sports'];

const item = (
  id,
  category,
  title,
  orientation,
  tone,
  src = null
) => ({
  id,
  title,
  category,
  orientation,
  tone,

  src,
  srcWebm: null,
  poster: src
    ? `/posters/${src.split('/').slice(-2).join('-').replace(/\.[^.]+$/, '.jpg')}`
    : null,

  description: src
    ? `${title} — JUSTPERFECT portfolio`
    : 'Placeholder card. Real footage will be added here.',
  alt: src ? title : `${title} (placeholder)`,
});


export const media = [

  item(
  'evt-01',
  'Events',
  'Event Highlight 01',
  'portrait',
  3,
  '/media/events/T1.mp4'

),
item(
  'evt-02',
  'Events',
  'Event Highlight 02',
  'portrait',
  3,
  '/media/events/T2.mp4'

),item(
  'evt-03',
  'Events',
  'Event Highlight 03',
  'portrait',
  3,
  '/media/events/S.mp4'

),item(
  'evt-04',
  'Events',
  'Event Highlight 04',
  'portrait',
  3,
  '/media/events/TED.mp4'

),item(
  'evt-05',
  'Events',
  'Event Highlight 05',
  'portrait',
  3,
  '/media/events/GC.mp4'

),item(
  'evt-06',
  'Events',
  'Event Highlight 06',
  'portrait',
  3,
  '/media/events/GYM.mp4'

),item(
  'evt-07',
  'Events',
  'Event Highlight 07',
  'portrait',
  3,
  '/media/events/T3.mp4'

),
  item(
  'inf-01',
  'Influencer',
  'Creator Film 01',
  'portrait',
  1,
  '/media/influencer/1.mp4'
),

item(
  'inf-02',
  'Influencer',
  'Creator Film 02',
  'portrait',
  3,
  '/media/influencer/2.mp4'
),

item(
  'inf-03',
  'Influencer',
  'Creator Film 03',
  'portrait',
  2,
  '/media/influencer/3.mp4'
),
item(
  'inf-04',
  'Influencer',
  'Creator Film 04',
  'portrait',
  3,
  '/media/influencer/4.mp4'
),

item(
  'inf-05',
  'Influencer',
  'Creator Film 05',
  'portrait',
  1,
  '/media/influencer/5.mp4'
),
item(
  'wed-01',
  'Weddings',
  'Wedding Reel 01',
  'portrait',
  3,
  '/media/wedding/01.mp4'

),

item(
  'wed-02',
  'Weddings',
  'Wedding Reel 02',
  'portrait',
  1,
  '/media/wedding/02.mp4'

),item(
  'wed-03',
  'Weddings',
  'Wedding Reel 03',
  'portrait',
  3,
  '/media/wedding/03.mp4'

), item(
  'bus-01',
  'Business',
  'Brand Reel 01',
  'portrait',
  3,
  '/media/business/B1.mp4'

),
item(
  'bus-02',
  'Business',
  'Brand Reel 02',
  'portrait',
  3,
  '/media/business/B2.mp4'

),
item(
  'gym-01',
  'Gym & Sports',
  'Gym Reel 01',
  'portrait',
  0,
  '/media/gym-sports/GS1.mp4'
),
item(
  'gym-02',
  'Gym & Sports',
  'Gym Reel 02',
  'portrait',
  0,
  '/media/gym-sports/GS2.mp4'
),
item(
  'gym-03',
  'Gym & Sports',
  'Gym Reel 03',
  'portrait',
  0,
  '/media/gym-sports/GS3.mp4'
),
item(
  'gym-04',
  'Gym & Sports',
  'Gym Reel 04',
  'portrait',
  0,
  '/media/gym-sports/GS4.mp4'
),
item(
  'gym-05',
  'Gym & Sports',
  'Gym Reel 05',
  'portrait',
  0,
  '/media/gym-sports/GS5.mp4'
),
item(
  'edt-01',
  'Basic Edits',
  'Edit Study 01',
  'landscape',
  1,
  '/media/basic-edits/BE1.mp4'
),
item(
  'edt-02',
  'Basic Edits',
  'Edit Study 02',
  'portrait',
  3,
  '/media/basic-edits/BE2.mp4'
),
item(
  'edt-03',
  'Basic Edits',
  'Edit Study 03',
  'landscape',
  1,
  '/media/basic-edits/BE3.mp4'
),
item(
  'edt-04',
  'Basic Edits',
  'Edit Study 04',
  'landscape',
  1,
  '/media/basic-edits/BE4.mp4'
),
item(
  'edt-05',
  'Basic Edits',
  'Edit Study 05',
  'landscape',
  1,
  '/media/basic-edits/BE5.mp4'
),
item(
  'edt-06',
  'Basic Edits',
  'Edit Study 06',
  'landscape',
  1,
  '/media/basic-edits/BE6.mp4'
),






  
];

// Order shown in the infinite marquee (ids from `media`)
export const marqueeIds = ['evt-01', 'inf-01', 'bus-01', 'wed-01', 'gym-01', 'edt-01', 'evt-02', 'inf-02', 'bus-02', 'wed-02', 'gym-02', 'edt-02'];

export const marqueeItems = marqueeIds.map((id) => media.find((m) => m.id === id)).filter(Boolean);
