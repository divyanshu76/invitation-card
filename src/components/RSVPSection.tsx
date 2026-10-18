import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, MessageCircle, Check, X, Sparkles, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingData } from '../data/weddingData';
import { SectionDecor } from './decor/SectionDecor';

interface GuestWish {
  id: string;
  name: string;
  city: string;
  message: string;
  likes: number;
  date: string;
}

const DEFAULT_WISHES: GuestWish[] = [
  {
    id: 'w1',
    name: 'Sunil & Neha',
    city: 'Varanasi',
    message: 'To our dearest Vikash and Jyoti! Watching this beautiful union brings immense joy to our hearts. May Mahadev and Parvati Maa shower eternal happiness, peace, and abundance upon you both!',
    likes: 18,
    date: 'Yesterday',
  },
  {
    id: 'w2',
    name: 'Ravi & Priya',
    city: 'Lucknow',
    message: 'Wishing Vikash and Jyoti a lifetime of laughter, mutual respect, and unconditional love. Congratulations to both families on this auspicious new beginning at Maurya Palace!',
    likes: 14,
    date: '2 days ago',
  },
  {
    id: 'w3',
    name: 'Amit Verma',
    city: 'New Delhi',
    message: 'Heartiest congratulations and warmest blessings! May your journey of togetherness be blessed with shared dreams and lifelong joy.',
    likes: 9,
    date: '3 days ago',
  },
];

export const RSVPSection: React.FC = () => {
  // Modals state
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [wishModalOpen, setWishModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // RSVP Form State
  const [guestName, setGuestName] = useState('');
  const [contact, setContact] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'haldi',
    'mehendi',
    'wedding',
    'vidai',
  ]);
  const [guestNote, setGuestNote] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Prevent background body scroll while any modal is open
  useEffect(() => {
    if (rsvpModalOpen || wishModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [rsvpModalOpen, wishModalOpen]);

  // Wishes Form State (Explicitly saved in browser localStorage)
  const [wishes, setWishes] = useState<GuestWish[]>(() => {
    const saved = localStorage.getItem('vikash_jyoti_wishes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_WISHES;
      }
    }
    return DEFAULT_WISHES;
  });

  const [wishAuthor, setWishAuthor] = useState('');
  const [wishCity, setWishCity] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [likedWishIds, setLikedWishIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem('vikash_jyoti_wishes', JSON.stringify(wishes));
  }, [wishes]);

  const triggerCelebrationConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C4A36A', '#DDAFB6', '#542637', '#E5A93C'],
    });
  };

  const handleEventToggle = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    // Save RSVP to local device storage
    const rsvpRecord = {
      name: guestName,
      contact,
      guestCount,
      events: selectedEvents,
      note: guestNote,
      submittedAt: new Date().toISOString(),
    };

    const existingRsvps = JSON.parse(localStorage.getItem('vikash_jyoti_rsvps') || '[]');
    existingRsvps.push(rsvpRecord);
    localStorage.setItem('vikash_jyoti_rsvps', JSON.stringify(existingRsvps));

    setRsvpSubmitted(true);
    triggerCelebrationConfetti();
  };

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishAuthor.trim() || !wishMessage.trim()) return;

    const newWish: GuestWish = {
      id: `w-${Date.now()}`,
      name: wishAuthor.trim(),
      city: wishCity.trim() || 'Well-wisher',
      message: wishMessage.trim(),
      likes: 1,
      date: 'Just now',
    };

    setWishes([newWish, ...wishes]);
    setWishAuthor('');
    setWishCity('');
    setWishMessage('');
    setWishModalOpen(false);
    triggerCelebrationConfetti();
  };

  const handleLikeWish = (wishId: string) => {
    if (likedWishIds[wishId]) return;
    setLikedWishIds({ ...likedWishIds, [wishId]: true });
    setWishes(
      wishes.map((w) => (w.id === wishId ? { ...w, likes: w.likes + 1 } : w))
    );
  };

  // WhatsApp link generator: opens conversation with the couple's official WhatsApp number
  const getWhatsAppUrl = (customText?: string) => {
    const text = customText || weddingData.rsvp.prefilledMessage;
    const phone = weddingData.rsvp.coupleWhatsAppPhone;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const handleCopyMessage = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <section
      id="rsvp"
      style={{
        position: 'relative',
        padding: '110px 0',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid rgba(196, 163, 106, 0.25)',
      }}
      aria-label="RSVP and Wishes"
    >
      <SectionDecor variant="rsvp" />

      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}
        >
          <span className="eyebrow" style={{ marginBottom: '10px' }}>
            YOUR PRESENCE IS OUR GIFT
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            WE WOULD LOVE TO HAVE YOU WITH US
          </h2>
          <div
            style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--accent-gold)',
              margin: '0 auto 16px',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: '1.15rem',
              color: 'var(--accent-gold)',
              marginBottom: '6px',
            }}
          >
            "आपकी उपस्थिति हमारे उत्सव की शोभा बढ़ाएगी"
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-accent)',
            }}
          >
            "Your presence and blessings will make our celebration even more special."
          </p>
        </motion.div>

        {/* 3 Main Functional Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            marginBottom: '70px',
          }}
        >
          {/* 1. YES, I'LL BE THERE */}
          <button
            onClick={() => {
              setRsvpSubmitted(false);
              setRsvpModalOpen(true);
            }}
            className="btn-primary"
            style={{ minWidth: '220px' }}
          >
            <Sparkles size={16} />
            YES, I'LL BE THERE
          </button>

          {/* 2. SEND YOUR WISHES */}
          <button
            onClick={() => setWishModalOpen(true)}
            className="btn-secondary"
            style={{ minWidth: '220px' }}
          >
            <Heart size={16} />
            SEND YOUR WISHES
          </button>

          {/* 3. RSVP ON WHATSAPP */}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ minWidth: '220px' }}
          >
            <MessageCircle size={16} />
            RSVP ON WHATSAPP
          </a>
        </motion.div>

        {/* Guestbook & Wishes Wall */}
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
              borderBottom: '1px solid rgba(196, 163, 106, 0.3)',
              paddingBottom: '14px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  color: 'var(--text-primary)',
                }}
              >
                Warm Wishes &amp; Blessings
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Messages recorded on your device • Shubh Mangal Kaamnaayein
              </span>
            </div>

            <button
              onClick={() => setWishModalOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-gold)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              + Write a Wish
            </button>
          </div>

          {/* Wishes Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {wishes.map((wish) => (
              <div
                key={wish.id}
                className="lux-card lux-edge wish-card"
                style={{
                  padding: '22px 20px',
                  backgroundColor: 'rgba(252, 250, 247, 0.9)',
                  border: '1px solid rgba(196, 163, 106, 0.3)',
                  boxShadow: '0 4px 14px rgba(84, 38, 55, 0.03)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {wish.name}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {wish.city}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.86rem',
                      lineHeight: 1.6,
                      color: 'var(--text-body)',
                      marginBottom: '16px',
                    }}
                  >
                    "{wish.message}"
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(196, 163, 106, 0.2)',
                    paddingTop: '10px',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {wish.date}
                  </span>
                  <button
                    onClick={() => handleLikeWish(wish.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      color: likedWishIds[wish.id] ? 'var(--text-accent)' : 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-sans)',
                    }}
                    title="Send a heart"
                  >
                    <Heart
                      size={13}
                      fill={likedWishIds[wish.id] ? 'var(--text-accent)' : 'none'}
                    />
                    {wish.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      <AnimatePresence>
        {rsvpModalOpen && (
          <div className="modal-overlay" onClick={() => setRsvpModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '500px',
                backgroundColor: '#FCFAF7',
                border: '1px solid rgba(196, 163, 106, 0.45)',
                boxShadow: 'var(--shadow-elevated)',
                padding: '28px 24px',
                borderRadius: 'var(--radius-lg)',
                maxHeight: 'min(90vh, 640px)',
                overflowY: 'auto',
                position: 'relative',
              }}
              className="rsvp-modal-content"
            >
              <button
                onClick={() => setRsvpModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {rsvpSubmitted ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(78, 107, 86, 0.12)',
                      color: 'var(--mehendi-sage)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 14px',
                    }}
                  >
                    <Check size={26} />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.6rem',
                      color: 'var(--text-primary)',
                      marginBottom: '6px',
                    }}
                  >
                    Thank You, {guestName}!
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', marginBottom: '6px', lineHeight: 1.5 }}>
                    Your RSVP has been saved locally on this device. We look forward to celebrating with you at Maurya Palace, Mau!
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    (Stored in your device's browser memory)
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <a
                      href={getWhatsAppUrl(
                        `Namaste Vikash & Jyoti! I just confirmed our attendance on your website:\nName: ${guestName}\nAttendees: ${guestCount}\nEvents: ${selectedEvents.join(', ')}\nLooking forward to celebrating with you at Maurya Palace, Mau!`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp"
                      style={{ width: '100%', padding: '11px 20px', fontSize: '0.76rem' }}
                    >
                      <MessageCircle size={15} />
                      Send Confirmation to WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyMessage(
                          `Namaste Vikash & Jyoti! RSVP confirmation:\nName: ${guestName}\nAttendees: ${guestCount}\nEvents: ${selectedEvents.join(', ')}\nVenue: Maurya Palace, Mau`
                        )
                      }
                      className="btn-secondary"
                      style={{ width: '100%', fontSize: '0.72rem', padding: '10px 18px' }}
                    >
                      <Copy size={13} />
                      {copiedNotification ? 'Copied to Clipboard!' : 'Copy RSVP Details'}
                    </button>

                    <button
                      onClick={() => setRsvpModalOpen(false)}
                      className="btn-secondary"
                      style={{ width: '100%', marginTop: '4px', padding: '9px 18px', fontSize: '0.72rem' }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit}>
                  <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                    <span className="eyebrow" style={{ marginBottom: '4px', fontSize: '0.68rem' }}>
                      KINDLY RESPOND
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.65rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      Celebrate With Us
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                    {/* Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g., Rajesh Kumar"
                        className="input-field"
                        style={{ padding: '9px 14px', fontSize: '0.88rem' }}
                      />
                    </div>

                    {/* Email / Phone */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        Phone Number or Email *
                      </label>
                      <input
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="e.g., +91 98765 43210"
                        className="input-field"
                        style={{ padding: '9px 14px', fontSize: '0.88rem' }}
                      />
                    </div>

                    {/* Guest Count */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        Number of Attendees
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="input-field"
                        style={{ padding: '9px 14px', fontSize: '0.88rem' }}
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4+">4+ Family Members</option>
                      </select>
                    </div>

                    {/* Events Attendance */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Ceremonies You Will Attend
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
                        {weddingData.ceremonies.map((c) => (
                          <label
                            key={c.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.78rem',
                              padding: '7px 9px',
                              background: selectedEvents.includes(c.id) ? 'rgba(196, 163, 106, 0.15)' : '#FCFAF7',
                              border: selectedEvents.includes(c.id) ? '1px solid var(--accent-gold)' : '1px solid rgba(196, 163, 106, 0.28)',
                              borderRadius: 'var(--radius-xs)',
                              cursor: 'pointer',
                              fontWeight: selectedEvents.includes(c.id) ? 600 : 400,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(c.id)}
                              onChange={() => handleEventToggle(c.id)}
                              style={{ accentColor: 'var(--text-primary)' }}
                            />
                            {c.name}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Note to the Couple */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        Blessing or Message (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={guestNote}
                        onChange={(e) => setGuestNote(e.target.value)}
                        placeholder="Write a message for Vikash & Jyoti..."
                        className="input-field"
                        style={{ resize: 'vertical', padding: '9px 14px', fontSize: '0.88rem' }}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '6px', padding: '12px 22px', fontSize: '0.78rem' }}>
                      SUBMIT RSVP
                    </button>
                    <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      (Stored in local device memory)
                    </span>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wishes Modal */}
      <AnimatePresence>
        {wishModalOpen && (
          <div className="modal-overlay" onClick={() => setWishModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="rsvp-modal-content"
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#FCFAF7',
                border: '1px solid rgba(196, 163, 106, 0.45)',
                boxShadow: 'var(--shadow-elevated)',
                padding: '32px 26px',
                borderRadius: 'var(--radius-lg)',
                maxHeight: 'min(90vh, 600px)',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setWishModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <span className="eyebrow" style={{ marginBottom: '6px' }}>
                  BLESSINGS & LOVE
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.75rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  Send Your Wishes
                </h3>
              </div>

              <form onSubmit={handleWishSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={wishAuthor}
                      onChange={(e) => setWishAuthor(e.target.value)}
                      placeholder="e.g., Ankit & Family"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Your City / Relation (Optional)
                    </label>
                    <input
                      type="text"
                      value={wishCity}
                      onChange={(e) => setWishCity(e.target.value)}
                      placeholder="e.g., Mau or Family Friend"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={wishMessage}
                      onChange={(e) => setWishMessage(e.target.value)}
                      placeholder="Write your blessing, memory, or wish for Vikash & Jyoti..."
                      className="input-field"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                    <Send size={15} />
                    POST BLESSING
                  </button>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    (Stored in local device memory)
                  </span>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
