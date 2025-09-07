// App constants
export const APP_NAME = "Room404";
export const APP_DESCRIPTION = "Collaborative developer documentation platform";

// Editor constants
export const DEFAULT_EDITOR_CONTENT = `
# Welcome to Room404

Start typing to create your first document...

## Features
- Real-time collaboration
- Markdown support
- File organization
- Team workspaces

Happy documenting! 🚀
`.trim();

// Theme constants
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
} as const;

// Permission constants
export const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  ADMIN: "admin",
} as const;

// File type constants
export const SUPPORTED_FILE_TYPES = {
  MARKDOWN: "markdown",
  DOCX: "docx",
  PDF: "pdf",
  SHEETS: "sheets",
} as const;
