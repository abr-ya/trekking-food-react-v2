import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type PageColumnProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

/** Single column on a page: optional heading, description, then content. */
export const PageColumn = ({ children, title, description }: PageColumnProps) => (
  <div className="flex flex-col gap-2 w-1/2">
    {title != null && title !== "" && <h2 className="text-lg font-bold">{title}</h2>}
    {description != null && description !== "" && <p className="text-muted-foreground text-sm">{description}</p>}
    {children}
  </div>
);

type ColumnsWrapperProps = PropsWithChildren<{
  className?: string;
}>;

export const ColumnsWrapper = ({ children, className }: ColumnsWrapperProps) => (
  <div className={cn("flex gap-4", className)}>{children}</div>
);
