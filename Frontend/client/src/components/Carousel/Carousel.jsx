import { useState, useEffect } from 'react';

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1574943320219-553eb22ea631?w=1920&q=80',
      title: 'Modern Tractor Ploughing',
      subtitle: 'Advanced rotavator and tractor equipment for efficient soil preparation',
      badge: '🚜 Equipment',
    },
    {
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80',
      title: 'Bountiful Harvest',
      subtitle: 'Farmers achieving higher crop yields with modern farming techniques',
      badge: '🌾 Harvest',
    },
    {
      image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=1920&q=80',
      title: 'Crop Protection',
      subtitle: 'Professional pesticide spraying to protect crops from pests and diseases',
      badge: '🛡️ Protection',
    },
    {
      image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=1920&q=80',
      title: 'Fertilizer Application',
      subtitle: 'Scientific fertilizer usage for healthy crop growth and maximum productivity',
      badge: '🌱 Nutrition',
    },
    {
      image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=80',
      title: 'Smart Irrigation',
      subtitle: 'Water-efficient irrigation systems for sustainable farming practices',
      badge: '💧 Irrigation',
    },
    {
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80',
      title: 'Seed Planting',
      subtitle: 'Precision planting techniques for better germination and crop spacing',
      badge: '🌿 Planting',
    },
    {
      image: 'https://images.unsplash.com/photo-1530857842417-5e12a7f6b5ec?w=1920&q=80',
      title: 'Organic Farming',
      subtitle: 'Sustainable organic practices for eco-friendly agriculture',
      badge: '🍃 Organic',
    },
    {
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80',
      title: 'Farm Mechanization',
      subtitle: 'Complete farm mechanization solutions from sowing to harvesting',
      badge: '⚙️ Machinery',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[700px] md:h-[800px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[5000ms] ease-out"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)'
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <span className="text-2xl">{slide.badge.split(' ')[0]}</span>
              <span className="text-white font-semibold">{slide.badge.split(' ').slice(1).join(' ')}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl max-w-5xl leading-tight">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl drop-shadow-lg leading-relaxed">
              {slide.subtitle}
            </p>

            {/* CTA Button */}
            <button className="group px-10 py-4 bg-green-600 text-white rounded-full text-lg font-semibold hover:bg-green-700 shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-105 flex items-center gap-3">
              Get Started
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Slide Counter */}
          <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
            <span className="text-white font-bold text-lg">
              {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      ))}

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-4 rounded-full transition-all hover:scale-110 border border-white/30 shadow-2xl"
        aria-label="Previous slide"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-4 rounded-full transition-all hover:scale-110 border border-white/30 shadow-2xl"
        aria-label="Next slide"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-green-500 w-12 shadow-lg shadow-green-500/50'
                : 'bg-white/50 hover:bg-white/75 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
        <div 
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default Carousel;
