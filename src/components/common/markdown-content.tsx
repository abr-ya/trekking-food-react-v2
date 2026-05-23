import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

import { cn } from "@/lib/utils";

export type MarkdownContentProps = {
  /** Markdown source string. */
  source: string;
  className?: string;
};

/**
 * Renders Markdown for read-only display (About, previews).
 * Uses GFM (tables, strikethrough, task lists) and sanitizes HTML output.
 */
export const MarkdownContent = ({ source, className }: MarkdownContentProps) => {
  if (!source.trim()) {
    return null;
  }

  return (
    <div
      className={cn(
        "prose prose-sm prose-neutral dark:prose-invert max-w-none",
        "prose-headings:font-semibold prose-headings:text-foreground",
        "prose-p:text-muted-foreground prose-li:text-muted-foreground",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-code:text-foreground prose-code:bg-muted prose-code:rounded prose-code:px-1",
        "prose-pre:bg-muted prose-pre:text-foreground",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {source}
      </ReactMarkdown>
    </div>
  );
};
