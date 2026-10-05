export function MarkdownText({ content }: { content: string }) {
  if (!content.trim()) return null;

  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="prose-trip max-w-3xl text-base leading-relaxed text-ocean-800">
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph.trim()}</p>
      ))}
    </div>
  );
}
