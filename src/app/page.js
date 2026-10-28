"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import TemplateCard from "../components/TemplateCard";
import PreviewModal from "../components/PreviewModal";
import templates from "../data/data.json";

const PAGE_SIZE = 12;

export default function Home() {
  const [category, setCategory] = useState("All");
  const [stack, setStack] = useState("All");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  const categories = useMemo(
    () => [...new Set(templates.map((t) => t.category))],
    []
  );
  const stacks = useMemo(
    () => [...new Set(templates.map((t) => t.stack))],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return templates.filter((t) => {
      const matchCategory = category === "All" || t.category === category;
      const matchStack = stack === "All" || t.stack === stack;
      const matchSearch =
        !q ||
        `template ${t.id} ${t.category} ${t.stack} ${t.url}`
          .toLowerCase()
          .includes(q);
      return matchCategory && matchStack && matchSearch;
    });
  }, [category, stack, search]);

  // start from the first 12 whenever a filter or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, stack, search]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // load the next 12 when the user scrolls near the bottom
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => c + PAGE_SIZE);
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, visibleCount]);

  const hasFilters = category !== "All" || stack !== "All" || search !== "";

  const clearAll = () => {
    setCategory("All");
    setStack("All");
    setSearch("");
  };

  return (
    <>
      <Navbar
        categories={categories}
        stacks={stacks}
        category={category}
        stack={stack}
        search={search}
        onCategory={setCategory}
        onStack={setStack}
        onSearch={setSearch}
        onClear={clearAll}
        hasFilters={hasFilters}
        urls={filtered.map((t) => t.url)}
      />

      <main className="container">
        <div className="page-head">
          <div>
            <h1>
              {category === "All" ? "All Templates" : category}
              {stack !== "All" ? ` · ${stack}` : ""}
            </h1>
            <p className="muted">
              Browse live previews and copy template links.
            </p>
          </div>
          <span className="count">{filtered.length} Found</span>
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="grid">
              {visible.map((t) => (
                <TemplateCard key={t.id} template={t} onPreview={setActive} />
              ))}
            </div>

            {hasMore && (
              <div ref={sentinelRef} className="load-more">
                <span className="spinner" />
                Loading more templates...
              </div>
            )}
          </>
        ) : (
          <div className="empty">
            <h3>No templates found</h3>
            <p className="muted">Try a different search or filter.</p>
            <button className="btn btn-primary" onClick={clearAll}>
              Clear filters
            </button>
          </div>
        )}
      </main>

      {active && (
        <PreviewModal template={active} onClose={() => setActive(null)} />
      )}
    </>
  );
}