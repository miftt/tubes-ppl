"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, FormEvent } from "react"
import { Search, Menu, X } from "lucide-react"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleSearch = (e: FormEvent<HTMLFormElement>, query: string, closeSheet = false) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      if (closeSheet) {
        setIsSheetOpen(false)
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="text-xl sm:text-2xl font-serif font-bold tracking-tight shrink-0">
          DANews.
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side - Desktop */}
        <div className="hidden lg:flex items-center gap-4 flex-1 justify-end max-w-md">
          <form 
            onSubmit={(e) => handleSearch(e, searchQuery)}
            className="relative w-full max-w-[200px]"
          >
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
            />
          </form>
          <Avatar className="h-8 w-8 cursor-pointer ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>DA</AvatarFallback>
          </Avatar>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          {/* Mobile Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
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

                {/* Mobile Search */}
                <div className="px-6 py-4 border-b">
                  <form 
                    onSubmit={(e) => handleSearch(e, mobileSearchQuery, true)}
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Cari berita..."
                        value={mobileSearchQuery}
                        onChange={(e) => setMobileSearchQuery(e.target.value)}
                        className="pl-9 bg-muted/50"
                      />
                    </div>
                  </form>
                </div>

                {/* Navigation */}
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

                {/* Footer */}
                <div className="px-6 py-4 border-t">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 cursor-pointer">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>DA</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">User</span>
                      <span className="text-xs text-muted-foreground">user@example.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
