import React, { useState, useRef, useEffect } from 'react';

export default function ChatSidebar({
  sections,
  styling,
  addSection,
  editSectionText,
  updateStyling,
  swapLayout,
  deleteSection,
  getCanvasState,
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: "Hi! I am your WebMCP Design Agent. I can manage and style your website dynamically. Try using the quick actions below or type a instruction (e.g., 'add hero', 'make the theme dark', 'set primary color to #f43f5e').",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Visual Helper: Add tool execution log to chat
  const logToolCall = (toolName, args, result) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: 'system',
        text: `🔧 WebMCP Tool Call: ${toolName}()`,
        details: JSON.stringify({ args, result }, null, 2),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCommand = (text) => {
    const prompt = text.toLowerCase().trim();
    let responseText = "I didn't quite catch that command. Try using one of the quick presets or write a command like 'add features' or 'change background to slate'.";
    let matched = false;

    // 1. Theme and Color Updates
    if (prompt.includes('dark theme') || prompt.includes('make it dark') || prompt.includes('dark mode')) {
      const updates = {
        bgColor: '#0f172a',
        bgAltColor: '#1e293b',
        textColor: '#f8fafc',
        textMutedColor: '#94a3b8',
        primaryColor: '#10b981',
        primaryHover: '#059669',
      };
      updateStyling(updates);
      logToolCall('updateStyling', updates, { success: true });
      responseText = "Updated style configuration to a sleek dark slate theme with emerald primary accents.";
      matched = true;
    } else if (prompt.includes('light theme') || prompt.includes('make it light') || prompt.includes('light mode')) {
      const updates = {
        bgColor: '#ffffff',
        bgAltColor: '#f9fafb',
        textColor: '#111827',
        textMutedColor: '#6b7280',
        primaryColor: '#3b82f6',
        primaryHover: '#2563eb',
      };
      updateStyling(updates);
      logToolCall('updateStyling', updates, { success: true });
      responseText = "Reset style configuration to a clean light theme with blue primary accents.";
      matched = true;
    } else if (prompt.match(/(?:set|change)?\s*primary\s*(?:color)?\s*(?:to)?\s*(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)/)) {
      const color = prompt.match(/(?:set|change)?\s*primary\s*(?:color)?\s*(?:to)?\s*(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)/)[1];
      const updates = { primaryColor: color, primaryHover: color };
      updateStyling(updates);
      logToolCall('updateStyling', updates, { success: true });
      responseText = `Updated primary brand color to ${color}.`;
      matched = true;
    } else if (prompt.match(/(?:set|change)?\s*background\s*(?:color)?\s*(?:to)?\s*(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)/)) {
      const color = prompt.match(/(?:set|change)?\s*background\s*(?:color)?\s*(?:to)?\s*(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)/)[1];
      const updates = { bgColor: color };
      updateStyling(updates);
      logToolCall('updateStyling', updates, { success: true });
      responseText = `Updated canvas background color to ${color}.`;
      matched = true;
    } else if (prompt.match(/(?:set|change)?\s*text\s*(?:color)?\s*(?:to)?\s*(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)/)) {
      const color = prompt.match(/(?:set|change)?\s*text\s*(?:color)?\s*(?:to)?\s*(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)/)[1];
      const updates = { textColor: color };
      updateStyling(updates);
      logToolCall('updateStyling', updates, { success: true });
      responseText = `Updated text color to ${color}.`;
      matched = true;
    } else if (prompt.includes('round') || prompt.includes('corner') || prompt.includes('border radius')) {
      let radius = '0.5rem';
      if (prompt.includes('sharp') || prompt.includes('none')) radius = '0px';
      else if (prompt.includes('pill') || prompt.includes('full') || prompt.includes('max')) radius = '9999px';
      else if (prompt.includes('large') || prompt.includes('lg')) radius = '1rem';
      
      const updates = { borderRadius: radius };
      updateStyling(updates);
      logToolCall('updateStyling', updates, { success: true });
      responseText = `Set component border-radius corners to ${radius}.`;
      matched = true;
    } else if (prompt.includes('font')) {
      let font = "'Inter', sans-serif";
      if (prompt.includes('serif') || prompt.includes('playfair')) font = "'Playfair Display', serif";
      else if (prompt.includes('mono') || prompt.includes('roboto')) font = "'Roboto Mono', monospace";
      
      const updates = { fontFamily: font };
      updateStyling(updates);
      logToolCall('updateStyling', updates, { success: true });
      responseText = `Switched global typography family to ${font}.`;
      matched = true;
    }

    // 2. Add Sections
    if (prompt.includes('add hero') || prompt.includes('insert hero')) {
      const content = {
        title: "Build the Future with AI Agents",
        tagline: "Agentic Web Ecosystem",
        description: "Expose your application functionality directly to in-browser AI assistants. WebMCP establishes a direct API channel between user interfaces and autonomous models.",
        primaryCtaText: "Get Started Now",
        primaryCtaLink: "#",
        secondaryCtaText: "Read Specs",
        secondaryCtaLink: "https://github.com/webmachinelearning/webmcp",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        align: "left",
      };
      addSection('hero', content);
      logToolCall('addSection', { type: 'hero', content }, { success: true });
      responseText = "Inserted a Hero landing section with header graphics and action triggers.";
      matched = true;
    } else if (prompt.includes('add features') || prompt.includes('add feature')) {
      const content = {
        title: "Why WebMCP Matters",
        tagline: "Unparalleled Interface Access",
        description: "Instead of brittle web scraping, WebMCP enables clean, machine-readable tool registration.",
        columns: 3,
        items: [
          { icon: "⚡", title: "Sub-Second Latency", description: "Direct javascript bindings eliminate network hops for client-side tools." },
          { icon: "🛡️", title: "Secure Contexts", description: "Browser sandbox manages permission prompts and restricts execution boundaries." },
          { icon: "🔄", title: "Dynamic State", description: "Instantly update page visual layout based on agent tool callbacks." },
        ],
      };
      addSection('features', content);
      logToolCall('addSection', { type: 'features', content }, { success: true });
      responseText = "Added a Features showcase grid highlighting protocol benefits.";
      matched = true;
    } else if (prompt.includes('add pricing')) {
      const content = {
        title: "Simple, Transparent Pricing",
        description: "Deploy client-side agents for free. Scale tool registries on demand.",
        plans: [
          { title: "Standard", price: "$0", period: "/mo", description: "Ideal for individual developers building local prototypes.", buttonText: "Start Free", features: ["1 registered tool context", "Local browser testing", "Standard support"], popular: false },
          { title: "Pro Builder", price: "$49", period: "/mo", description: "For startups launching production agentic web tools.", buttonText: "Upgrade to Pro", features: ["Unlimited tool contexts", "Cloudflare & Vercel integration", "Priority Discord support", "Custom API schemas"], popular: true },
          { title: "Enterprise", price: "Custom", period: "", description: "For mid-to-large companies with advanced security standards.", buttonText: "Contact Sales", features: ["Fine-grained security gates", "Dedicated agent endpoints", "SLA uptime guarantee", "On-premise deployments"], popular: false },
        ],
      };
      addSection('pricing', content);
      logToolCall('addSection', { type: 'pricing', content }, { success: true });
      responseText = "Inserted a 3-tier Pricing grid highlighting premium upgrades.";
      matched = true;
    } else if (prompt.includes('add contact')) {
      const content = {
        title: "Start Building Today",
        description: "Have questions about the WebMCP standard? Get in touch with our team of protocol developers.",
        layout: "grid",
        buttonText: "Send message",
        infoTitle: "Developer Office",
        infoDescription: "We support builders on Discord, Devpost, and GitHub.",
        phone: "+1 (555) 019-2831",
        email: "mcp-builders@openai.com",
        address: "1455 3rd Street, San Francisco, CA 94158",
      };
      addSection('contact', content);
      logToolCall('addSection', { type: 'contact', content }, { success: true });
      responseText = "Added an interactive Contact Form block with detailed support coordinates.";
      matched = true;
    } else if (prompt.includes('add gallery')) {
      const content = {
        title: "Exemplary Agentic Apps",
        description: "Browse high-quality websites developed natively for AI agent tools.",
        images: [
          { url: "https://images.unsplash.com/photo-1541462608141-ad4979e408c9?auto=format&fit=crop&w=600&q=80", title: "L'Atelier Hotel App", description: "High-fidelity booking demo." },
          { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", title: "DuckQuery Dashboard", description: "In-browser SQL execution panel." },
          { url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80", title: "SiteAgent Canvas", description: "Agentic Visual Designer." },
        ],
      };
      addSection('gallery', content);
      logToolCall('addSection', { type: 'gallery', content }, { success: true });
      responseText = "Created a Visual Gallery section to showcase screenshot portfolios.";
      matched = true;
    }

    // 3. Layout updates and deletion
    if (prompt.includes('align hero') || prompt.includes('center hero')) {
      const heroSec = sections.find((s) => s.type === 'hero');
      if (heroSec) {
        const align = prompt.includes('center') ? 'center' : 'left';
        swapLayout(heroSec.id, 'align', align);
        logToolCall('swapLayout', { sectionId: heroSec.id, layoutKey: 'align', value: align }, { success: true });
        responseText = `Aligned hero section layout to the ${align}.`;
        matched = true;
      } else {
        responseText = "I can't align the hero section because you haven't added one yet! Try saying 'add hero' first.";
        matched = true;
      }
    }

    if (prompt.match(/(?:delete|remove)\s*([a-zA-Z0-9-]+)/)) {
      const secId = prompt.match(/(?:delete|remove)\s*([a-zA-Z0-9-]+)/)[1];
      const targetSec = sections.find(s => s.id.toLowerCase() === secId || s.type.toLowerCase() === secId);
      if (targetSec) {
        deleteSection(targetSec.id);
        logToolCall('deleteSection', { sectionId: targetSec.id }, { success: true });
        responseText = `Successfully deleted section #${targetSec.id}.`;
        matched = true;
      }
    }

    // Default reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 400);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
    handleCommand(text);
  };

  const executePreset = (presetCommand) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: `Preset Action: ${presetCommand}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    handleCommand(presetCommand);
  };

  // Preset composite flows
  const buildSaaSSite = () => {
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: "⚡ Quick Action: Build complete SaaS page",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    
    // Add sections sequentially
    setTimeout(() => handleCommand("add hero"), 100);
    setTimeout(() => handleCommand("add features"), 600);
    setTimeout(() => handleCommand("add pricing"), 1100);
    setTimeout(() => handleCommand("add contact"), 1600);
  };

  return (
    <div className="w-full h-full bg-slate-900 border-l border-slate-800 flex flex-col justify-between">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <h3 className="font-bold text-sm tracking-wide text-slate-200">WEBMCP AGENT SIMULATOR</h3>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded">
          v1.0 (Devpost)
        </span>
      </div>

      {/* Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user'
                ? 'self-end items-end'
                : msg.sender === 'system'
                ? 'self-center items-center w-full max-w-full'
                : 'self-start items-start'
            }`}
          >
            {/* Header / Timestamp */}
            <span className="text-[9px] text-slate-500 mb-1 px-1">
              {msg.sender === 'user' ? 'User' : msg.sender === 'system' ? 'System Logs' : 'SiteAgent AI'} • {msg.timestamp}
            </span>

            {/* Bubble */}
            <div
              className={`p-3 text-xs leading-relaxed rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : msg.sender === 'system'
                  ? 'bg-slate-950/70 border border-slate-800/80 font-mono text-[10px] text-emerald-400 w-full'
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50'
              }`}
            >
              <div>{msg.text}</div>
              {msg.details && (
                <pre className="mt-2 p-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-300 overflow-x-auto">
                  {msg.details}
                </pre>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Presets */}
      <div className="p-3 bg-slate-950/50 border-t border-slate-800 flex flex-col gap-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-1">
          Agent Command Presets
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={buildSaaSSite}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 py-1.5 px-2.5 rounded transition"
          >
            ⚡ Build SaaS Page
          </button>
          <button
            onClick={() => executePreset("make the theme dark")}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 py-1.5 px-2.5 rounded transition"
          >
            🎨 Dark Slate Theme
          </button>
          <button
            onClick={() => executePreset("make the theme light")}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 py-1.5 px-2.5 rounded transition"
          >
            ☀️ Clean Light Theme
          </button>
          <button
            onClick={() => executePreset("change font to Playfair Display")}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 py-1.5 px-2.5 rounded transition"
          >
            ✍️ Elegant Serif Font
          </button>
          <button
            onClick={() => executePreset("change border radius to pill")}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 py-1.5 px-2.5 rounded transition"
          >
            🛡️ Rounded Pill Corners
          </button>
          <button
            onClick={() => executePreset("align hero center")}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 py-1.5 px-2.5 rounded transition"
          >
            📐 Center Align Hero
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-800 bg-slate-900 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask agent to add/style page..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-700"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded text-xs transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
