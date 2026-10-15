  /**
 * CENTRALIZED WEDDING DATA CONFIGURATION
 * Wedding: VIKASH WEDS JYOTI
 * Venue: Maurya Palace, Mau, Uttar Pradesh
 * Date: 20 November 2026
 */

export interface VenueContact {
  role: string;
  name: string;
  phone: string;
  formattedPhone: string;
}

export interface Ceremony {
  id: string;
  name: string;
  hindiName?: string;
  tagline: string;
  hindiTagline?: string;
  dateStr: string; // ISO date for calculation (YYYY-MM-DD)
  displayDate: string;
  time?: string; // Optional time; if undefined or empty, shows "समय शीघ्र साझा किया जाएगा / Time to be announced"
  timeGracefulLabel: string;
  venueName: string;
  venueAddress: string;
  description: string;
  image: string;
  accentColor: string;
  badgeText: string;
  directionsUrl: string;
}

export interface WeddingConfig {
  brideName: string;
  groomName: string;
  coupleInitials: string;
  monogram: string;
  eyebrow: string;
  subtitle: string;
  hindiSubtitle: string;
  weddingBlessing: string;
  
  // Divine blessings
  divineBlessingHeading: string;
  divineBlessingText: string;
  divineBlessingMantra: string;

  // Ganesh Blessing
  ganeshBlessing: {
    heading: string;
    subheading: string;
    shloka: string;
    hindiText: string;
    image: string;
  };

  // Audio Configuration
  audio: {
    trackTitle: string;
    sourceUrl: string;
    fallbackUrl?: string;
  };

  // Wedding Date & Time for Countdown
  weddingDateTime: string; // ISO format with timezone
  weddingTimezone: string; // Asia/Kolkata
  formattedWeddingDate: string;
  cityLocation: string;

  // Venue Details
  venue: {
    name: string;
    description: string;
    addressHindi: string;
    addressEnglish: string;
    city: string;
    state: string;
    pincode: string;
    mapQuery: string;
    mapEmbedUrl: string;
    directionsUrl: string;
    contacts: VenueContact[];
  };

  // Couple Story (Generic, respectful, no invented biographies)
  story: {
    heading: string;
    hindiHeading: string;
    supportingText: string;
    hindiSupportingText: string;
    welcomeMessage: string;
    images: {
      hands: string;
      varmala: string;
    };
  };

  // 4 Main Ceremonies
  ceremonies: Ceremony[];

  // RSVP Configuration (Separate from venue numbers)
  rsvp: {
    coupleWhatsAppPhone?: string; // Official couple WhatsApp; separate from venue contacts
    displayWhatsAppPhone?: string;
    prefilledMessage: string;
  };

  // Closing Section
  closingQuote: string;
  hindiClosing: string;
  closingFamilyNote: string;
}

export const weddingData: WeddingConfig = {
  groomName: "Vikash",
  brideName: "Jyoti",
  coupleInitials: "V & J",
  monogram: "V ✤ J",
  eyebrow: "TOGETHER WITH OUR FAMILIES",
  subtitle: "Two hearts, two families, one beautiful beginning.",
  hindiSubtitle: "दो दिल, दो परिवार, एक नए सफर की शुरुआत।",
  weddingBlessing: "॥ श्री गणेशाय नमः ॥",

  divineBlessingHeading: "WITH DIVINE BLESSINGS",
  divineBlessingText: "भगवान शिव एवं माता पार्वती के आशीर्वाद से हमारे जीवन का यह शुभ मिलन मंगलमय हो।",
  divineBlessingMantra: "कर्पूरगौरं करुणावतारं संसारसारम् भुजगेन्द्रहारम् । सदावसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि ॥",

  // Countdown Target: 20 November 2026, 00:00 Asia/Kolkata
  weddingDateTime: "2026-11-20T00:00:00+05:30",
  weddingTimezone: "Asia/Kolkata",
  formattedWeddingDate: "Friday, 20th November 2026",
  cityLocation: "Mau, Uttar Pradesh",

  venue: {
    name: "MAURYA PALACE",
    description: "Marriage Hall • AC Rooms Available • Birthday Parties • Meeting Hall",
    addressHindi: "बघपुर, निकट एयरटेल टावर, मऊ – 275101",
    addressEnglish: "Baghpur, Near Airtel Tower, Mau – 275101, Uttar Pradesh, India",
    city: "Mau",
    state: "Uttar Pradesh",
    pincode: "275101",
    mapQuery: "Maurya Palace Baghpur Mau Uttar Pradesh 275101",
    // Reliable address-based Google Maps embed
    mapEmbedUrl: "https://maps.google.com/maps?q=Maurya+Palace+Baghpur+Mau+Uttar+Pradesh+275101&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Maurya+Palace+Baghpur+Mau+275101",
    contacts: [
      {
        role: "Proprietor",
        name: "Arun Kumar Maurya",
        phone: "7007318203",
        formattedPhone: "+91 70073 18203",
      },
      {
        role: "Contact",
        name: "Ramanuj Maurya",
        phone: "9839723650",
        formattedPhone: "+91 98397 23650",
      },
    ],
  },

  // Ganesh Blessing Invocation
  ganeshBlessing: {
    heading: "॥ श्री गणेशाय नमः ॥",
    subheading: "With the blessings of Lord Ganesha",
    shloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    hindiText: "विघ्नहर्ता भगवान श्री गणेश के पावन आशीर्वाद से हमारे वैवाहिक जीवन का यह शुभ शुभारंभ मंगलमय हो।",
    image: "/images/ganesh.jpg",
  },

  // Audio Experience Configuration (Devotional Krishna Flute Instrumental)
  audio: {
    trackTitle: "Peaceful Krishna Flute Instrumental",
    sourceUrl: "/audio/Krishna%20Flute.mp3",
    fallbackUrl: "/audio/krishna-flute.mp3",
  },

  // Couple Story (Authentic wedding welcome, no invented biographies)
  story: {
    heading: "THE BEGINNING OF FOREVER",
    hindiHeading: "एक नए सफर की शुरुआत",
    supportingText: "Some moments bring families closer, hearts together, and a beautiful new chapter to life. With the blessings of our loved ones, we invite you to celebrate the beginning of our forever.",
    hindiSupportingText: "अपनों के स्नेह और बड़ों के आशीर्वाद के साथ, हम अपने जीवन के इस नए अध्याय की शुरुआत करने जा रहे हैं। हमारी खुशियों के इस खास अवसर पर आपकी उपस्थिति और शुभकामनाएँ हमारे लिए अनमोल हैं।",
    welcomeMessage: "Some moments bring families closer, hearts together, and a beautiful new chapter to life. With the blessings of our loved ones, we invite you to celebrate the beginning of our forever.",
    images: {
      hands: "/images/story_hands.jpg",
      varmala: "/images/story_varmala.jpg",
    },
  },

  ceremonies: [
    {
      id: "haldi",
      name: "Haldi Ceremony",
      hindiName: "हल्दी रस्म",
      tagline: "Golden Moments, Joyful Beginnings",
      hindiTagline: "हल्दी की खुशियों और अपनों के साथ एक मंगलमय शुरुआत।",
      dateStr: "2026-11-18",
      displayDate: "18 November 2026",
      time: undefined, // Explicitly not invented
      timeGracefulLabel: "समय शीघ्र साझा किया जाएगा (Time to be announced)",
      venueName: "Chhitauni",
      venueAddress: "Near Malipur, Belthara Road, Uttar Pradesh, India",
      description: "An auspicious ceremony of golden turmeric, fragrant blossoms, laughter, and blessings as we begin our wedding festivities.",
      image: "/images/haldi.jpg",
      accentColor: "#D49024",
      badgeText: "AUSPICIOUS RITUAL",
      directionsUrl: "https://www.google.com/maps/search/?api=1&query=Chhitauni+Near+Malipur+Belthara+Road+Uttar+Pradesh+India",
    },
    {
      id: "mehendi",
      name: "Mehendi Ceremony",
      hindiName: "मेहंदी उत्सव",
      tagline: "Little Details, Beautiful Memories",
      hindiTagline: "हाथों में मेहंदी, दिल में खुशियाँ और साथ अपनों का।",
      dateStr: "2026-11-19",
      displayDate: "19 November 2026",
      time: undefined, // Explicitly not invented
      timeGracefulLabel: "समय शीघ्र साझा किया जाएगा (Time to be announced)",
      venueName: "Chhitauni",
      venueAddress: "Near Malipur, Belthara Road, Uttar Pradesh, India",
      description: "A joyous celebration adorned with intricate henna art, cheerful melodies, festive colors, and cherished moments with loved ones.",
      image: "/images/mehendi.jpg",
      accentColor: "#4E6B56",
      badgeText: "HENNA & CELEBRATION",
      directionsUrl: "https://www.google.com/maps/search/?api=1&query=Chhitauni+Near+Malipur+Belthara+Road+Uttar+Pradesh+India",
    },
    {
      id: "wedding",
      name: "Shaadi / Wedding",
      hindiName: "शुभ विवाह",
      tagline: "The Day Our Forever Begins",
      hindiTagline: "शुभ विवाह — दो जीवन, एक खूबसूरत सफर।",
      dateStr: "2026-11-20",
      displayDate: "20 November 2026",
      time: undefined, // Explicitly not invented
      timeGracefulLabel: "समय शीघ्र साझा किया जाएगा (Time to be announced)",
      venueName: "Maurya Palace",
      venueAddress: "Baghpur, Near Airtel Tower, Mau – 275101",
      description: "The sacred union where two souls pledge seven eternal vows around the holy agni, embarking upon a lifetime of shared joy, companionship, and devotion.",
      image: "/images/wedding.jpg",
      accentColor: "#702D43",
      badgeText: "THE SACRED PHERAS",
      directionsUrl: "https://www.google.com/maps/search/?api=1&query=Maurya+Palace+Baghpur+Mau+275101",
    },
    {
      id: "vidai",
      name: "Vidai Ceremony",
      hindiName: "विदाई समारोह",
      tagline: "New Beginnings, Endless Blessings",
      hindiTagline: "नई राहों पर खुशियों और आशीर्वाद के साथ।",
      dateStr: "2026-11-21",
      displayDate: "21 November 2026",
      time: undefined, // Explicitly not invented
      timeGracefulLabel: "समय शीघ्र साझा किया जाएगा (Time to be announced)",
      venueName: "Maurya Palace",
      venueAddress: "Baghpur, Near Airtel Tower, Mau – 275101",
      description: "A tender, heartfelt moment of new beginnings and fond embraces, accompanied by the unconditional blessings of parents and family.",
      image: "/images/vidai.jpg",
      accentColor: "#B27382",
      badgeText: "A GRACEFUL FAREWELL",
      directionsUrl: "https://www.google.com/maps/search/?api=1&query=Maurya+Palace+Baghpur+Mau+275101",
    },
  ],

  rsvp: {
    // Official couple RSVP WhatsApp number: +91 9170011192 (International format: 919170011192)
    coupleWhatsAppPhone: "919170011192",
    displayWhatsAppPhone: "+91 91700 11192",
    prefilledMessage: "Namaste! Main Vikash aur Jyoti ki shaadi ke invitation ke sambandh mein sampark kar raha/rahi hoon.",
  },

  closingQuote: "Together, always and forever.",
  hindiClosing: "आपका स्नेह और आशीर्वाद हमारे लिए अनमोल है।",
  closingFamilyNote: "With love, blessings, and warm regards from both our families.",
};

/**
 * Helper to compute weekday name directly from an ISO date string (YYYY-MM-DD)
 */
export function getWeekdayName(dateStr: string): string {
  // Use noon to avoid any timezone edge date shifts
  const d = new Date(`${dateStr}T12:00:00Z`);
  return d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
}
