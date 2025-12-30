import Link from "next/link"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif font-bold tracking-tight shrink-0">
          DANews.
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link href="/health" className="hover:text-muted-foreground transition-colors">
            Health
          </Link>
          <Link href="/sport" className="hover:text-muted-foreground transition-colors">
            Sport
          </Link>
          <Link href="/nasional" className="hover:text-muted-foreground transition-colors">
            Nasional
          </Link>
          <Link href="/tech" className="hover:text-muted-foreground transition-colors">
            Tech
          </Link>
          <Link href="/seleb" className="hover:text-muted-foreground transition-colors">
            Seleb
          </Link>
        </nav>

        {/* Search & Profile */}
        <div className="flex items-center gap-4 flex-1 justify-end max-w-md">
          <div className="relative w-full max-w-[200px] hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search news..."
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
            />
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 cursor-pointer ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>DA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
