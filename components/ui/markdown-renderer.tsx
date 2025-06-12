'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-garden-dark mb-3 mt-4 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-garden-dark mb-2 mt-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-garden-dark mb-2 mt-3 first:mt-0">
              {children}
            </h3>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <p className="text-garden-dark mb-3 leading-relaxed">
              {children}
            </p>
          ),
          
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1 text-garden-dark">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1 text-garden-dark">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-2">
              {children}
            </li>
          ),
          
          // Links
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-garden-light hover:text-garden-medium underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Code
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-garden-cream px-1 py-0.5 rounded text-sm font-mono text-garden-dark">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-garden-cream p-3 rounded-md text-sm font-mono text-garden-dark overflow-x-auto">
                {children}
              </code>
            );
          },
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-garden-light pl-4 py-2 bg-garden-cream/30 mb-3 italic text-garden-medium">
              {children}
            </blockquote>
          ),
          
          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-semibold text-garden-dark">
              {children}
            </strong>
          ),
          
          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-garden-medium">
              {children}
            </em>
          ),
          
          // Horizontal rule
          hr: () => (
            <hr className="border-garden-light/30 my-4" />
          ),
          
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-garden-light/30 rounded-md">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-garden-cream">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-garden-light/30 px-3 py-2 text-left font-semibold text-garden-dark">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-garden-light/30 px-3 py-2 text-garden-dark">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 