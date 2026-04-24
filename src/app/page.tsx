'use client';

import React from 'react';
import LandingNav from '@/components/layout/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import PricingSection from '@/components/landing/PricingSection';
import LandingFooter from '@/components/layout/LandingFooter';
import HowItWorks from '@/components/landing/HowItWorks';
import CookieConsent from '@/components/ui/CookieConsent';

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen selection:bg-blue-100 selection:text-blue-600">
      <LandingNav />
      <HeroSection />
      <HowItWorks />
      <BenefitsSection />
      <PricingSection />
      <LandingFooter />
      <CookieConsent />
    </div>
  );
}