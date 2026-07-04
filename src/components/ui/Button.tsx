import React, { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
const baseStyles = `
inline-flex items-center justify-center gap-2
rounded-lg font-medium
transition-all duration-200
focus:outline-none
focus-visible:ring-2
focus-visible:ring-offset-2
disabled:cursor-not-allowed
disabled:opacity-50
active:scale-95
`;

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",

  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400",

  outline:
    "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-400",

  ghost: "text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-400",

  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",

  success:
    "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",

  warning:
    "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500",

  link: "text-blue-600 underline underline-offset-4 hover:no-underline p-0",
} as const;

const sizes = {
  xs: "h-8 px-3 text-xs",

  sm: "h-9 px-4 text-sm",

  md: "h-10 px-5 text-sm",

  lg: "h-12 px-6 text-base",

  xl: "h-14 px-8 text-lg",

  icon: "h-10 w-10 p-0",
} as const;

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      className="opacity-25"
    />

    <path
      fill="currentColor"
      className="opacity-90"
      d="M12 2a10 10 0 00-10 10h4a6 6 0 016-6V2z"
    />
  </svg>
);

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  ...props
}) => {
  const classes = [
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  return (
    <button disabled={disabled || loading} className={classes} {...props}>
      {loading ? (
        <>
          <Spinner />
          Loading...
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

export default Button;
