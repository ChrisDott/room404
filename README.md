# Room404 - Collaborative Developer Documentation Platform

Room404 is a collaborative developer documentation platform that combines the speed and familiarity of an IDE with the collaboration features of modern web applications. It's designed for development teams to manage, organize, and collaborate on technical documentation, specifications, and project artifacts.

## 🚀 Core Vision

- **IDE-like Experience**: Fast, responsive interface with familiar developer UX patterns
- **Real-time Collaboration**: Multiple team members can work simultaneously on documentation
- **Universal Document Support**: Drag-and-drop support for various file formats (DOCX, Google Sheets, etc.)
- **Markdown-Centric**: All documents converted to and displayed as markdown for consistency
- **Project Organization**: Hierarchical project structure with team-based access control

## ✨ Key Features

### Core IDE Features
- **File Explorer**: Left sidebar with draggable file tree
- **Split Pane Editor**: Multiple documents open simultaneously
- **Global Search**: Fast full-text search across all documents
- **Command Palette**: Quick actions and navigation (Ctrl+Shift+P)
- **Syntax Highlighting**: Code blocks with language-specific highlighting
- **Auto-save**: Real-time document persistence

### Collaboration Features
- **Real-time Editing**: Multiple cursors, live document updates
- **Team Workspaces**: Organization-level project management
- **Access Control**: Role-based permissions (Owner, Editor, Viewer)
- **Activity Feed**: Track changes and document history
- **Comments & Reviews**: Inline commenting system
- **Version History**: Git-like versioning for documents

### Document Management
- **Drag & Drop Upload**: Support for DOCX, PDF, Google Sheets, images
- **Format Conversion**: Automatic conversion to markdown
- **Rich Media Support**: Embedded images, diagrams, tables
- **Link Management**: Internal cross-references between documents
- **Templates**: Pre-built templates for common document types
- **Export Options**: Export to PDF, HTML, or original formats

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Database & Backend**: Convex for real-time data and serverless functions
- **Styling**: Tailwind CSS + Radix UI primitives
- **Editor**: TipTap (ProseMirror-based collaborative editor)
- **Real-time Collaboration**: Yjs for operational transforms
- **Authentication**: Convex Auth
- **Deployment**: Vercel (frontend) + Convex (backend)

## 🏗️ Project Structure

```
room404/
├── app/                    # Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages and layouts
│   │   ├── components/    # React components
│   │   │   ├── ui/        # Reusable UI components
│   │   │   ├── editor/    # Editor-related components
│   │   │   ├── layout/    # Layout components
│   │   │   └── collaboration/ # Collaboration features
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   └── types/         # TypeScript type definitions
│   ├── public/            # Static assets
│   └── convex/            # Convex backend functions and schema
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChrisDott/room404.git
   cd room404
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Set up Convex** (Coming in next phase)
   ```bash
   npx convex dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗺️ Development Roadmap

### Phase 1: Core MVP ✅
- [x] Next.js 14 project setup with TypeScript
- [x] Tailwind CSS + Radix UI configuration
- [x] Project structure and dependencies
- [x] Basic landing page and design system

### Phase 2: Backend Setup (In Progress)
- [ ] Convex database setup and schema
- [ ] Basic CRUD operations for documents and projects
- [ ] User authentication system

### Phase 3: Editor & Collaboration
- [ ] TipTap editor integration
- [ ] Real-time collaboration with Yjs
- [ ] Document management system

### Phase 4: Advanced Features
- [ ] Team workspaces and permissions
- [ ] File upload and conversion
- [ ] Advanced UI components and layouts

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [https://github.com/ChrisDott/room404](https://github.com/ChrisDott/room404)
- **Documentation**: Coming soon
- **Issues**: [GitHub Issues](https://github.com/ChrisDott/room404/issues)

---

Built with ❤️ for developer teams who value great documentation.
