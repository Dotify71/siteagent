import React from 'react';
import {
  HeroSection,
  FeaturesSection,
  PricingSection,
  ContactSection,
  GallerySection,
} from './SectionTemplates';

export default function Canvas({ sections, styling, selectedSectionId, onSelectSection }) {
  // Map styling state to inline CSS custom properties
  const inlineStyles = {
    '--primary-color': styling.primaryColor,
    '--primary-hover': styling.primaryHover,
    '--bg-color': styling.bgColor,
    '--bg-alt-color': styling.bgAltColor,
    '--text-color': styling.textColor,
    '--text-muted-color': styling.textMutedColor,
    '--border-radius': styling.borderRadius,
    '--font-family': styling.fontFamily,
  };

  const renderSection = (section) => {
    const props = {
      key: section.id,
      id: section.id,
      content: section.content,
      styles: section.styles || {},
    };

    switch (section.type) {
      case 'hero':
        return <HeroSection {...props} />;
      case 'features':
        return <FeaturesSection {...props} />;
      case 'pricing':
        return <PricingSection {...props} />;
      case 'contact':
        return <ContactSection {...props} />;
      case 'gallery':
        return <GallerySection {...props} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={inlineStyles}
      className="w-full min-h-screen bg-bg text-text selection:bg-primary/20 transition-all duration-300 font-custom shadow-inner border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
    >
      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50 dark:bg-slate-900/50">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-4xl mb-4 shadow-lg animate-pulse">
            🏗️
          </div>
          <h2 className="text-xl font-bold font-custom text-slate-400">Empty Builder Canvas</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">
            Use the chat box or sidebar to tell the AI agent what section to add first!
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {sections.map((section) => {
            const isSelected = selectedSectionId === section.id;
            return (
              <div
                key={section.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSection?.(section.id);
                }}
                className={`relative group cursor-pointer border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary shadow-xl ring-2 ring-primary/10'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Visual Section Frame Helper */}
                <div className="absolute top-2 left-2 z-20 bg-slate-900/90 border border-slate-700/80 text-[10px] text-slate-300 font-mono py-1 px-2 rounded uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-md">
                  <span>#{section.id}</span>
                  <span className="w-1 h-1 rounded-full bg-primary"></span>
                  <span>{section.type}</span>
                </div>
                {renderSection(section)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
