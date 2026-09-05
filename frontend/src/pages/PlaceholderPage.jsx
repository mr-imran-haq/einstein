export default function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="text-center">
        <h2 className="font-display text-xl text-ink">{title}</h2>
        <p className="text-muted text-sm mt-2">This section is built in a later phase.</p>
      </div>
    </div>
  );
}