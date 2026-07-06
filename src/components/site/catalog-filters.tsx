"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";

export function CatalogFilters({ q, category }: { q: string; category: string }) {
  const router = useRouter();
  const [search, setSearch] = useState(q);

  function apply(next: { q?: string; category?: string }) {
    const qv = next.q !== undefined ? next.q : search;
    const cv = next.category !== undefined ? next.category : category;
    const params = new URLSearchParams();
    if (qv.trim()) params.set("q", qv.trim());
    if (cv) params.set("category", cv);
    const qs = params.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply({});
      }}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-9 pl-9"
          placeholder="Search devices, brands…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <NativeSelect
        className="sm:max-w-[210px]"
        value={category}
        onChange={(e) => apply({ category: e.target.value })}
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </NativeSelect>
      <Button type="submit" size="lg" className="h-9">
        Search
      </Button>
    </form>
  );
}
