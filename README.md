# 🤖 SiteAgent: No-Code Visual Page Builder (WebMCP Hackathon Submission)

**SiteAgent** is a collaborative website design and generation canvas built for the **OpenAI WebMCP Challenge**. It allows users to design, style, and structure websites dynamically in partnership with AI models.

The page exposes high-level visual styling and layout tools directly to the browser or ChatGPT in-app browser using the experimental **WebMCP (Web Model Context Protocol)** open standard. 

---

## ✨ Features

1. **Visual Preview Canvas**: Live-renders responsive Tailwind CSS layout blocks (Hero, Features Showcase, pricing grids, Contact Forms, Gallery grids) configured dynamically.
2. **CSS Variables Theme Engine**: Styling properties (colors, border-radius, typography) are linked to CSS Custom Properties, enabling instant global design updates.
3. **WebMCP Bridge**: Registers native web tools on `document.modelContext` so in-browser agents can read, update, or remove sections and styles.
4. **Agent Simulator Chat**: A built-in sidebar running a rule-based execution agent. This simulates the exact tool call executions, allowing judges and developers to test the agentic capabilities immediately in any standard browser without configuring flags.
5. **JSON Configuration Exporter**: View and export the structured layout design built by the agent with one click.

---

## 🔌 Exposed WebMCP Tools

SiteAgent registers the following tools in the browser:

* `getCanvasState()`: Returns the active layout tree JSON and current CSS theme variables.
* `addSection(type, content)`: Inserts a new component (`hero`, `features`, `pricing`, `contact`, `gallery`) onto the canvas.
* `editSectionText(sectionId, updates)`: Modifies text parameters, images, or CTA configurations.
* `updateStyling(styles)`: Updates hex colors, typography family, and border-radius.
* `swapLayout(sectionId, layoutKey, value)`: Toggles section layouts (e.g. text alignment, grid counts).
* `deleteSection(sectionId)`: Removes a section from the page.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository, enter the directory, and install dependencies:
```bash
cd siteagent
npm install
```

### 2. Run Local Development Server
Start Vite's development server:
```bash
npm run dev
```
Open the provided local URL (typically `http://localhost:5173`) in your browser.

---

## 🛠️ Testing WebMCP

### Method A: ChatGPT In-App Browser (Automatic)
Open your deployed SiteAgent URL in **ChatGPT's in-app browser** (available on mobile and desktop apps). ChatGPT supports WebMCP natively out of the box. You can ask it to:
> *"Add a hero and pricing section to the page, and set the primary brand theme to emerald green."*

### Method B: Google Chrome Flags (Manual)
1. Install **Google Chrome version 149** or later.
2. Navigate to `chrome://flags/#enable-webmcp-testing` in the address bar.
3. Enable the flag and restart Chrome.
4. Open the dev console (`F12`) on the running SiteAgent page and inspect/debug the registered tools under the WebMCP dev panels or interact via script command line.

### Method C: Agent Simulator (Standard Browsers)
If you are running a standard web browser without experimental flags enabled, use the **WebMCP Agent Simulator** sidebar on the right. 
* Type commands like `add hero`, `make it dark`, `change font to Playfair Display`, or click the quick action preset buttons.
* The simulator will print the exact **🔧 WebMCP Tool Call** JSON payloads that are executed under the hood.
