import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Leaf, UtensilsCrossed, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MenuItem } from "./MenuCard";

interface Props {
  item: MenuItem | null;
  onClose: () => void;
}

export const MenuDetailModal = memo(function MenuDetailModal({ item, onClose }: Props) {
  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        {item && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                {item.foodName}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">{item.mealCategory}</Badge>
                {item.isVegetarian && (
                  <Badge variant="outline" className="text-xs gap-1 text-green-600 border-green-500/30">
                    <Leaf className="h-3 w-3" /> Vegetarian
                  </Badge>
                )}
                {item.calories && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Flame className="h-3 w-3" /> {item.calories} cal
                  </Badge>
                )}
              </div>

              {item.description && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{item.description}</p>
                </div>
              )}

              {item.ingredients && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Ingredients</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.ingredients.split(",").map((ing, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded-lg">{ing.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {!item.isAvailable && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-center">
                  <p className="text-xs text-destructive font-medium">This item is currently unavailable</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
});
