import { cn } from "@/components/ui/cn";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  className
}: SectionHeaderProps) {
  return (
    <header className={cn("sd-section-header", className)}>
      <p className="sd-eyebrow">{eyebrow}</p>
      <h1 className="sd-title">{title}</h1>
      {description ? <p className="sd-subtitle">{description}</p> : null}
    </header>
  );
}
