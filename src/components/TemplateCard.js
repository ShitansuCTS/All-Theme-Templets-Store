"use client";

import { useState } from "react";

export default function TemplateCard({ template, onPreview }) {
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const thumb = `https://s0.wp.com/mshots/v1/${encodeURIComponent(
    template.url
  )}?w=800&h=500`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(template.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Copy failed. Please allow clipboard access.");
    }
  };

  return (
    <article className="card">
      <div className="card-preview tc-thumb-wrap">
        {!loaded && !failed && <div className="tc-skeleton" />}

        {failed ? (
          <div className="tc-fallback">
            <strong>{template.category}</strong>
            <span>{template.stack}</span>
          </div>
        ) : (
          <img
            ref={(img) => {
              if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
            }}
            src={thumb}
            alt={`Template ${template.id} preview`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={loaded ? "tc-thumb tc-thumb-loaded" : "tc-thumb"}
          />
        )}

        <span className="tc-badge">{template.stack}</span>

        <button
          type="button"
          className="tc-overlay"
          onClick={() => onPreview(template)}
          aria-label={`Live preview of template ${template.id}`}
        >
          <span className="tc-pill">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Live Preview
          </span>
        </button>
      </div>

      <div className="card-body">
        <h3>Template {template.id}</h3>
        <p className="muted small">{template.category}</p>

        <div className="card-actions">
          <button className="btn btn-outline" onClick={copyUrl}>
            {copied ? "Copied!" : "Copy URL"}
          </button>
          <a
            className="btn btn-primary"
            href={template.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open
          </a>
        </div>
      </div>
    </article>
  );
}