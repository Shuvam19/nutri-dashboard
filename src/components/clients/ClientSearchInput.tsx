"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export default function ClientSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 400);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams);
    
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
      params.delete("page"); // Reset to page 1 on new search
    } else {
      params.delete("search");
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, pathname, router, searchParams]);

  return (
    <input
      className="w-full pl-xl pr-sm py-sm rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary font-body-md text-body-md text-on-surface outline-none transition-all placeholder-outline-variant"
      placeholder="Client Name or Email"
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
