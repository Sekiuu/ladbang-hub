import Link from "next/link";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "link" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  href?: string;
};

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getVariantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
      return "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600";
    case "secondary":
      return "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400";
    case "ghost":
      return "bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-300";
    case "link":
      return "bg-transparent text-blue-600 hover:underline focus-visible:ring-blue-300";
    case "danger":
      return "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600";
    default:
      return "";
  }
}

function getSizeClasses(size: ButtonSize): string {
  switch (size) {
    case "sm":
      return "h-8 px-3 text-sm";
    case "md":
      return "h-10 px-4 text-sm";
    case "lg":
      return "h-12 px-5 text-base";
    case "icon":
      return "h-10 w-10 p-0 inline-flex items-center justify-center";
    default:
      return "";
  }
}

const ButtonUI = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] select-none";
    if (href) {
      return (
        <Link
          href={href}
          className={cn(
            baseClasses,
            getVariantClasses(variant),
            getSizeClasses(size),
            className
          )}
        >
          {children}
        </Link>
      );
    }
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          getVariantClasses(variant),
          getSizeClasses(size),
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent align-[-0.125em]"></span>
        ) : null}
        {children}
      </button>
    );
  }
);
ButtonUI.displayName = "Button";

export default ButtonUI;
