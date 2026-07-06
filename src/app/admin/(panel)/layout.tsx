import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: middleware already gates /admin, but re-check here.
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link href="/admin/dashboard" className="flex shrink-0 items-center gap-2 font-semibold">
            <Logo className="h-7 w-auto" />
            Apexcheck <span className="font-normal text-muted-foreground">Admin</span>
          </Link>
          <div className="hidden md:block">
            <AdminNav />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/"
              target="_blank"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              <ExternalLinkIcon />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <LogoutButton />
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-2 pb-2 md:hidden">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
