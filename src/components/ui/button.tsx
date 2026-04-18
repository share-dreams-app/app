import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  className,
  fullWidth = false,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "sd-button",
        `sd-button--${variant}`,
        fullWidth ? "sd-button--full" : undefined,
        className
      )}
      {...rest}
    />
  );
}
