import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { DollarSign, Calendar, Dumbbell, TrendingUp, History, MessageCircle } from 'lucide-react';

export function AppSidebar() {
  const location = useLocation();
  
    const menuItems = [
    { title: 'Finance Tracker', icon: DollarSign, href: '/' },
    { title: 'Monthly Planner', icon: Calendar, href: '/planner' },
    { title: 'Fitness Planner', icon: Dumbbell, href: '/fitness' },
    { title: 'Trends', icon: TrendingUp, href: '/trends' },
    { title: 'History', icon: History, href: '/history' },
  ];

  return (
    <Sidebar className="bg-coquette-cream border-r-2 border-coquette-taupe/30">
      <SidebarHeader className="border-b-2 border-coquette-pink/30 bg-white">
        {/* Title and decorative butterfly removed per request; keep header spacing */}
        <div className="flex items-center gap-2 px-4 py-3" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-coquette-brown">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                    className="
                      hover:bg-coquette-pink/20 
                      data-[active=true]:bg-coquette-rose/30 
                      data-[active=true]:text-coquette-darkBrown 
                      rounded-lg transition-colors
                    "
                  >
                    <Link to={item.href} className="flex items-center gap-2 px-3 py-2">
                      <item.icon 
                        className={`
                          h-4 w-4 
                          ${location.pathname === item.href 
                            ? 'text-coquette-darkBrown' 
                            : 'text-coquette-brown'}
                        `}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
