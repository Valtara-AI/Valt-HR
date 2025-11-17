import {
  Bell,
  HelpCircle,
  LogOut,
  Search,
  Settings as SettingsIcon,
  Shield,
  User,
  UserCircle
} from "lucide-react";
// Image component removed; BrandLogo used instead
import { toast } from "sonner";
import BrandLogo from "./BrandLogo";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

interface DashboardHeaderProps {
  onOpenModal?: (type: string) => void;
  onNavigateToSection?: (section: string) => void;
  onSignOut?: () => void;
}

export function DashboardHeader({ onOpenModal: _onOpenModal, onNavigateToSection, onSignOut }: DashboardHeaderProps) {
  const handleNotificationClick = () => {
    toast.info("You have 3 new notifications", {
      description: "2 interview confirmations and 1 candidate update"
    });
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      toast.success(`Searching for: ${query}`);
    }
  };

  // onNavigateToSection may be provided by parent; call handler when available
    const handleSettingsClick = () => {
      if (onNavigateToSection) {
        onNavigateToSection("settings");
        toast.success("Navigating to settings");
      } else {
        toast.info("Settings panel opened");
      }
    };

  const handleProfileClick = (action: string) => {
    switch (action) {
      case "profile":
        toast.info("Profile settings opened");
        break;
      case "account":
        toast.info("Account settings opened");
        break;
      case "security":
        toast.info("Security settings opened");
        break;
      case "help":
        toast.info("Help center opened");
        break;
      case "signout":
        if (onSignOut) {
          onSignOut();
        } else {
          toast.success("Signed out successfully");
        }
        break;
      default:
        break;
    }
  };

  const handleNavigateFromProfile = (section: string) => {
    if (onNavigateToSection) {
      onNavigateToSection(section);
      toast.success(`Navigating to ${section}`);
    }
  };

  return (
    <header className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg overflow-hidden">
              <BrandLogo width={32} height={32} />
            </div>
            <span className="font-semibold">Valt HR Suite</span>
          </div>
          <Badge variant="secondary" className="ml-4">
            Premium
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search candidates, jobs..." 
              className="w-80 pl-9"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e.currentTarget.value);
                }
              }}
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationClick}>
            <Bell className="h-5 w-5 icon-accent-2" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
            <SettingsIcon className="h-5 w-5 icon-accent-3" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full p-0 hover:bg-accent/50 focus:bg-accent/50 transition-all duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open user profile menu"
              >
                <Avatar className="h-8 w-8">
                  <BrandLogo width={32} height={32} />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <BrandLogo width={40} height={40} />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">sarah.johnson@company.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      HR Manager
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Premium
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileClick("profile")}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigateFromProfile("settings")}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>System Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileClick("account")}>
                <User className="mr-2 h-4 w-4" />
                <span>Account Management</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileClick("security")}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Security & Privacy</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => {
                    toast.info("Opening Help Center...", {
                      description: "Redirecting to our comprehensive help documentation"
                    });
                    // In a real app, this would open help center or modal
                  }}
                >
                  Help & Support
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleProfileClick("signout")}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}