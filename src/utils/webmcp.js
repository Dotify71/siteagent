/**
 * WebMCP Tool Registration Utility
 * Registers imperative web tools directly on the browser's modelContext.
 */
export function registerWebMCPTools({
  getCanvasState,
  addSection,
  editSectionText,
  updateStyling,
  swapLayout,
  deleteSection,
}) {
  if (typeof document === 'undefined') return false;

  // WebMCP specifications define modelContext under document or navigator
  const modelContext = document.modelContext || (window.navigator && window.navigator.modelContext);

  if (!modelContext) {
    console.warn("WebMCP is not natively enabled in this browser (Chrome flag or ChatGPT app required). Live simulator will run instead.");
    return false;
  }

  try {
    // 1. Get Canvas State
    modelContext.registerTool({
      name: "getCanvasState",
      description: "Gets the current active layout structure, sections list, and styling variables of the visual page.",
      inputSchema: { type: "object", properties: {} },
      execute: async () => {
        const state = getCanvasState();
        return { success: true, state };
      }
    });

    // 2. Add Section
    modelContext.registerTool({
      name: "addSection",
      description: "Adds a new website section (hero, features, pricing, contact, gallery) to the preview canvas.",
      inputSchema: {
        type: "object",
        properties: {
          type: { 
            type: "string", 
            enum: ["hero", "features", "pricing", "contact", "gallery"],
            description: "The type of layout block to insert"
          },
          content: { 
            type: "object", 
            description: "JSON properties for the section's contents (tagline, title, description, items, etc.)" 
          }
        },
        required: ["type", "content"]
      },
      execute: async (args) => {
        addSection(args.type, args.content);
        return { success: true, message: `Successfully added ${args.type} section.` };
      }
    });

    // 3. Edit Section Text
    modelContext.registerTool({
      name: "editSectionText",
      description: "Edits title, tagline, description, list items, or image URLs of an existing section.",
      inputSchema: {
        type: "object",
        properties: {
          sectionId: { 
            type: "string", 
            description: "ID of the target section (e.g., 'hero-1', 'features-2')" 
          },
          updates: { 
            type: "object", 
            description: "Key-value pairs of updates to apply to the section's content (e.g. title, description, tagline, imageUrl, items, plans)" 
          }
        },
        required: ["sectionId", "updates"]
      },
      execute: async (args) => {
        editSectionText(args.sectionId, args.updates);
        return { success: true, message: `Successfully updated section ${args.sectionId}.` };
      }
    });

    // 4. Update Styling
    modelContext.registerTool({
      name: "updateStyling",
      description: "Updates theme styles including fonts, primary brand colors, background themes, and corner rounding.",
      inputSchema: {
        type: "object",
        properties: {
          primaryColor: { type: "string", description: "Primary brand theme hex code (e.g., '#ef4444')" },
          primaryHover: { type: "string", description: "Hex code for primary hover states (e.g. '#dc2626')" },
          bgColor: { type: "string", description: "General background canvas hex code (e.g., '#ffffff' or '#0f172a')" },
          textColor: { type: "string", description: "Main text color hex code (e.g., '#111827' or '#f8fafc')" },
          borderRadius: { type: "string", description: "CSS border radius string (e.g., '0.25rem', '0.5rem', '9999px', or '0px')" },
          fontFamily: { 
            type: "string", 
            enum: ["'Inter', sans-serif", "'Playfair Display', serif", "'Roboto Mono', monospace"],
            description: "Font styling family to apply"
          }
        }
      },
      execute: async (args) => {
        updateStyling(args);
        return { success: true, message: "Successfully updated global canvas styles." };
      }
    });

    // 5. Swap Layout
    modelContext.registerTool({
      name: "swapLayout",
      description: "Toggles or shifts layout styles for components that support variations (e.g., alignment in Hero, columns count in Features, layout grid in Contact).",
      inputSchema: {
        type: "object",
        properties: {
          sectionId: { type: "string", description: "ID of the target section" },
          layoutKey: { type: "string", description: "The styling key to swap (e.g., 'align' for hero, 'columns' for features, 'layout' for contact)" },
          value: { type: "string", description: "The target layout option (e.g. 'center'/'left' for hero, '2'/'3' for features, 'grid'/'stacked' for contact)" }
        },
        required: ["sectionId", "layoutKey", "value"]
      },
      execute: async (args) => {
        swapLayout(args.sectionId, args.layoutKey, args.value);
        return { success: true, message: `Swapped layout on section ${args.sectionId}.` };
      }
    });

    // 6. Delete Section
    modelContext.registerTool({
      name: "deleteSection",
      description: "Deletes a section from the visual preview canvas.",
      inputSchema: {
        type: "object",
        properties: {
          sectionId: { type: "string", description: "ID of the section to remove" }
        },
        required: ["sectionId"]
      },
      execute: async (args) => {
        deleteSection(args.sectionId);
        return { success: true, message: `Deleted section ${args.sectionId}.` };
      }
    });

    console.log("WebMCP Tools registered successfully on document.modelContext.");
    return true;
  } catch (err) {
    console.error("Error registering WebMCP tools: ", err);
    return false;
  }
}
