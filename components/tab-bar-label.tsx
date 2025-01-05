import { ncn } from "@/utils/ncn";
import { ThemedText } from "@/components/themed-text";

type TabBarStyleProps = {
  focused: boolean;
  children: React.ReactNode;
  className?: string;
};

export function TabBarLabel({
  focused,
  children,
  className,
}: TabBarStyleProps) {
  return (
    <ThemedText
      className={ncn(
        "tracking-widest font-inter-semibold uppercase text-sm",
        focused ? "text-white/90" : "text-white/50",
        className,
      )}
    >
      {children}
    </ThemedText>
  );
}
