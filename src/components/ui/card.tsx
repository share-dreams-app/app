import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/components/ui/cn";

type CardTag = "article" | "aside" | "div" | "section";

type CardProps = {
  as?: CardTag;
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

export function Card({ as: Tag = "article", children, className, ...rest }: CardProps) {
  return (
    <Tag className={cn("sd-card", className)} {...rest}>
      {children}
    </Tag>
  );
}
