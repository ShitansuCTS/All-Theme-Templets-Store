"use client";

import { useEffect, useRef, useState } from "react";

const COMPANY_NAME = "Crushader Tech Solution";
const LOGO_SRC = "/logo.webp";

function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button
        className={`btn btn-outline ${value !== "All" ? "btn-selected" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{value === "All" ? label : value}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul className="dropdown-menu">
          {["All", ...options].map((opt) => (
            <li key={opt}>
              <button
                className={opt === value ? "active" : ""}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt === "All" ? `All ${label}` : opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Navbar({
  categories,
  stacks,
  category,
  stack,
  search,
  onCategory,
  onStack,
  onSearch,
  onClear,
  hasFilters,
  urls,
}) {
  const [copied, setCopied] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(urls.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Copy failed. Please allow clipboard access.");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          {!logoError ? (
            <img
              src={LOGO_SRC}
              alt={COMPANY_NAME}
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="brand-text">{COMPANY_NAME}</span>
          )}
        </div>

        <div className="nav-controls">
          <Dropdown
            label="Category"
            options={categories}
            value={category}
            onChange={onCategory}
          />
          <Dropdown
            label="Tech Stack"
            options={stacks}
            value={stack}
            onChange={onStack}
          />
          {hasFilters && (
            <button className="btn btn-ghost" onClick={onClear}>
              Clear
            </button>
          )}
        </div>

        <div className="search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search by category, stack..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary copy-all"
          onClick={copyAll}
          disabled={urls.length === 0}
        >
          {copied ? "Copied!" : "Copy All"}
        </button>
      </div>
    </header>
  );
}