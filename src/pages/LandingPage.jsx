import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import Footer from '../components/Footer';

function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleBookAppointment = () => {
    navigate('/appointment');
  };

  return (
    <div>
      <Navigation onLoginClick={handleLogin} />
      <HeroSection onBookAppointment={handleBookAppointment} />
      <AboutSection />
      <ServicesSection />
      <Footer />
    </div>
  );
}

export default LandingPage;
