import React, { useState, useEffect, useRef } from 'react';
import Canvas from './components/Canvas';
import ChatSidebar from './components/ChatSidebar';
import { registerWebMCPTools } from './utils/webmcp';

export default function App() {
  // 1. Initial State
  const [sections, setSections] = useState([
    {
      id: 'hero-1',
      type: 'hero',
      content: {
        title: 'Design Websites in Partnership with AI',
        tagline: 'SiteAgent Canvas & WebMCP',
        description: 'Expose styling and layout controls directly to in-browser AI assistants. WebMCP establishes a reliable, structured bridge between web pages and autonomous LLM agents.',
        primaryCtaText: 'Get Started Now',
        primaryCtaLink: '#',
        secondaryCtaText: 'View Specs',
        secondaryCtaLink: 'https://github.com/webmachinelearning/webmcp',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        align: 'left',
      },
    },
  ]);

  const [styling, setStyling] = useState({
    primaryColor: '#3b82f6',
    primaryHover: '#2563eb',
    bgColor: '#ffffff',
    bgAltColor: '#f9fafb',
    textColor: '#111827',
    textMutedColor: '#6b7280',
    borderRadius: '0.5rem',
    fontFamily: "'Inter', sans-serif",
  });

  const [selectedSectionId, setSelectedSectionId] = useState('hero-1');
  const [isWebMcpActive, setIsWebMcpActive] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Refs for tracking state inside callbacks (since WebMCP callbacks run asynchronously outside React rendering context)
  const stateRef = useRef({ sections, styling });
  useEffect(() => {
    stateRef.current = { sections, styling };
  }, [sections, styling]);

  // 2. State Mutators (used by both UI and WebMCP Tool registration)
  const getCanvasState = () => {
    return stateRef.current;
  };

  const addSection = (type, content) => {
    const id = `${type}-${Math.random().toString(36).substring(2, 9)}`;
    const newSection = { id, type, content };
    setSections((prev) => [...prev, newSection]);
    setSelectedSectionId(id);
  };

  const editSectionText = (sectionId, updates) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            content: { ...sec.content, ...updates },
          };
        }
        return sec;
      })
    );
  };

  const updateStyling = (updates) => {
    setStyling((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const swapLayout = (sectionId, layoutKey, value) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            content: { ...sec.content, [layoutKey]: value },
          };
        }
        return sec;
      })
    );
  };

  const deleteSection = (sectionId) => {
    setSections((prev) => prev.filter((sec) => sec.id !== sectionId));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  };

  // 3. Register WebMCP Tools
  useEffect(() => {
    const success = registerWebMCPTools({
      getCanvasState,
      addSection,
      editSectionText,
      updateStyling,
      swapLayout,
      deleteSection,
    });
    setIsWebMcpActive(success);
  }, []);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="flex flex-col h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* 🚀 Header */}
      <header className="h-16 border-b border-slate-800 px-6 bg-slate-900 flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-3">
          <span className="text-xl">🤖</span>
          <div>
            <h1 className="font-extrabold text-sm tracking-widest text-slate-100 uppercase">
              SiteAgent Canvas
            </h1>
            <p className="text-[10px] text-slate-400">Agentic Website Builder</p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isWebMcpActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'
              }`}
            ></span>
            <span className="text-xs font-semibold text-slate-300">
              {isWebMcpActive ? 'WebMCP Native Active' : 'WebMCP Simulator Ready'}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="text-xs px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded border border-slate-700 hover:border-slate-600 transition"
            >
              📤 Export JSON
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear the canvas?')) {
                  setSections([]);
                  setSelectedSectionId(null);
                }
              }}
              className="text-xs px-3.5 py-1.5 bg-slate-950 text-slate-400 hover:text-red-400 font-semibold rounded border border-slate-800 hover:border-red-950/20 transition"
            >
              🧹 Clear Canvas
            </button>
          </div>
        </div>
      </header>

      {/* 💻 Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Manual Configuration & Controls */}
        <aside className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col justify-between overflow-y-auto">
          <div className="p-4 flex flex-col gap-6">
            {/* Global Design variables */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                🎨 Theme Controls
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 uppercase">Primary</label>
                  <input
                    type="color"
                    value={styling.primaryColor}
                    onChange={(e) => updateStyling({ primaryColor: e.target.value, primaryHover: e.target.value })}
                    className="w-full h-8 bg-transparent border border-slate-700 rounded cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 uppercase">Background</label>
                  <input
                    type="color"
                    value={styling.bgColor}
                    onChange={(e) => updateStyling({ bgColor: e.target.value })}
                    className="w-full h-8 bg-transparent border border-slate-700 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Font Family</label>
                <select
                  value={styling.fontFamily}
                  onChange={(e) => updateStyling({ fontFamily: e.target.value })}
                  className="bg-slate-950 border border-slate-800 text-xs py-2 px-3 rounded text-slate-200"
                >
                  <option value="'Inter', sans-serif">Inter (Sans-Serif)</option>
                  <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
                  <option value="'Roboto Mono', monospace">Roboto Mono (Monospace)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Border Corners</label>
                <select
                  value={styling.borderRadius}
                  onChange={(e) => updateStyling({ borderRadius: e.target.value })}
                  className="bg-slate-950 border border-slate-800 text-xs py-2 px-3 rounded text-slate-200"
                >
                  <option value="0px">Sharp (0px)</option>
                  <option value="0.25rem">Rounded Sm (4px)</option>
                  <option value="0.5rem">Rounded Md (8px)</option>
                  <option value="1rem">Rounded Lg (16px)</option>
                  <option value="9999px">Pill (9999px)</option>
                </select>
              </div>
            </div>

            {/* Layout tree / active sections */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                📋 Canvas Structure
              </h3>
              {sections.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No sections added yet</span>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {sections.map((sec, index) => (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedSectionId(sec.id)}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition text-xs border ${
                        selectedSectionId === sec.id
                          ? 'bg-slate-800 border-slate-700 text-white font-semibold'
                          : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">#{index + 1}</span>
                        <span className="capitalize">{sec.type}</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(sec.id);
                        }}
                        className="text-slate-600 hover:text-red-400 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Section Detail Editing */}
            {selectedSection && (
              <div className="flex flex-col gap-3 p-3 bg-slate-950/40 border border-slate-800 rounded">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Edit: {selectedSection.type}
                  </h4>
                  <span className="text-[9px] font-mono text-slate-500">{selectedSection.id}</span>
                </div>

                <div className="flex flex-col gap-3">
                  {selectedSection.content.title !== undefined && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-slate-400 uppercase">Header Title</label>
                      <input
                        type="text"
                        value={selectedSection.content.title}
                        onChange={(e) => editSectionText(selectedSection.id, { title: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
                      />
                    </div>
                  )}
                  {selectedSection.content.tagline !== undefined && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-slate-400 uppercase">Tagline</label>
                      <input
                        type="text"
                        value={selectedSection.content.tagline}
                        onChange={(e) => editSectionText(selectedSection.id, { tagline: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
                      />
                    </div>
                  )}
                  {selectedSection.content.description !== undefined && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-slate-400 uppercase">Description</label>
                      <textarea
                        rows="3"
                        value={selectedSection.content.description}
                        onChange={(e) => editSectionText(selectedSection.id, { description: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 leading-relaxed bg-slate-950/20">
            SiteAgent uses WebMCP schemas to expose tools. Standard AI models running in compatible web browsers can call these tools to modify layout and design dynamically.
          </div>
        </aside>

        {/* Center Panel: Visual Preview Canvas */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-950 flex justify-center items-start">
          <div className="w-full max-w-4xl">
            <Canvas
              sections={sections}
              styling={styling}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
            />
          </div>
        </main>

        {/* Right Panel: Simulated Agent Chat */}
        <aside className="w-96 flex shrink-0">
          <ChatSidebar
            sections={sections}
            styling={styling}
            addSection={addSection}
            editSectionText={editSectionText}
            updateStyling={updateStyling}
            swapLayout={swapLayout}
            deleteSection={deleteSection}
            getCanvasState={getCanvasState}
          />
        </aside>
      </div>

      {/* 📥 Export Config Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200">
                Export Website Configuration
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Below is the structured JSON configuration generated by the WebMCP agent. You can copy this output and load it into any compatible renderer or keep it as backup.
            </p>
            <pre className="p-3 bg-slate-950 border border-slate-850 rounded text-[10px] text-emerald-400 font-mono overflow-y-auto max-h-60">
              {JSON.stringify({ styling, sections }, null, 2)}
            </pre>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({ styling, sections }, null, 2));
                  alert('Configuration copied to clipboard!');
                }}
                className="text-xs px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded transition"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-xs px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded border border-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
