
import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WaveSeparator from './components/WaveSeparator';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import Chatbot from './components/chatbot/Chatbot';
import EvaPhoneDock from './components/eva/EvaPhoneDock';
import EvaSoundHub from './components/eva/EvaSoundHub';
import EvaBubbleButton from './components/eva/EvaBubbleButton';
import EvaMascotCTA from './components/EvaMascotCTA';
import BrandStrip from './components/eva/BrandStrip';
import { WORLD_CUP_SEASON } from './constants/worldCupTheme';
import WorldCupBanner from './components/worldcup/WorldCupBanner';
import WorldCupCountries from './components/worldcup/WorldCupCountries';
import WorldCupPromo from './components/worldcup/WorldCupPromo';
import WorldCupPopup from './components/worldcup/WorldCupPopup';

// Carga diferida de componentes pesados
const TrustBadges = lazy(() => import('./components/TrustBadges'));
const Benefits = lazy(() => import('./components/Benefits'));
const TrustSection = lazy(() => import('./components/TrustSection'));
const QuoteForm = lazy(() => import('./components/QuoteForm'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const OfferButton = lazy(() => import('./components/OfferButton'));
const InsurancePolicies = lazy(() => import('./components/InsurancePolicies'));

const App: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={WORLD_CUP_SEASON ? {
        background: 'linear-gradient(160deg, #080e1a 0%, #0d1628 30%, #0a1a2e 60%, #080e1a 100%)',
        backgroundAttachment: 'fixed',
      } : {
        background: '#F8F9FA',
      }}
    >
      {/* Patrón de grama en toda la página (solo mundial) */}
      {WORLD_CUP_SEASON && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(255,255,255,0.015) 80px, rgba(255,255,255,0.015) 82px)',
            backgroundAttachment: 'fixed',
          }}
        />
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        <EvaSoundHub />
        {WORLD_CUP_SEASON && <WorldCupBanner />}
        <Header />

        <main className="flex-grow">
          <ErrorBoundary>
            <Hero />

            <Suspense fallback={<Loader />}>
              {/* Franja de países mundialistas */}
              {WORLD_CUP_SEASON && <WorldCupCountries />}

              <TrustBadges />
              <EvaMascotCTA />

              {/* Promo mundialista */}
              {WORLD_CUP_SEASON && <WorldCupPromo />}

              <QuoteForm />
              {WORLD_CUP_SEASON
                ? <div className="mx-auto max-w-5xl px-6"><div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" /></div>
                : <WaveSeparator direction="down" fillColor="#F8F9FA" height="80px" />}
              <Benefits />
              <BrandStrip />
              {WORLD_CUP_SEASON
                ? <div className="mx-auto max-w-5xl px-6"><div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" /></div>
                : <WaveSeparator direction="down" fillColor="#212529" height="100px" />}
              <TrustSection />
              <InsurancePolicies />
              {WORLD_CUP_SEASON
                ? <div className="mx-auto max-w-5xl px-6"><div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" /></div>
                : <WaveSeparator direction="down" fillColor="#F8F9FA" height="80px" />}
              <Testimonials />
              <Contact />
            </Suspense>
          </ErrorBoundary>
        </main>

        <Suspense fallback={null}>
          <Footer />
          <OfferButton />
        </Suspense>

        {/* Chatbot dock */}
        <EvaPhoneDock>
          <Chatbot embedded />
        </EvaPhoneDock>
        <EvaBubbleButton />

        {/* Popup mundialista (aparece una vez por sesión) */}
        {WORLD_CUP_SEASON && <WorldCupPopup />}
      </div>

      {/* Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </script>
    </div>
  );
};

export default App;
