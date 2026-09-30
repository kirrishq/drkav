import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "./lib/cn";

export const buttonVariants = cva(
  [
    "focus-ring relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2",
    "type-label whitespace-nowrap transition-colors duration-fast ease-standard",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "disabled:border-transparent disabled:bg-disabled-background disabled:text-disabled-foreground",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-inverse shadow-subtle hover:bg-accent-hover active:bg-accent-hover",
        secondary:
          "bg-surface-muted text-primary hover:bg-border active:bg-border-strong",
        outline:
          "border border-border-strong bg-surface text-primary hover:bg-surface-muted active:bg-border",
        ghost:
          "bg-transparent text-primary hover:bg-surface-muted active:bg-border",
        link: "bg-transparent text-accent underline-offset-4 hover:underline active:text-accent-hover",
      },
      selected: {
        false: "",
        true: "",
      },
      size: {
        sm: "min-h-10 rounded-md px-3",
        md: "min-h-11 rounded-md px-4",
        lg: "min-h-12 rounded-lg px-6",
        icon: "size-11 rounded-md",
      },
    },
    compoundVariants: [
      {
        className:
          "border-accent bg-accent-soft text-accent hover:border-accent-hover hover:bg-accent-soft active:bg-accent-soft",
        selected: true,
        variant: "outline",
      },
    ],
    defaultVariants: {
      selected: false,
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
export type ButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>["size"]
>;

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "disabled"
>;

type SharedButtonProps = NativeButtonProps & {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  selected?: boolean;
  variant?: ButtonVariant;
};

type IconButtonProps = SharedButtonProps & {
  "aria-label": string;
  size: "icon";
};

type TextButtonProps = SharedButtonProps & {
  "aria-label"?: string;
  size?: Exclude<ButtonSize, "icon">;
};

export type ButtonProps = IconButtonProps | TextButtonProps;

function LoadingSpinner() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 animate-spin motion-reduce:animate-none"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

export function Button({
  children,
  className,
  disabled = false,
  loading = false,
  selected = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const content: ReactNode = children;

  return (
    <button
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ selected, variant, size }), className)}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
        {content}
      </span>
      {loading ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 inline-flex items-center justify-center"
        >
          <LoadingSpinner />
        </span>
      ) : null}
    </button>
  );
}
