"use client";

import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import TemplateCard from "../components/TemplateCard";
import PreviewModal from "../components/PreviewModal";
import templates from "../data/data.json";

export default function Home() {
  const [category, setCategory] = useState("All");
  const [stack, setStack] = useState("All");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);

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
          <div className="grid">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} onPreview={setActive} />
            ))}
          </div>
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