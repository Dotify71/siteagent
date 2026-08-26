import React, { useState, useRef, useEffect } from 'react';

const DEFAULT_SYSTEM_PROMPT = `You are a WebMCP Design Assistant. You help users build, style, and structure websites in real-time.
You communicate with a visual preview canvas using the following registered WebMCP tools:

1. addSection({ type: "hero" | "features" | "pricing" | "contact" | "gallery", content: {...} })
   - Content schemas:
     * hero: { title, tagline, description, primaryCtaText, primaryCtaLink, secondaryCtaText, secondaryCtaLink, imageUrl, align: "left" | "center" }
     * features: { title, tagline, description, columns: 2 | 3, items: [{ icon, title, description }, ...] }
     * pricing: { title, description, plans: [{ title, price, period, description, buttonText, features: [], popular: true | false }, ...] }
     * contact: { title, description, layout: "grid" | "stacked", buttonText, infoTitle, infoDescription, phone, email, address }
     * gallery: { title, description, images: [{ url, title, description }, ...] }
2. editSectionText({ sectionId, updates })
   - updates is an object containing text fields to override (e.g., { title: "New Title" })
3. updateStyling({ primaryColor, bgColor, textColor, borderRadius, fontFamily })
   - fontFamily option enum: "'Inter', sans-serif" | "'Playfair Display', serif" | "'Roboto Mono', monospace"
   - borderRadius option enum: "0px" | "0.25rem" | "0.5rem" | "1rem" | "9999px"
4. swapLayout({ sectionId, layoutKey, value })
   - layoutKey: "align" for hero, "columns" for features, "layout" for contact.
5. deleteSection({ sectionId })

When the user asks you to build, style, delete, or modify sections, you MUST output the corresponding tool call(s) inside a JSON block wrapped in \`\`\`json ... \`\`\` code fences at the very end of your response, like this:
\`\`\`json
[
  {
    "tool": "addSection",
    "args": {
      "type": "hero",
      "content": {
        "title": "Welcome to my portal",
        "tagline": "Innovative web design",
        "description": "...",
        "imageUrl": "...",
        "align": "center"
      }
    }
  }
]
\`\`\`
Provide a helpful, friendly message explaining what changes you are applying, and append the JSON block. Do not mention the tools by name to the user, just explain the updates.`;

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
  // 1. Core States
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: "Hi! I am your WebMCP Design Agent. I can manage and style your website dynamically. Try using the presets or type a command (e.g., 'make the theme dark', 'add a features grid').\n\n⚙️ Click the Gear icon above to configure a live Gemini/OpenAI API key!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // 2. LocalStorage API Configuration States
  const [apiProvider, setApiProvider] = useState(
    localStorage.getItem('siteagent_api_provider') || 'built-in'
  );
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('siteagent_api_key') || ''
  );
  const [geminiModel, setGeminiModel] = useState(
    localStorage.getItem('siteagent_gemini_model') || 'gemini-2.5-flash'
  );
  const [openaiModel, setOpenaiModel] = useState(
    localStorage.getItem('siteagent_openai_model') || 'gpt-4o-mini'
  );
  const [systemPrompt, setSystemPrompt] = useState(
    localStorage.getItem('siteagent_system_prompt') || DEFAULT_SYSTEM_PROMPT
  );

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Sync API configurations to LocalStorage
  const saveSettings = () => {
    localStorage.setItem('siteagent_api_provider', apiProvider);
    localStorage.setItem('siteagent_api_key', apiKey);
    localStorage.setItem('siteagent_gemini_model', geminiModel);
    localStorage.setItem('siteagent_openai_model', openaiModel);
    localStorage.setItem('siteagent_system_prompt', systemPrompt);
    setShowSettings(false);
    setMessages((prev) => [
      ...prev,
      {
        sender: 'system',
        text: `Settings Saved. Provider: ${apiProvider.toUpperCase()} | Model: ${apiProvider === 'gemini' ? geminiModel : openaiModel}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

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

  // 3. LLM API Core Integration
  const callLLM = async (userPrompt) => {
    setLoading(true);
    let agentReply = "";
    
    try {
      if (apiProvider === 'gemini') {
        if (!apiKey) throw new Error("Gemini API key is missing. Open settings and enter your API key.");
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
        
        // Compile full chat history into prompt context
        const historyText = messages
          .filter(m => m.sender !== 'system')
          .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
          .join('\n');
          
        const fullPrompt = `${systemPrompt}\n\n--- Canvas Current JSON State ---\n${JSON.stringify(getCanvasState(), null, 2)}\n\n--- Conversation History ---\n${historyText}\nUser: ${userPrompt}\nAssistant:`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }]
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error?.message || "Gemini API call failed.");
        }

        const data = await res.json();
        agentReply = data.candidates[0].content.parts[0].text;

      } else if (apiProvider === 'openai') {
        if (!apiKey) throw new Error("OpenAI API key is missing. Open settings and enter your API key.");
        const url = `https://api.openai.com/v1/chat/completions`;

        const apiMessages = [
          { role: 'system', content: `${systemPrompt}\n\nCanvas Current JSON State:\n${JSON.stringify(getCanvasState(), null, 2)}` },
          ...messages
            .filter(m => m.sender !== 'system')
            .map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            })),
          { role: 'user', content: userPrompt }
        ];

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: openaiModel,
            messages: apiMessages
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error?.message || "OpenAI API call failed.");
        }

        const data = await res.json();
        agentReply = data.choices[0].message.content;
      }

      // Parse agent output for WebMCP JSON block
      const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
      const match = agentReply.match(jsonRegex);
      let cleanText = agentReply.replace(jsonRegex, '').trim();

      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: cleanText || "Applying visual updates to the canvas...",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (match) {
        try {
          const toolCalls = JSON.parse(match[1]);
          if (Array.isArray(toolCalls)) {
            // Sequential execution of tool calls
            toolCalls.forEach((call) => {
              executeMCPTool(call.tool, call.args);
            });
          }
        } catch (jsonErr) {
          console.error("Failed to parse agent tool JSON block", jsonErr);
        }
      }

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `❌ Error: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const executeMCPTool = (tool, args) => {
    try {
      switch (tool) {
        case 'addSection':
          addSection(args.type, args.content);
          logToolCall('addSection', args, { success: true });
          break;
        case 'editSectionText':
          editSectionText(args.sectionId, args.updates);
          logToolCall('editSectionText', args, { success: true });
          break;
        case 'updateStyling':
          updateStyling(args);
          logToolCall('updateStyling', args, { success: true });
          break;
        case 'swapLayout':
          swapLayout(args.sectionId, args.layoutKey, args.value);
          logToolCall('swapLayout', args, { success: true });
          break;
        case 'deleteSection':
          deleteSection(args.sectionId);
          logToolCall('deleteSection', args, { success: true });
          break;
        default:
          console.warn("Unknown tool: ", tool);
      }
    } catch (e) {
      console.error("Error executing mcp tool ", tool, e);
    }
  };

  // 4. Fallback Offline Rule-Based command parser
  const handleOfflineCommand = (text) => {
    const prompt = text.toLowerCase().trim();
    let responseText = "I didn't quite catch that command. Try using one of the quick presets or write a command like 'add features' or 'change background to slate'.";
    let matched = false;

    // PDF/PPTX query
    if (prompt.includes('pdf') || prompt.includes('pptx') || prompt.includes('slides') || prompt.includes('presentation')) {
      responseText = "I am a WebMCP Visual Site Builder agent. I construct and style live web layouts. While I cannot generate PowerPoint or PDF files directly, you can easily save your designed web page as a PDF by pressing Ctrl+P (or Cmd+P on Mac) in your browser, or export the structured layout JSON using the 'Export JSON' button at the top!";
      matched = true;
    }
    // University / Education themes
    else if (prompt.includes('university') || prompt.includes('college') || prompt.includes('school') || prompt.includes('education')) {
      const academicStyling = {
        primaryColor: '#1e3a8a', // Navy blue
        primaryHover: '#172554',
        bgColor: '#ffffff',
        textColor: '#0f172a',
        fontFamily: "'Playfair Display', serif",
      };
      updateStyling(academicStyling);
      logToolCall('updateStyling', academicStyling, { success: true });

      const heroContent = {
        title: "Welcome to Horizon University",
        tagline: "Inspiring Leadership & Academic Excellence",
        description: "Horizon University offers a world-class academic community where freshers and researchers collaborate on groundbreaking research and build future-proof careers.",
        primaryCtaText: "Apply Online",
        primaryCtaLink: "#",
        secondaryCtaText: "Tour Campus",
        secondaryCtaLink: "#",
        imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
        align: "center",
      };
      addSection('hero', heroContent);
      logToolCall('addSection', { type: 'hero', content: heroContent }, { success: true });

      const featuresContent = {
        title: "Explore Campus Life",
        tagline: "Innovation, Community & Culture",
        description: "Everything you need to succeed as a fresher at our university campus.",
        columns: 3,
        items: [
          { icon: "🎓", title: "World-Class Degrees", description: "Choose from over 50 accredited undergraduate and graduate programs." },
          { icon: "🏫", title: "Modern Residences", description: "Access state-of-the-art residences, libraries, and student union spaces." },
          { icon: "🔬", title: "Advanced Research", description: "Collaborate in advanced research centers and get funded internships." },
        ],
      };
      addSection('features', featuresContent);
      logToolCall('addSection', { type: 'features', content: featuresContent }, { success: true });

      responseText = "Built an academic university homepage preset! Set theme to classic navy serif typography, and generated dedicated Hero and campus Features sections for freshers.";
      matched = true;
    }
    // Edit title
    else if (prompt.includes('change title') || prompt.includes('set title')) {
      const titleMatch = text.match(/(?:change|set)\s+(?:the\s+)?title\s+to\s+(.+)/i);
      if (titleMatch) {
        const newTitle = titleMatch[1];
        const currentSections = getCanvasState().sections;
        const targetSecId = currentSections[0] && currentSections[0].id;
        if (targetSecId) {
          editSectionText(targetSecId, { title: newTitle });
          logToolCall('editSectionText', { sectionId: targetSecId, updates: { title: newTitle } }, { success: true });
          responseText = `Successfully changed the title of section #${targetSecId} to "${newTitle}".`;
          matched = true;
        } else {
          responseText = "Please add a section first before changing its title!";
          matched = true;
        }
      }
    }
    // Edit description
    else if (prompt.includes('change description') || prompt.includes('set description')) {
      const descMatch = text.match(/(?:change|set)\s+(?:the\s+)?description\s+to\s+(.+)/i);
      if (descMatch) {
        const newDesc = descMatch[1];
        const currentSections = getCanvasState().sections;
        const targetSecId = currentSections[0] && currentSections[0].id;
        if (targetSecId) {
          editSectionText(targetSecId, { description: newDesc });
          logToolCall('editSectionText', { sectionId: targetSecId, updates: { description: newDesc } }, { success: true });
          responseText = `Successfully updated description of section #${targetSecId}.`;
          matched = true;
        } else {
          responseText = "Please add a section first before updating its description!";
          matched = true;
        }
      }
    }
    // Colors and Themes
    else if (prompt.includes('dark') && (prompt.includes('theme') || prompt.includes('mode') || prompt.includes('make') || prompt.includes('slate'))) {
      const updates = {
        bgColor: '#0b0f19',
        textColor: '#f8fafc',
        primaryColor: '#10b981',
        primaryHover: '#059669',
      };
      updateStyling(updates);
      logToolCall('updateStyling', updates, { success: true });
      responseText = "Updated style configuration to a sleek dark slate theme with emerald primary accents.";
      matched = true;
    } else if (prompt.includes('light') && (prompt.includes('theme') || prompt.includes('mode') || prompt.includes('make') || prompt.includes('clean'))) {
      const updates = {
        bgColor: '#ffffff',
        textColor: '#111827',
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

    // Add Sections
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

    // Align hero layout
    if (prompt.includes('align hero') || prompt.includes('center hero')) {
      const currentSections = getCanvasState().sections;
      const heroSec = currentSections.find((s) => s.type === 'hero');
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

    // Delete section
    if (prompt.match(/(?:delete|remove)\s*([a-zA-Z0-9-]+)/)) {
      const secId = prompt.match(/(?:delete|remove)\s*([a-zA-Z0-9-]+)/)[1];
      const currentSections = getCanvasState().sections;
      const targetSec = currentSections.find(s => s.id.toLowerCase() === secId || s.type.toLowerCase() === secId);
      if (targetSec) {
        deleteSection(targetSec.id);
        logToolCall('deleteSection', { sectionId: targetSec.id }, { success: true });
        responseText = `Successfully deleted section #${targetSec.id}.`;
        matched = true;
      }
    }

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

    if (apiProvider === 'built-in') {
      handleOfflineCommand(text);
    } else {
      callLLM(text);
    }
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
    
    if (apiProvider === 'built-in') {
      handleOfflineCommand(presetCommand);
    } else {
      callLLM(presetCommand);
    }
  };

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
    setTimeout(() => {
      if (apiProvider === 'built-in') handleOfflineCommand("add hero");
      else callLLM("add hero");
    }, 100);
    setTimeout(() => {
      if (apiProvider === 'built-in') handleOfflineCommand("add features");
      else callLLM("add features");
    }, 600);
    setTimeout(() => {
      if (apiProvider === 'built-in') handleOfflineCommand("add pricing");
      else callLLM("add pricing");
    }, 1100);
    setTimeout(() => {
      if (apiProvider === 'built-in') handleOfflineCommand("add contact");
      else callLLM("add contact");
    }, 1600);
  };

  return (
    <div className="w-full h-full bg-slate-900 border-l border-slate-800 flex flex-col justify-between overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <h3 className="font-bold text-sm tracking-wide text-slate-200">WEBMCP AGENT SIMULATOR</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="AI Key Settings"
          >
            ⚙️
          </button>
          <span className="text-[9px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded">
            v1.1
          </span>
        </div>
      </div>

      {/* ⚙️ Slide-Down Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-slate-800 bg-slate-950/90 text-xs flex flex-col gap-3 animate-slide-down">
          <div className="flex justify-between items-center pb-1">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">AI Integration Settings</h4>
            <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-slate-300">✕</button>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-slate-500 font-bold uppercase">AI Provider</label>
            <select
              value={apiProvider}
              onChange={(e) => setApiProvider(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="built-in">Offline Simulator (No API Key Required)</option>
              <option value="gemini">Gemini API (Google)</option>
              <option value="openai">OpenAI API (GPT-4o-mini)</option>
            </select>
          </div>

          {apiProvider === 'gemini' && (
            <div className="flex flex-col gap-1 animate-fade-in">
              <label className="text-[9px] text-slate-500 font-bold uppercase">Gemini Model ID</label>
              <input
                type="text"
                placeholder="e.g., gemini-2.5-flash or gemini-1.5-flash"
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          )}

          {apiProvider === 'openai' && (
            <div className="flex flex-col gap-1 animate-fade-in">
              <label className="text-[9px] text-slate-500 font-bold uppercase">OpenAI Model ID</label>
              <input
                type="text"
                placeholder="e.g., gpt-4o-mini"
                value={openaiModel}
                onChange={(e) => setOpenaiModel(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          )}

          {apiProvider !== 'built-in' && (
            <div className="flex flex-col gap-1 animate-fade-in">
              <label className="text-[9px] text-slate-500 font-bold uppercase">API Private Key</label>
              <input
                type="password"
                placeholder="Paste your API key here..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              />
              <span className="text-[9px] text-slate-500 italic mt-0.5">Stored locally in your browser's localStorage.</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-slate-500 font-bold uppercase">System Prompt (Train the AI)</label>
            <textarea
              rows="4"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-[10px] text-slate-300 font-mono focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end mt-1">
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px] uppercase tracking-wider transition"
            >
              Save & Apply
            </button>
            <button
              onClick={() => {
                setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
                setApiProvider('built-in');
                setApiKey('');
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 font-semibold rounded text-[10px] transition"
            >
              Reset Defaults
            </button>
          </div>
        </div>
      )}

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
            <span className="text-[9px] text-slate-500 mb-1 px-1">
              {msg.sender === 'user' ? 'User' : msg.sender === 'system' ? 'System Logs' : 'SiteAgent AI'} • {msg.timestamp}
            </span>

            <div
              className={`p-3 text-xs leading-relaxed rounded-lg whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : msg.sender === 'system'
                  ? 'bg-slate-950/70 border border-slate-800/80 font-mono text-[10px] text-emerald-400 w-full'
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50'
              }`}
            >
              <div>{msg.text}</div>
              {msg.details && (
                <pre className="mt-2 p-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-300 overflow-x-auto whitespace-pre">
                  {msg.details}
                </pre>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="self-start flex flex-col items-start max-w-[85%]">
            <span className="text-[9px] text-slate-500 mb-1 px-1">SiteAgent AI • Thinking...</span>
            <div className="p-3 text-xs rounded-lg rounded-bl-none bg-slate-800/60 border border-slate-700/30 text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
              <span>Thinking and formulating design tools...</span>
            </div>
          </div>
        )}
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
      <div className="p-4 border-t border-slate-800 bg-slate-900 flex gap-2.5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={apiProvider === 'built-in' ? "Ask agent to add/style page..." : `Chat with AI agent (${apiProvider})...`}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-700"
        />
        <button
          onClick={handleSend}
          className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition active:scale-95"
        >
          Send
        </button>
      </div>
    </div>
  );
}
