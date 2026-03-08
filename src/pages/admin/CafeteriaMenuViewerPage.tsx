import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChefHat, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { DaySelectorPanel, MealCategoryTabs, MenuCard, MenuDetailModal } from "@/components/cafeteria";
import type { MenuItem } from "@/components/cafeteria/MenuCard";

export default function CafeteriaMenuViewerPage() {
  const today = new Date().getDay() || 6; // Convert Sunday=0 to 6, else keep 1-6
  const adjustedToday = today === 0 ? 6 : today;

  const [selectedDay, setSelectedDay] = useState(adjustedToday > 6 ? 1 : adjustedToday);
  const [mealFilter, setMealFilter] = useState("all");
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("cafeteria_menu")
        .select("*")
        .order("meal_category")
        .order("food_name");

      setAllItems(
        (data || []).map((d: any) => ({
          id: d.id,
          foodName: d.food_name,
          description: d.description,
          ingredients: d.ingredients,
          calories: d.calories,
          mealCategory: d.meal_category,
          dayOfWeek: d.day_of_week,
          imageUrl: d.image_url,
          isVegetarian: d.is_vegetarian || false,
          isAvailable: d.is_available !== false,
        }))
      );
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      if (item.dayOfWeek !== selectedDay) return false;
      if (mealFilter !== "all" && item.mealCategory !== mealFilter) return false;
      return true;
    });
  }, [allItems, selectedDay, mealFilter]);

  const dayCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allItems.filter((i) => i.dayOfWeek === selectedDay).forEach((i) => {
      counts[i.mealCategory] = (counts[i.mealCategory] || 0) + 1;
    });
    counts["all"] = allItems.filter((i) => i.dayOfWeek === selectedDay).length;
    return counts;
  }, [allItems, selectedDay]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Dashboard</span><span>/</span><span>Cafeteria</span><span>/</span><span className="text-foreground font-medium">Menu</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" /> Cafeteria Menu
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      {/* Day Selector */}
      <Card className="rounded-2xl">
        <CardContent className="pt-5 pb-4">
          <DaySelectorPanel selectedDay={selectedDay} onDayChange={setSelectedDay} />
        </CardContent>
      </Card>

      {/* Meal Tabs */}
      <div className="flex items-center justify-between gap-4">
        <MealCategoryTabs selected={mealFilter} onChange={setMealFilter} />
        <span className="text-xs text-muted-foreground whitespace-nowrap">{filtered.length} items</span>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-16 text-center text-muted-foreground">
            <ChefHat className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No menu items found for this day and category.</p>
            <p className="text-xs mt-1">Try selecting a different day or meal category.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} onClick={setDetailItem} />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <MenuDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
    </motion.div>
  );
}
