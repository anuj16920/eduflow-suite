import { memo } from "react";
import { motion } from "framer-motion";
import { Flame, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface MenuItem {
  id: string;
  foodName: string;
  description: string | null;
  ingredients: string | null;
  calories: number | null;
  mealCategory: string;
  dayOfWeek: number;
  imageUrl: string | null;
  isVegetarian: boolean;
  isAvailable: boolean;
}

const MEAL_COLORS: Record<string, string> = {
  breakfast: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  lunch: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  snacks: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  dinner: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

const FOOD_GRADIENTS = [
  "from-amber-500/20 to-orange-500/10",
  "from-emerald-500/20 to-teal-500/10",
  "from-rose-500/20 to-pink-500/10",
  "from-blue-500/20 to-indigo-500/10",
  "from-violet-500/20 to-purple-500/10",
  "from-cyan-500/20 to-sky-500/10",
];

interface Props {
  item: MenuItem;
  index: number;
  onClick: (item: MenuItem) => void;
}

export const MenuCard = memo(function MenuCard({ item, index, onClick }: Props) {
  const gradient = FOOD_GRADIENTS[index % FOOD_GRADIENTS.length];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.25 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onClick(item)}
          className={`w-full text-left rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-lg ${
            !item.isAvailable ? "opacity-50" : ""
          }`}
        >
          {/* Image / gradient placeholder */}
          <div className={`h-28 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.foodName} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <span className="text-3xl">🍽️</span>
            )}
            {item.isVegetarian && (
              <div className="absolute top-2 left-2 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <Leaf className="h-3 w-3 text-green-600" />
              </div>
            )}
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">Unavailable</span>
              </div>
            )}
          </div>

          <div className="p-3 space-y-1.5">
            <p className="text-sm font-semibold truncate">{item.foodName}</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className={`text-[10px] ${MEAL_COLORS[item.mealCategory] || ""}`}>
                {item.mealCategory}
              </Badge>
              {item.calories && (
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Flame className="h-3 w-3" /> {item.calories} cal
                </span>
              )}
            </div>
          </div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px] text-xs space-y-1">
        <p className="font-semibold">{item.foodName}</p>
        {item.description && <p className="text-muted-foreground">{item.description}</p>}
        {item.ingredients && <p>🧾 {item.ingredients}</p>}
      </TooltipContent>
    </Tooltip>
  );
});
