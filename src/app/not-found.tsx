import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-2 flex gap-2">
        <Link href="/" className={cn(buttonVariants())}>
          Go home
        </Link>
        <Link href="/catalog" className={cn(buttonVariants({ variant: "outline" }))}>
          Browse catalog
        </Link>
      </div>
    </div>
  );
}
