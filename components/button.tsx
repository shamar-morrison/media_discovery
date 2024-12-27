import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import React from "react";

interface ButtonProps extends TouchableOpacityProps {}

export function Button(props: ButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      className={
        "bg-primary-300 text-white rounded-xl py-3 px-10 flex flex-row gap-1 items-center justify-center"
      }
    >
      {props.children}
    </TouchableOpacity>
  );
}
