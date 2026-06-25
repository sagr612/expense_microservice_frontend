import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

const variantStyles = {
  primary: {
    button: "bg-transparent border border-indigo-500",
    text: "text-indigo-500",
  },
  secondary: {
    button: "bg-transparent border border-indigo-500",
    text: "text-indigo-500",
  },
  danger: {
    button: "bg-transparent border border-red-500",
    text: "text-red-500",
  },
};

const Button = ({
  title,
  onPress,
  icon,
  variant = "primary",
  disabled = false,
}: ButtonProps) => {
  const styles = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className={`flex-row items-center justify-center px-6 py-4 rounded-xl gap-2 ${styles.button} ${disabled ? "opacity-40" : ""}`}
    >
      {icon && <View className="items-center justify-center">{icon}</View>}
      <Text className={`text-base font-semibold ${styles.text}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
