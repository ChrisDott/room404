"use client";
import { useState } from "react";
import DocumentEditor from "@/components/editor/DocumentEditor";
import SimpleEditor from "@/components/editor/SimpleEditor";

const SAMPLE_CONTENT = `
<h1>Welcome to Room404 Editor</h1>
<p>This is a sample document to test the TipTap editor functionality. You can:</p>
<ul>
  <li><strong>Format text</strong> with bold, italic, and other styles</li>
  <li><em>Create lists</em> like this one</li>
  <li>Add <code>inline code</code> snippets</li>
</ul>
<h2>Features</h2>
<blockquote>
  <p>The editor includes auto-save functionality with debouncing, so your changes are automatically saved as you type.</p>
</blockquote>
<h3>Code Example</h3>
<pre><code>function hello() {
  console.log("Hello, Room404!");
}</code></pre>
<p>Try editing this content to see the auto-save in action!</p>
`;

export default function EditorTestPage() {
  const [savedContent, setSavedContent] = useState(SAMPLE_CONTENT);
  const [saveCount, setSaveCount] = useState(0);

  const handleSave = async (content: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSavedContent(content);
    setSaveCount(prev => prev + 1);
    console.log('Content saved:', content.substring(0, 100) + '...');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">TipTap Editor Test</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the editor functionality with auto-save and toolbar features.
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Save count: {saveCount}
          </div>
        </div>

        <div className="space-y-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Simple Editor Test</h2>
            <SimpleEditor />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Full Document Editor</h2>
            <DocumentEditor
              initialContent={SAMPLE_CONTENT}
              onSave={handleSave}
              placeholder="Start writing your test document..."
              autoSave={true}
              className="shadow-lg"
            />
          </div>
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          <details className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <summary className="cursor-pointer font-medium">
              View Saved Content (Raw HTML)
            </summary>
            <pre className="mt-4 text-xs bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto">
              {savedContent}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
