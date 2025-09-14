"use client";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses = `font-semibold py-1 px-4 rounded-md shadow-md transition-all duration-200 box-border`;

  const getButtonStyles = () => {
    if (variant === "primary") {
      return {
        className: `${baseClasses} text-white cursor-pointer ${className}`,
        style: {
          background: "linear-gradient(180deg, #3C4BFF 0%, #242D99 166.07%)",
          border: "2px solid transparent",
          boxSizing: "border-box" as const,
        },
        onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.border = "2px solid #3C4BFF";
          e.currentTarget.style.color = "#3C4BFF";
        },
        onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background =
            "linear-gradient(180deg, #3C4BFF 0%, #242D99 166.07%)";
          e.currentTarget.style.border = "2px solid transparent";
          e.currentTarget.style.color = "white";
        },
      };
    }
    return {
      className: `${baseClasses} text-[#3C4BFF] bg-white border-2 border-[#3C4BFF] hover:bg-[#3C4BFF] hover:text-white cursor-pointer transition-all duration-200 ${className}`,
      style: {
        boxSizing: "border-box" as const,
      },
      onMouseEnter: undefined,
      onMouseLeave: undefined,
    };
  };

  const buttonStyles = getButtonStyles();

  return (
    <button
      {...props}
      className={buttonStyles.className}
      style={buttonStyles.style}
      onMouseEnter={buttonStyles.onMouseEnter}
      onMouseLeave={buttonStyles.onMouseLeave}
    >
      {children}
    </button>
  );
};

export default Button;
