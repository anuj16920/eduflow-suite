import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Shield, BookOpen, GraduationCap, Users, ChevronDown, Check } from "lucide-react";

const portals = [
  { role: "admin", label: "Admin Portal", icon: Shield, color: "text-primary" },
  { role: "teacher", label: "Teacher Portal", icon: BookOpen, color: "text-accent-foreground" },
  { role: "student", label: "Student Portal", icon: GraduationCap, color: "text-success" },
  { role: "parent", label: "Parent Portal", icon: Users, color: "text-warning" },
] as const;

interface PortalSwitcherProps {
  currentRole: string;
}

export function PortalSwitcher({ currentRole }: PortalSwitcherProps) {
  const navigate = useNavigate();
  const { role: userRole } = useAuth();
  const current = portals.find((p) => p.role === currentRole) || portals[0];
  const CurrentIcon = current.icon;

  const handleSwitch = (role: string) => {
    // In production, this would check permissions. For now, only allow if user role matches
    // or if user is admin (admins can view all portals)
    if (role === userRole || userRole === "admin") {
      navigate(`/${role}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9">
          <CurrentIcon className={cn("h-4 w-4", current.color)} />
          <span className="hidden sm:inline text-sm font-medium">{current.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Portal</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {portals.map((portal) => {
          const Icon = portal.icon;
          const isActive = portal.role === currentRole;
          const isAllowed = portal.role === userRole || userRole === "admin";
          return (
            <DropdownMenuItem
              key={portal.role}
              onClick={() => handleSwitch(portal.role)}
              disabled={!isAllowed}
              className={cn(
                "flex items-center gap-3 py-2.5",
                isActive && "bg-primary/5"
              )}
            >
              <Icon className={cn("h-4 w-4", portal.color)} />
              <span className="flex-1">{portal.label}</span>
              {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
