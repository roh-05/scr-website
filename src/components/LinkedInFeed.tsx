import Link from "next/link";
import updates from "@/data/updates.json";

export default function LinkedInFeed() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full max-h-full overflow-hidden">

      {/* Header */}
      <div className="bg-[#fafbf8] border-b border-gray-200 p-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <h3 className="text-lg font-bold text-surrey-blue">Recent Updates</h3>
        </div>
        <a
          href="https://www.linkedin.com/company/surreycapitalresearch/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#0A66C2] hover:underline shrink-0"
        >
          Follow Us
        </a>
      </div>

      {/* Scrollable Feed Area */}
      {/* Adding overflow-y-auto and min-h-0 ensures it scrolls instead of stretching the box */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6">
        {updates.map((post) => (
          <div key={post.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {post.category}
              </span>
              <span className="text-xs text-gray-400">{post.date}</span>
            </div>
            <p className="text-sm text-surrey-blue leading-relaxed mb-3">
              {post.text}
            </p>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-surrey-gold hover:text-[#8a7934] transition-colors"
            >
              View on LinkedIn &rarr;
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}