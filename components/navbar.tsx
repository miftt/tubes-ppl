"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, FormEvent, useRef, useEffect } from "react"
import { Search, Menu, X, LogOut, User, Settings, ChevronDown } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

const navItems = [
  { href: "/nasional", label: "Nasional" },
  { href: "/internasional", label: "Internasional" },
  { href: "/ekonomi", label: "Ekonomi" },
  { href: "/olahraga", label: "Olahraga" },
  { href: "/teknologi", label: "Teknologi" },
  { href: "/hiburan", label: "Hiburan" },
  { href: "/gaya-hidup", label: "Gaya Hidup" },
]

export function Navbar() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  // Ref untuk mendeteksi klik di luar dropdown (Auto close)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: FormEvent<HTMLFormElement>, query: string, closeSheet = false) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      if (closeSheet) {
        setIsSheetOpen(false)
      }
    }
  }

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : "U"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* --- LOGO --- */}
        <Link href="/" className="text-2xl font-serif font-bold tracking-tight shrink-0 flex items-center gap-1 hover:opacity-80 transition-opacity">
          DANews<span className="text-primary">.</span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary transition-colors relative group py-2"
            >
              {item.label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></span>
            </Link>
          ))}
        </nav>

        {/* --- RIGHT SIDE ACTIONS (DESKTOP) --- */}
        <div className="hidden lg:flex items-center gap-4 flex-1 justify-end max-w-md">
          
          {/* Search Bar */}
          <form onSubmit={(e) => handleSearch(e, searchQuery)} className="relative w-full max-w-[200px] group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-transparent focus:border-primary/20 focus:bg-background transition-all rounded-full"
            />
          </form>

          {/* --- LOGIC AUTHENTICATION --- */}
          {user ? (
            // === SUDAH LOGIN (Dropdown Profile) ===
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-2 p-1 pr-2 rounded-full border border-transparent hover:bg-muted transition-all duration-200 ${isProfileOpen ? 'bg-muted border-border' : ''}`}
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={(user as any).avatar || ""} /> 
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {getInitials(user.name || "")}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN MENU */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-background border rounded-xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* Info User */}
                  <div className="px-3 py-2.5 bg-muted/50 rounded-lg mb-2">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <span className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wide">
                      {(user as any).role}
                    </span>
                  </div>

                  {/* Menu Links */}
                  <div className="space-y-1">
                    <Link href="/member/profile">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">
                            <User className="h-4 w-4" />
                            <span>Profile Saya</span>
                        </div>
                    </Link>
                  </div>

                  <div className="h-px bg-border my-2"></div>

                  {/* Tombol Logout */}
                  <button 
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // === BELUM LOGIN (Tombol Masuk/Daftar) ===
            <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="font-semibold text-muted-foreground hover:text-foreground">
                    Masuk
                  </Button>
                </Link>
                
                <Link href="/register">
                  <Button className="rounded-full px-6 font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
                    Daftar
                  </Button>
                </Link>
            </div>
          )}
        </div>

        {/* --- MOBILE HAMBURGER MENU (HP) --- */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 active:scale-95 transition-transform">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col">
                {/* Header Mobile */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-2xl font-serif font-bold">DANews.</SheetTitle>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>

                {/* Mobile Search Bar */}
                <div className="px-6 py-4 border-b">
                  <form onSubmit={(e) => handleSearch(e, mobileSearchQuery, true)}>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Cari berita..."
                        value={mobileSearchQuery}
                        onChange={(e) => setMobileSearchQuery(e.target.value)}
                        className="pl-9 bg-muted/50 rounded-full"
                      />
                    </div>
                  </form>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center px-4 py-3 rounded-lg text-base font-medium hover:bg-muted transition-colors"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </nav>

                {/* Mobile Footer Auth */}
                <div className="px-6 py-6 border-t bg-muted/20">
                  {user ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-background p-3 rounded-lg border">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={(user as any).avatar || ""} />
                                <AvatarFallback>{getInitials(user.name || "")}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold truncate">{user.name}</span>
                                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <Link href="/member/profile" className="w-full">
                                <Button variant="outline" className="w-full">Profile</Button>
                             </Link>
                             <Button 
                                variant="destructive" 
                                className="w-full"
                                onClick={() => signOut({ callbackUrl: '/login' })}
                             >
                                Logout
                             </Button>
                        </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                        <Link href="/login" className="w-full">
                            <Button variant="outline" className="w-full font-bold">Masuk</Button>
                        </Link>
                        <Link href="/register" className="w-full">
                            <Button className="w-full font-bold shadow-md">Daftar Sekarang</Button>
                        </Link>
                    </div>
                  )}
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}