import React from 'react';

// Hero Section Component
export const HeroSection = ({ id, content, styles }) => {
  const alignClass = content.align === 'center' ? 'text-center items-center' : 'text-left items-start';
  const hasImage = !!content.imageUrl;

  return (
    <section id={id} className="py-20 px-6 md:px-12 bg-bg text-text transition-colors duration-300">
      <div className={`max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center justify-between`}>
        <div className={`flex flex-col flex-1 ${alignClass} gap-6`}>
          {content.tagline && (
            <span className="text-primary font-semibold text-sm tracking-wider uppercase bg-primary/10 px-3 py-1 rounded-custom">
              {content.tagline}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-custom leading-tight">
            {content.title || 'Draft Heading'}
          </h1>
          <p className="text-text-muted text-lg max-w-2xl font-light">
            {content.description || 'Provide details about your page here.'}
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            {content.primaryCtaText && (
              <a
                href={content.primaryCtaLink || '#'}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-custom shadow-lg shadow-primary/20 transition-all active:scale-95 duration-200"
              >
                {content.primaryCtaText}
              </a>
            )}
            {content.secondaryCtaText && (
              <a
                href={content.secondaryCtaLink || '#'}
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:bg-bg-alt text-text font-medium rounded-custom transition-all duration-200"
              >
                {content.secondaryCtaText}
              </a>
            )}
          </div>
        </div>
        
        {hasImage && (
          <div className="flex-1 w-full max-w-lg">
            <img
              src={content.imageUrl}
              alt={content.title}
              className="w-full h-auto object-cover rounded-custom shadow-2xl border border-gray-100 dark:border-gray-800"
            />
          </div>
        )}
      </div>
    </section>
  );
};

// Features Section Component
export const FeaturesSection = ({ id, content, styles }) => {
  const cols = content.columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  return (
    <section id={id} className="py-20 px-6 md:px-12 bg-bg-alt text-text transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
          {content.tagline && (
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">
              {content.tagline}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-bold font-custom">{content.title || 'Our Features'}</h2>
          <p className="text-text-muted">{content.description}</p>
        </div>

        <div className={`grid grid-cols-1 ${cols} gap-8`}>
          {(content.items || []).map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-bg border border-gray-100 dark:border-gray-800 rounded-custom shadow-md hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-custom flex items-center justify-center text-primary text-2xl">
                {item.icon || '🚀'}
              </div>
              <h3 className="text-xl font-semibold font-custom">{item.title || 'Feature Title'}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{item.description || 'Feature details.'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section Component
export const PricingSection = ({ id, content, styles }) => {
  return (
    <section id={id} className="py-20 px-6 md:px-12 bg-bg text-text transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-bold font-custom">{content.title || 'Flexible Pricing Plans'}</h2>
          <p className="text-text-muted">{content.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {(content.plans || []).map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-custom flex flex-col justify-between transition-all duration-300 relative border ${
                plan.popular
                  ? 'bg-bg shadow-2xl border-primary scale-105 z-10'
                  : 'bg-bg-alt border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                  Most Popular
                </span>
              )}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-text uppercase tracking-wider">{plan.title}</h3>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-4xl font-extrabold font-custom">{plan.price}</span>
                  {plan.period && <span className="text-text-muted text-sm">{plan.period}</span>}
                </div>
                <p className="text-text-muted text-sm mb-4">{plan.description}</p>
                
                <ul className="flex flex-col gap-3 mb-8">
                  {(plan.features || []).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-sm text-text">
                      <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-3 px-4 font-semibold rounded-custom transition-all duration-200 active:scale-95 ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20'
                    : 'bg-white border border-gray-300 dark:border-gray-700 hover:bg-gray-50 text-text'
                }`}
              >
                {plan.buttonText || 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Section Component
export const ContactSection = ({ id, content, styles }) => {
  const isGrid = content.layout === 'grid';
  const containerClass = isGrid ? 'md:grid-cols-2 gap-12' : 'max-w-2xl mx-auto gap-8';

  return (
    <section id={id} className="py-20 px-6 md:px-12 bg-bg-alt text-text transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-bold font-custom">{content.title || 'Get In Touch'}</h2>
          <p className="text-text-muted">{content.description}</p>
        </div>

        <div className={`grid grid-cols-1 ${containerClass}`}>
          {/* Form Card */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="p-8 bg-bg rounded-custom border border-gray-100 dark:border-gray-800 shadow-md flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-text uppercase">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="px-4 py-3 bg-bg-alt border border-gray-200 dark:border-gray-800 rounded-custom text-text focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-text uppercase">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="px-4 py-3 bg-bg-alt border border-gray-200 dark:border-gray-800 rounded-custom text-text focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-text uppercase">Message</label>
              <textarea
                rows="4"
                placeholder="Tell us about your project..."
                className="px-4 py-3 bg-bg-alt border border-gray-200 dark:border-gray-800 rounded-custom text-text focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              ></textarea>
            </div>
            <button className="py-3 px-6 bg-primary hover:bg-primary-hover text-white font-semibold rounded-custom transition-all duration-200 shadow-md active:scale-95">
              {content.buttonText || 'Send Message'}
            </button>
          </form>

          {/* Info Card (only shown in grid layout) */}
          {isGrid && (
            <div className="flex flex-col justify-center gap-8 lg:px-8">
              <h3 className="text-2xl font-bold font-custom">{content.infoTitle || 'Contact Details'}</h3>
              <p className="text-text-muted">{content.infoDescription}</p>
              <div className="flex flex-col gap-4">
                {content.phone && (
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-custom bg-primary/10 flex items-center justify-center text-primary text-xl">📞</span>
                    <div>
                      <h4 className="text-xs text-text-muted font-bold uppercase">Phone</h4>
                      <p className="text-text font-medium">{content.phone}</p>
                    </div>
                  </div>
                )}
                {content.email && (
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-custom bg-primary/10 flex items-center justify-center text-primary text-xl">✉️</span>
                    <div>
                      <h4 className="text-xs text-text-muted font-bold uppercase">Email</h4>
                      <p className="text-text font-medium">{content.email}</p>
                    </div>
                  </div>
                )}
                {content.address && (
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-custom bg-primary/10 flex items-center justify-center text-primary text-xl">📍</span>
                    <div>
                      <h4 className="text-xs text-text-muted font-bold uppercase">Office</h4>
                      <p className="text-text font-medium">{content.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Gallery Section Component
export const GallerySection = ({ id, content, styles }) => {
  return (
    <section id={id} className="py-20 px-6 md:px-12 bg-bg text-text transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-bold font-custom">{content.title || 'Visual Gallery'}</h2>
          <p className="text-text-muted">{content.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(content.images || []).map((img, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-custom shadow-md hover:shadow-2xl transition-all duration-300 relative aspect-video bg-gray-100 dark:bg-gray-800"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <h4 className="text-lg font-bold font-custom">{img.title}</h4>
                <p className="text-xs text-gray-300 mt-1">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
