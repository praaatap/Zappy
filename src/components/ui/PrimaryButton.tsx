import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}

export const PrimaryButton = ({ children, isLoading, size = "md", className = "", ...props }: PrimaryButtonProps) => {
  const sizeClasses = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3 text-base"
  };

  return (
    <button 
        disabled={isLoading || props.disabled}
        className={`
            bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed
            text-white font-bold rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98]
            flex items-center justify-center gap-2
            ${sizeClasses[size]}
            ${className}
        `}
        {...props}
    >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
    </button>
  );
};