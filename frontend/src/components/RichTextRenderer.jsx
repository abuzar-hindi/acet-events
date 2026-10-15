// src/components/RichTextRenderer.jsx
// Lightweight, secure rich-text parser & renderer supporting:
// Bold (**text**), Italic (*text*), [gold]...[/gold], [magenta]...[/magenta], [purple]...[/purple]

import React from 'react';

/**
 * Parses inline formatting tags into React nodes safely.
 */
function parseInline(text) {
  if (!text) return null;

  // Regex to match rich text tags:
  // 1: [gold]...[/gold]
  // 2: [magenta]...[/magenta]
  // 3: [purple]...[/purple]
  // 4: **bold**
  // 5: *italic*
  const pattern = /(\[gold\][\s\S]*?\[\/gold\]|\[magenta\][\s\S]*?\[\/magenta\]|\[purple\][\s\S]*?\[\/purple\]|\*\*[\s\S]*?\*\*|\*[^*\n]+?\*)/g;

  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith('[gold]') && part.endsWith('[/gold]')) {
      const inner = part.slice(6, -7);
      return (
        <span key={index} className="font-semibold text-[#b8860b] dark:text-[#ffd54f]" style={{ color: '#d4a017' }}>
          {parseInline(inner)}
        </span>
      );
    }

    if (part.startsWith('[magenta]') && part.endsWith('[/magenta]')) {
      const inner = part.slice(9, -10);
      return (
        <span key={index} className="font-semibold" style={{ color: '#e91e63' }}>
          {parseInline(inner)}
        </span>
      );
    }

    if (part.startsWith('[purple]') && part.endsWith('[/purple]')) {
      const inner = part.slice(8, -9);
      return (
        <span key={index} className="font-semibold" style={{ color: '#5e35b1' }}>
          {parseInline(inner)}
        </span>
      );
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold font-mukta">
          {parseInline(inner)}
        </strong>
      );
    }

    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} className="italic font-display">
          {parseInline(inner)}
        </em>
      );
    }

    return part;
  });
}

/**
 * RichTextRenderer splits text into paragraphs while preserving line breaks.
 */
export default function RichTextRenderer({ text, className = '', pClassName = 'mb-4' }) {
  if (!text) return null;

  // Split into paragraphs by double line breaks
  const paragraphs = text.split(/\n\s*\n/);

  return (
    <div className={`rich-text-content ${className}`}>
      {paragraphs.map((p, pIndex) => {
        // Split internal lines by single line break
        const lines = p.split('\n');
        return (
          <p key={pIndex} className={pIndex === paragraphs.length - 1 ? '' : pClassName}>
            {lines.map((line, lIndex) => (
              <React.Fragment key={lIndex}>
                {parseInline(line)}
                {lIndex < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
