// Basic types for Room404
export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    theme: "light" | "dark";
    editorSettings: {
      fontSize: number;
      wordWrap: boolean;
      minimap: boolean;
    };
  };
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  teamIds: string[];
  createdAt: number;
  updatedAt: number;
  settings: {
    visibility: "private" | "team" | "public";
    allowComments: boolean;
    defaultPermissions: "read" | "write";
  };
}

export interface Document {
  _id: string;
  projectId: string;
  name: string;
  content: string; // Markdown content
  path: string; // File path in project tree
  type: "markdown" | "converted" | "template";
  originalFormat?: "docx" | "pdf" | "sheets";
  authorId: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  metadata: {
    wordCount: number;
    lastEditor: string;
    version: number;
  };
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  memberIds: string[];
  createdAt: number;
}
