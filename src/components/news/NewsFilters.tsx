"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, Filter, X } from "lucide-react";

export function NewsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isOpen, setIsOpen] = useState(false);

  // Controlled states for filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [district, setDistrict] = useState(searchParams.get("district") || "");

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      
      return params.toString();
    },
    [searchParams]
  );

  const applyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    router.push(`?${createQueryString({ search, year, category, state, district })}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSearch("");
    setYear("");
    setCategory("");
    setState("");
    setDistrict("");
    router.push("?");
  };

  const hasActiveFilters = search || year || category || state || district;

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between md:hidden mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Filter className="w-5 h-5" /> Filters
        </h3>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
          {isOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
        </button>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search news..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none"
            >
              <option value="">All Categories</option>
              <option value="National News">National News</option>
              <option value="State News">State News</option>
              <option value="Events">Events & Programs</option>
              <option value="Press Release">Press Release</option>
              <option value="Agriculture">Agriculture News</option>
            </select>
          </div>

          {/* State */}
          <div>
            <input 
              type="text" 
              placeholder="State..." 
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          {/* District */}
          <div>
            <input 
              type="text" 
              placeholder="District..." 
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 lg:col-span-1">
            <button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl text-sm transition-colors"
            >
              Apply
            </button>
            {hasActiveFilters && (
              <button 
                type="button" 
                onClick={clearFilters}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl text-sm transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
