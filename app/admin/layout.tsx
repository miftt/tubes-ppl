"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Mail, LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // MENU ITEMS: Link ke halaman terpisah (Bukan Scroll lagi)
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { name: "Manajemen User", icon: Users, href: "/admin/users" },         // Halaman Baru
    { name: "Subscriber", icon: Mail, href: "/admin/subscribers" },   // Halaman Baru
  ];

  return (
    <div className="flex h-screen bg-muted/20 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col fixed h-full z-30 lg:static`}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            DP
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">DAnews Panel</span>}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            // Logika aktif sederhana berdasarkan URL
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group ${
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" 
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"} />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* KONTEN KANAN */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card text-card-foreground shadow-sm z-20">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-muted rounded-md">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">Admin</p>
                  <p className="text-xs text-muted-foreground">online</p>
               </div>
               <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold border border-primary/20">A</div>
          </div>
        </header>

        {/* MAIN CONTENT: overflow-auto disini agar scrollbar ada di dalam konten, bukan window */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}