import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Coffee, Clock, Users, Plus } from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { id: 1, meal: "Breakfast", time: "7:30 AM - 9:00 AM", items: "Idli, Dosa, Upma, Tea/Coffee", status: "served" },
  { id: 2, meal: "Lunch", time: "12:30 PM - 1:30 PM", items: "Rice, Dal, Sabji, Roti, Salad", status: "upcoming" },
  { id: 3, meal: "Snacks", time: "4:00 PM - 5:00 PM", items: "Samosa, Juice, Biscuits", status: "upcoming" },
  { id: 4, meal: "Dinner", time: "7:30 PM - 9:00 PM", items: "Chapati, Paneer, Rice, Dal", status: "upcoming" },
];

export default function CafeteriaManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cafeteria Management</h1>
          <p className="text-muted-foreground">Manage daily meals, menu planning, and kitchen operations</p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Plan Menu</Button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatsCard title="Today's Meals" value={4} icon={UtensilsCrossed} />
        <StatsCard title="Students Served" value={842} icon={Users} variant="success" />
        <StatsCard title="Staff Meals" value={56} icon={Coffee} variant="primary" />
        <StatsCard title="Next Meal In" value="1h 20m" icon={Clock} variant="warning" />
      </div>

      <SimpleCard title="Today's Menu">
        <div className="grid gap-4 md:grid-cols-2">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.meal}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{item.time}
                    </p>
                  </div>
                </div>
                <Badge className={item.status === "served" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.items}</p>
            </motion.div>
          ))}
        </div>
      </SimpleCard>
    </div>
  );
}
