import { BookOpen } from "lucide-react";

interface DocNavLinkProps {
  className?: string;
  showLabel?: boolean;
}

export default function DocNavLink({
  className = "",
  showLabel = true,
}: DocNavLinkProps) {
  return (
    <a
      href="/documentation"
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ||
        "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface border border-transparent hover:border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      }
      title="Open project documentation in a new tab"
    >
      <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
      {showLabel && <span>Documentation</span>}
    </a>
  );
}
