import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Leaf,
  User,
  LogOut,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import EnhancedAIChatbot from "./EnhancedAIChatbot";
import LanguageSelector, { useLanguage } from "./LanguageSelector";
import ThemeToggle from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Resources", href: "/resources" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="flex w-full items-center justify-between py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="bg-primary p-2 rounded-xl">
                  <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-display font-black tracking-tight leading-none">
                    TerraMRV
                  </span>
                  <span className="text-xs font-semibold opacity-70 tracking-wide">
                    KISAN CARBONTECH
                  </span>
                </div>
              </Link>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    location.pathname === item.href
                      ? "text-primary font-bold"
                      : "opacity-80 hover:text-primary",
                  )}
                >
                  {item.name}
                </Link>
              ))}

              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={changeLanguage}
              />

              <ThemeToggle />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setChatbotOpen(true)}
                className="flex items-center space-x-2 border-primary hover:bg-primary/10"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden lg:inline">Kisan AI</span>
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>
                        {user?.farmer?.name ||
                          user?.admin?.name ||
                          user?.farmer?.email ||
                          user?.admin?.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to={
                          user?.type === "farmer"
                            ? "/farmer-dashboard"
                            : "/admin-dashboard"
                        }
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-base font-semibold transition-colors",
                      location.pathname === item.href
                        ? "bg-muted text-primary font-bold"
                        : "opacity-90 hover:bg-muted hover:text-primary",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="px-3 pt-2 space-y-2 border-t border-border">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <LanguageSelector
                        selectedLanguage={language}
                        onLanguageChange={changeLanguage}
                      />
                    </div>
                    <ThemeToggle />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatbotOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 border-primary hover:bg-primary/10"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>AI Help</span>
                    </Button>
                  </div>
                </div>

                <div className="px-3 pt-2">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link
                          to={
                            user?.type === "farmer"
                              ? "/farmer-dashboard"
                              : "/admin-dashboard"
                          }
                        >
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={logout}
                        className="w-full hover:bg-muted"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link to="/signup">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-display font-extrabold tracking-tight">
                  TerraMRV
                </span>
              </div>
              <p className="text-white/70 leading-relaxed font-medium max-w-md">
                Scalable MRV for agroforestry and rice-based carbon projects.
                Built for India's smallholder farming communities.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <a
                  href="https://twitter.com"
                  aria-label="Twitter"
                  className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com"
                  aria-label="Facebook"
                  className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  aria-label="LinkedIn"
                  className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com"
                  aria-label="YouTube"
                  className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-4 tracking-wide uppercase">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-white/70 font-medium">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/solutions"
                    className="hover:text-white transition-colors"
                  >
                    Solutions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tools"
                    className="hover:text-white transition-colors"
                  >
                    Tools
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-4 tracking-wide uppercase">
                Resources
              </h3>
              <ul className="space-y-2 text-sm text-white/70 font-medium">
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-white transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/case-studies"
                    className="hover:text-white transition-colors"
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-white transition-colors"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-bold mb-3 tracking-wide uppercase">
                Subscribe for updates
              </h3>
              <p className="text-sm text-white/70 mb-3 max-w-md">
                Get product updates and MRV insights delivered to your inbox.
              </p>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  className="w-full rounded-md bg-white/10 placeholder:text-white/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:opacity-95"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-white/60 mt-2">
                By subscribing you agree to our privacy policy.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-white/70 font-medium">
              © {new Date().getFullYear()} TerraMRV. All rights reserved.
            </p>
            <div className="text-xs text-white/60 space-x-4">
              <Link to="/resources" className="hover:text-white/80">
                Privacy
              </Link>
              <Link to="/resources" className="hover:text-white/80">
                Terms
              </Link>
              <Link to="/resources" className="hover:text-white/80">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <EnhancedAIChatbot
        open={chatbotOpen}
        onOpenChange={setChatbotOpen}
        selectedLanguage={language}
      />

      {!chatbotOpen && (
        <Button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 border-2 border-white"
          size="sm"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </Button>
      )}
    </div>
  );
}
