import updates from "@/data/updates.json";

export default function LinkedInFeed() {
  return (
    <div className="bg-white border border-surrey-grey/30 flex flex-col overflow-hidden max-h-[480px]">

      {/* Header */}
      <div className="bg-surrey-blue border-b border-surrey-gold/20 p-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="font-mono text-white text-[11px] uppercase tracking-[0.2em]">Recent Updates</h3>
        </div>
        <a
          href="https://www.linkedin.com/company/surreycapitalresearch/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-surrey-gold uppercase tracking-widest hover:text-white transition-colors border-b border-surrey-gold/40 hover:border-white pb-px"
        >
          Follow →
        </a>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {updates.map((post) => (
          <div key={post.id} className="border-b border-surrey-grey/20 last:border-0 p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[9px] text-surrey-gold uppercase tracking-widest border border-surrey-gold/30 px-2 py-0.5">
                [{post.category}]
              </span>
              <span className="font-mono text-[10px] text-text-muted">{post.date}</span>
            </div>
            <p className="text-sm text-body-text leading-relaxed mb-3">
              {post.text}
            </p>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-surrey-gold uppercase tracking-widest hover:text-surrey-blue transition-colors border-b border-surrey-gold/40 hover:border-surrey-blue pb-px"
            >
              View on LinkedIn →
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}
