import { FileText, Users, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Room404
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Collaborative developer documentation platform that combines the speed of an IDE 
            with real-time collaboration features.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Get Started
            </button>
            <button className="border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <FileText className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">IDE-like Experience</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Fast, responsive interface with familiar developer UX patterns and keyboard shortcuts.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Users className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real-time Collaboration</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Multiple team members can work simultaneously with live cursors and presence.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Zap className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Universal Documents</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Drag-and-drop support for DOCX, PDF, Google Sheets with markdown conversion.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Globe className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Team Workspaces</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Organized project structure with team-based access control and permissions.
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Project setup completed! Ready for next steps.</span>
          </div>
        </div>
      </div>
    </div>
  );
}