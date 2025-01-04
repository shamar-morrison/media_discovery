import { ThemedText } from "@/components/themed-text";

type TabBarStyleProps = {
  focused: boolean;
  children: React.ReactNode;
};

export function TabBarLabel({ focused, children }: TabBarStyleProps) {
  return (
    <ThemedText
      className={`tracking-widest font-inter-semibold uppercase ${
        focused ? "text-white/90" : "text-white/50"
      }`}
    >
      {children}
    </ThemedText>
  );
}
