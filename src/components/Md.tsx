import ReactMarkdown from 'react-markdown';

// react-markdown builds React elements (no raw HTML), and its default URL filter drops javascript: links.
export default function Md({ children }: { children: string }) {
  return (
    <div className="md">
      <ReactMarkdown components={{ a: ({ node: _n, ...p }) => <a {...p} target="_blank" rel="noopener noreferrer" /> }}>{children}</ReactMarkdown>
    </div>
  );
}
