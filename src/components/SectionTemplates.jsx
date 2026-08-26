import React from 'react';

// Hero Section Component
export const HeroSection = ({ id, content, styles }) => {
  const isCentered = content.align === 'center';
  const containerClass = isCentered 
    ? 'flex-col text-center items-center max-w-4xl text-center' 
    : 'flex-col lg:flex-row gap-16 items-center justify-between';
  const alignClass = isCentered ? 'text-center items-center' : 'text-left items-start';
  const hasImage = !!content.imageUrl;

  return (
    <section id={id} className="relative py-28 px-6 md:px-12 bg-bg text-text transition-colors duration-300 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square rounded-full bg-blue-500/5 blur-[100px] pointer-events-none"></div>
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className={`relative max-w-6xl mx-auto flex ${containerClass} z-10`}>
        <div className={`flex flex-col flex-1 ${alignClass} gap-6`}>
          {content.tagline && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 border border-primary/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              {content.tagline}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-custom leading-tight tracking-tight">
            {content.title || 'Draft Heading'}
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl font-normal leading-relaxed mx-auto">
            {content.description || 'Provide details about your page here.'}
          </p>
          <div className="flex flex-wrap gap-4 mt-2 justify-center">
            {content.primaryCtaText && (
              <a
                href={content.primaryCtaLink || '#'}
                className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-custom shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95 duration-200"
              >
                {content.primaryCtaText}
              </a>
            )}
            {content.secondaryCtaText && (
              <a
                href={content.secondaryCtaLink || '#'}
                className="px-8 py-3.5 border border-gray-200 dark:border-gray-800 hover:bg-bg-alt text-text font-semibold rounded-custom transition-all hover:-translate-y-0.5 duration-200"
              >
                {content.secondaryCtaText}
              </a>
            )}
          </div>
        </div>
        
        {hasImage && (
          <div className={`flex-1 w-full max-w-lg ${isCentered ? 'mt-14' : ''}`}>
            <div className="relative group">
              {/* Image outer glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-custom blur-lg opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <img
                src={content.imageUrl}
                alt={content.title}
                className="relative w-full h-auto object-cover rounded-custom shadow-2xl border border-gray-100 dark:border-gray-800 transform group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
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
    <section id={id} className="relative py-24 px-6 md:px-12 bg-bg text-text transition-colors duration-300 overflow-hidden border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-4">
          {content.tagline && (
            <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full self-center border border-primary/25">
              {content.tagline}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-extrabold font-custom tracking-tight">{content.title || 'Our Features'}</h2>
          <p className="text-text-muted text-base md:text-lg">{content.description}</p>
        </div>

        <div className={`grid grid-cols-1 ${cols} gap-8`}>
          {(content.items || []).map((item, idx) => (
            <div
              key={idx}
              className="group p-8 bg-bg-alt border border-gray-100 dark:border-gray-900 rounded-custom shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-custom flex items-center justify-center text-primary text-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition duration-300">
                {item.icon || '🚀'}
              </div>
              <h3 className="text-xl font-bold font-custom tracking-tight text-text">{item.title || 'Feature Title'}</h3>
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
    <section id={id} className="relative py-24 px-6 md:px-12 bg-bg text-text transition-colors duration-300 border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold font-custom tracking-tight">{content.title || 'Flexible Pricing Plans'}</h2>
          <p className="text-text-muted text-base md:text-lg">{content.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {(content.plans || []).map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-custom flex flex-col justify-between transition-all duration-300 relative border ${
                plan.popular
                  ? 'bg-bg-alt shadow-2xl border-primary scale-105 z-10'
                  : 'bg-bg-alt/55 border-gray-200 dark:border-gray-900 shadow-md hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-extrabold tracking-widest px-3.5 py-1 rounded-full uppercase border border-primary/30 shadow-md">
                  Most Popular
                </span>
              )}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">{plan.title}</h3>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-4xl font-extrabold font-custom">{plan.price}</span>
                  {plan.period && <span className="text-text-muted text-xs font-semibold">{plan.period}</span>}
                </div>
                <p className="text-text-muted text-xs leading-relaxed mb-4">{plan.description}</p>
                
                <div className="w-full h-px bg-gray-200 dark:bg-gray-800/80 my-2"></div>

                <ul className="flex flex-col gap-3.5 mb-8 mt-2">
                  {(plan.features || []).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-xs text-text font-medium">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-3 px-4 font-bold text-xs rounded-custom transition-all duration-200 active:scale-95 ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20'
                    : 'bg-white border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/40 text-text'
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
  const containerClass = isGrid ? 'md:grid-cols-2 gap-16' : 'max-w-2xl mx-auto gap-8';

  return (
    <section id={id} className="relative py-24 px-6 md:px-12 bg-bg text-text transition-colors duration-300 border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold font-custom tracking-tight">{content.title || 'Get In Touch'}</h2>
          <p className="text-text-muted text-base md:text-lg">{content.description}</p>
        </div>

        <div className={`grid grid-cols-1 ${containerClass} items-center`}>
          {/* Form Card */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="p-8 bg-bg-alt rounded-custom border border-gray-100 dark:border-gray-900 shadow-lg flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="px-4 py-3 bg-bg border border-gray-200 dark:border-gray-850 rounded-custom text-text focus:ring-1 focus:ring-primary focus:outline-none text-sm transition"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="px-4 py-3 bg-bg border border-gray-200 dark:border-gray-850 rounded-custom text-text focus:ring-1 focus:ring-primary focus:outline-none text-sm transition"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Message</label>
              <textarea
                rows="4"
                placeholder="Tell us about your project..."
                className="px-4 py-3 bg-bg border border-gray-200 dark:border-gray-850 rounded-custom text-text focus:ring-1 focus:ring-primary focus:outline-none text-sm resize-none transition"
              ></textarea>
            </div>
            <button className="py-3.5 px-6 bg-primary hover:bg-primary-hover text-white font-bold rounded-custom transition-all duration-200 shadow-md shadow-primary/10 hover:shadow-primary/20 active:scale-95 text-xs uppercase tracking-wider">
              {content.buttonText || 'Send Message'}
            </button>
          </form>

          {/* Info Card (only shown in grid layout) */}
          {isGrid && (
            <div className="flex flex-col justify-center gap-10 lg:px-8">
              <div>
                <h3 className="text-2xl font-extrabold font-custom tracking-tight mb-3">{content.infoTitle || 'Contact Details'}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{content.infoDescription}</p>
              </div>
              <div className="flex flex-col gap-6">
                {content.phone && (
                  <div className="flex items-center gap-4">
                    <span className="w-11 h-11 rounded-custom bg-primary/10 flex items-center justify-center text-primary text-xl">📞</span>
                    <div>
                      <h4 className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Phone</h4>
                      <p className="text-text font-semibold text-sm mt-0.5">{content.phone}</p>
                    </div>
                  </div>
                )}
                {content.email && (
                  <div className="flex items-center gap-4">
                    <span className="w-11 h-11 rounded-custom bg-primary/10 flex items-center justify-center text-primary text-xl">✉️</span>
                    <div>
                      <h4 className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Email</h4>
                      <p className="text-text font-semibold text-sm mt-0.5">{content.email}</p>
                    </div>
                  </div>
                )}
                {content.address && (
                  <div className="flex items-center gap-4">
                    <span className="w-11 h-11 rounded-custom bg-primary/10 flex items-center justify-center text-primary text-xl">📍</span>
                    <div>
                      <h4 className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Office</h4>
                      <p className="text-text font-semibold text-sm mt-0.5">{content.address}</p>
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
    <section id={id} className="relative py-24 px-6 md:px-12 bg-bg text-text transition-colors duration-300 border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold font-custom tracking-tight">{content.title || 'Visual Gallery'}</h2>
          <p className="text-text-muted text-base md:text-lg">{content.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(content.images || []).map((img, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-custom shadow-md hover:shadow-2xl transition-all duration-300 relative aspect-video bg-bg-alt border border-gray-100 dark:border-gray-900"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <h4 className="text-lg font-bold font-custom tracking-tight">{img.title}</h4>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
