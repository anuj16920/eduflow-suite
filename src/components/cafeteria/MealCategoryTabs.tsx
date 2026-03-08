import { memo } from "react";
import { motion } from "framer-motion";
import { Coffee, UtensilsCrossed, Cookie, Moon } from "lucide-react";

const MEALS = [
  { key: "all", label: "All", icon: UtensilsCrossed },
  { key: "breakfast", label: "Breakfast", icon: Coffee },
  { key: "lunch", label: "Lunch", icon: UtensilsCrossed },
  { key: "snacks", label: "Snacks", icon: Cookie },
  { key: "dinner", label: "Dinner", icon: Moon },
];

interface Props {
  selected: string;
  onChange: (meal: string) => void;
}

export const MealCategoryTabs = memo(function MealCategoryTabs({ selected, onChange }: Props) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {MEALS.map(({ key, label, icon: Icon }) => {
        const isActive = selected === key;
        return (
          <motion.button
            key={key}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
              isActive
                ? "bg-secondary text-secondary-foreground shadow-sm"
                : "hover:bg-accent/50 text-muted-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </motion.button>
        );
      })}
    </div>
  );
});
