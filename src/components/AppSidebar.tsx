import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Grid3X3,
  CalendarCheck,
  ShoppingCart,
  UtensilsCrossed,
  Users,
  Settings,
  ChefHat,
  UserCircle,
  BookOpen,
  BarChart3,
  Flame,
  Utensils,
  History,
  UserRound,
  Layout,
  Trophy,
  MessageSquare,
  FileBarChart,
  Clock,
  QrCode,
  Activity
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const adminLinks = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Table Management", url: "/admin/tables", icon: Grid3X3 },
  { title: "Floor Designer", url: "/admin/floor-plan", icon: Layout },
  { title: "Menu Management", url: "/admin/menu", icon: Utensils },
  { title: "Reservations", url: "/admin/reservations", icon: CalendarCheck },
  { title: "Reservation Timeline", url: "/timeline", icon: Activity },
  { title: "Shift Management", url: "/admin/shift", icon: Clock },
  { title: "QR Code Ordering", url: "/qrcode", icon: QrCode },
  { title: "Order History", url: "/admin/orders", icon: History },
  { title: "Staff Directory", url: "/admin/staff", icon: Users },
  { title: "Loyalty Program", url: "/admin/loyalty", icon: Trophy },
  { title: "Guest Reviews", url: "/admin/feedback", icon: MessageSquare },
  { title: "Analytical Reports", url: "/admin/reports", icon: FileBarChart },
  { title: "Business Analytics", url: "/analytics", icon: BarChart3 },
];

const waiterLinks = [
  { title: "My Tables", url: "/waiter", icon: UtensilsCrossed },
  { title: "Take Order", url: "/waiter/order", icon: ShoppingCart },
  { title: "Kitchen", url: "/kitchen", icon: Flame },
];

const customerLinks = [
  { title: "Restaurants", url: "/customer", icon: BookOpen },
  { title: "My Bookings", url: "/customer/bookings", icon: CalendarCheck },
];

const settingsLinks = [
  { title: "Profile Settings", url: "/settings/profile", icon: UserRound },
  { title: "Restaurant Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const renderGroup = (label: string, links: { title: string; url: string; icon: React.ElementType }[]) => (
    <SidebarGroup key={label}>
      <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1 group-data-[collapsible=icon]:opacity-0 transition-opacity">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild title={item.title}>
                <NavLink
                  to={item.url}
                  end
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                  activeClassName="bg-primary/10 text-primary font-medium shadow-sm"
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarContent className="pt-0">
        <div className="px-4 py-4 flex items-center justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-4">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 w-full">
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shadow-lg shrink-0">
                <ChefHat className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm tracking-tight text-foreground truncate uppercase">TableFlow</h1>
                <p className="text-[9px] font-black text-primary uppercase leading-none">Enterprise</p>
              </div>
            </div>
          ) : (
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg transition-all">
              <ChefHat className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1">
          {renderGroup("Management", adminLinks)}
          {renderGroup("Staff", waiterLinks)}
          {renderGroup("Customer", customerLinks)}
          {renderGroup("Config", settingsLinks)}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
