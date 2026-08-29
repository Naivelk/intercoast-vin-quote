
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
import CountriesStrip from './components/worldcup/WorldCupCountries';
import QuickActions from './components/QuickActions';
import SavingsCalculator from './components/SavingsCalculator';
import MobileActionBar from './components/MobileActionBar';
import IdentityInviteHandler from './components/IdentityInviteHandler';

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
const AdminPanel = lazy(() => import('./components/AdminPanel'));

const App: React.FC = () => {
  return (
    <IdentityInviteHandler><div
      className="min-h-screen flex flex-col"
      style={{ background: '#F8F9FA' }}
    >
      <div className="relative z-10 flex flex-col min-h-screen">
        {(window.location.pathname === '/admin' || window.location.pathname === '/admin/') ? <Suspense fallback={<Loader />}><AdminPanel /></Suspense> : <>
        <EvaSoundHub />
        <Header />

        <main className="flex-grow">
          <ErrorBoundary>
            <Hero />
            {/* La franja de comunidades es lo primero que ve el visitante al terminar el hero. */}
            <CountriesStrip />

            <QuickActions />

            <Suspense fallback={<Loader />}>
              <TrustBadges />
              <EvaMascotCTA />

              <QuoteForm />
              <SavingsCalculator />
              <WaveSeparator direction="down" fillColor="#F8F9FA" height="80px" />
              <Benefits />
              <BrandStrip />
              <WaveSeparator direction="down" fillColor="#212529" height="100px" />
              <TrustSection />
              <InsurancePolicies />
              <WaveSeparator direction="down" fillColor="#F8F9FA" height="80px" />
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
        <MobileActionBar />
        </>}
      </div>
    </div></IdentityInviteHandler>
  );
};

export default App;
