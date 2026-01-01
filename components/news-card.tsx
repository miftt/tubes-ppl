import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BookmarkButton } from "./bookmark-button"

interface NewsCardProps {
  title: string
  excerpt?: string
  image: string
  category?: string
  date: string
  featured?: boolean
  horizontal?: boolean
  link?: string
}

export function NewsCard({ title, excerpt, image, category, date, featured, horizontal, link }: NewsCardProps) {
  const href = link || "#";

  if (horizontal) {
    return (
      <Link href={href} target={link ? "_blank" : undefined} rel={link ? "noopener noreferrer" : undefined} className="group flex gap-4 items-start py-3 border-b last:border-0">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2 italic font-serif">
            {title}
          </h4>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{date}</span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      target={link ? "_blank" : undefined}
      rel={link ? "noopener noreferrer" : undefined}
      className={cn(
        "group flex flex-col gap-4 overflow-hidden rounded-lg transition-all duration-300",
        featured ? "lg:col-span-2 border-b pb-8" : "pb-4",
      )}
    >
      <div className={cn("relative overflow-hidden bg-muted", featured ? "aspect-[21/9]" : "aspect-[16/10]")}>
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {category && (
          <span className="absolute top-4 left-4 bg-background/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground">
            {category}
          </span>
        )}
        {/* Bookmark Button */}
        {link && (
          <div className="absolute top-4 right-4">
            <BookmarkButton
              articleLink={link}
              articleTitle={title}
              articleImage={image}
              articleCategory={category}
              articleDate={date}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{date}</span>
        <h3
          className={cn(
            "font-serif font-bold leading-tight group-hover:underline decoration-1 underline-offset-4 transition-all",
            featured ? "text-3xl lg:text-5xl" : "text-xl lg:text-2xl",
          )}
        >
          {title}
        </h3>
        {excerpt && (
          <p
            className={cn(
              "text-muted-foreground leading-relaxed",
              featured ? "text-lg max-w-2xl" : "text-sm line-clamp-3",
            )}
          >
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
