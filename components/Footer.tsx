import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { FacebookIcon, InstagramIcon, GoogleIcon, TiktokIcon, StarIcon, PhoneCallIcon, MessageSquareIcon, MapPinIcon } from './icons';
import { WORLD_CUP_SEASON } from '../constants/worldCupTheme';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { href: '#benefits',     label: t('footer.navBenefits') },
    { href: '#quote-form',   label: t('footer.navQuote') },
    { href: '#policies',     label: t('nav.services') },
    { href: '#testimonials', label: t('nav.testimonials') },
    { href: '#contact',      label: t('footer.navContact') },
  ];

  const socials = [
    { icon: <FacebookIcon className="h-5 w-5" />, url: 'https://facebook.com',                 label: 'Facebook' },
    { icon: <InstagramIcon className="h-5 w-5" />, url: 'https://instagram.com',               label: 'Instagram' },
    { icon: <GoogleIcon    className="h-5 w-5" />, url: 'https://g.page/intercoast-insurance', label: 'Google' },
    { icon: <TiktokIcon    className="h-5 w-5" />, url: 'https://tiktok.com',                  label: 'TikTok' },
  ];

  return (
    <footer style={{ background: WORLD_CUP_SEASON ? '#060c18' : '#0f172a' }}>

      {/* Línea decorativa superior dorada */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #FFD700 30%, #FFA500 70%, transparent)' }} />

      <div className="container mx-auto px-8 max-w-6xl py-10">
        {/* ── 3 columnas ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>

          {/* Columna 1: Marca */}
          <div>
            <img
              src="/logo.png"
              alt="Intercoast Insurance"
              style={{ height: 48, width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: 12 }}
            />
            <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, maxWidth: 220 }}>
              {t('footer.tagline')}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{ color: '#475569' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#fff')}
                  onMouseOut={e => (e.currentTarget.style.color = '#475569')}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
              Navegación
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={(e) => handleNav(e, l.href)}
                  style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#fff')}
                  onMouseOut={e => (e.currentTarget.style.color = '#64748b')}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
              Contacto
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="tel:+15623812012"
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: 13, textDecoration: 'none' }}>
                <PhoneCallIcon className="h-4 w-4" style={{ color: '#FFD700', flexShrink: 0 }} />
                (562) 381-2012
              </a>
              <a href="https://wa.me/17756754559" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>
                <MessageSquareIcon className="h-4 w-4" style={{ color: '#4ade80', flexShrink: 0 }} />
                WhatsApp: (775) 675-4559
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13 }}>
                <MapPinIcon className="h-4 w-4" style={{ color: '#94a3b8', flexShrink: 0 }} />
                California, USA
              </div>
              <a href="https://g.page/intercoast-insurance/review" target="_blank" rel="noopener noreferrer"
                style={{
                  marginTop: 4,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)',
                  color: '#FFD700', borderRadius: 999, padding: '6px 14px',
                  fontSize: 12, fontWeight: 600, textDecoration: 'none', width: 'fit-content'
                }}>
                <StarIcon className="h-3.5 w-3.5" />
                Déjanos una reseña en Google
              </a>
            </div>
          </div>

        </div>

        {/* Divisor */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '28px 0 18px' }} />

        {/* Barra inferior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ color: '#334155', fontSize: 12 }}>
            © {new Date().getFullYear()} Intercoast Insurance. Todos los derechos reservados.
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{t('footer.termsOfService')}</a>
            <a href="#" style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{t('footer.navPrivacy')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
