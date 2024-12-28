import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import React from "react";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "default" | "outline";
}

const defaultStyles = "bg-primary-300";
const outlineStyles = "bg-transparent border border-accent-100";

export function Button({
  variant = "default",
  className,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      className={`text-white rounded-xl py-3 px-10 flex flex-row gap-1 items-center justify-center ${
        variant === "default" ? defaultStyles : outlineStyles
      } ${className}`}
    >
      {props.children}
    </TouchableOpacity>
  );
}
