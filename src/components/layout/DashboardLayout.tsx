import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Shield, 
  Users, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  HelpCircle,
  Settings,
  MessageSquare,
  FolderOpen,
  UserCheck,
  FileSignature,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { toast } from "sonner";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { SessionTimeoutDialog } from "@/components/common/SessionTimeoutDialog";
import { AIAssistantWidget } from "@/components/ai/AIAssistantWidget";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const baseNavItems = [
  { label: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { label: "Clients", icon: Users, href: "/clients" },
  { label: "Recipients", icon: UserCheck, href: "/recipients" },
  { label: "Requirements", icon: ClipboardList, href: "/requirements" },
  { label: "Signatures", icon: FileSignature, href: "/signatures" },
  { label: "Documents", icon: FolderOpen, href: "/documents" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const ownerNavItems = [
  { label: "Owner Dashboard", icon: BarChart3, href: "/owner" },
  { label: "Inquiries", icon: MessageSquare, href: "/owner/inquiries" },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut, isOwner, user } = useAuth();
  const { organization } = useOrganization(user);
  const timeoutMinutes = organization?.session_timeout_minutes ?? 30;
  const { showWarning, remainingSeconds, extendSession } = useSessionTimeout(!!user, timeoutMinutes);

  const navItems = isOwner
    ? [...baseNavItems, ...ownerNavItems]
    : baseNavItems;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-sidebar border-r border-sidebar-border">
        <Link to="/" className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Shield className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">LedgerStash</span>
        </Link>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-1">
          <Link
            to="/contact"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
          >
            <HelpCircle className="h-5 w-5" />
            Support
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">LedgerStash</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border pt-16" onClick={(e) => e.stopPropagation()}>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-sidebar-border space-y-1">
              <Link
                to="/contact"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
              >
                <HelpCircle className="h-5 w-5" />
                Support
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Session Timeout Warning */}
      <SessionTimeoutDialog
        open={showWarning}
        remainingSeconds={remainingSeconds}
        onExtend={extendSession}
      />

      {/* AI Assistant */}
      <AIAssistantWidget />
    </div>
  );
}
