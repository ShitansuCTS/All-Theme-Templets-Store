"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 800;

export default function TemplateCard({ template, onPreview }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(0.25);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / FRAME_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
      <div
        className="card-preview"
        ref={wrapRef}
        style={{ height: FRAME_HEIGHT * scale }}
      >
        <iframe
          src={template.url}
          title={`Template ${template.id}`}
          loading="lazy"
          tabIndex={-1}
          scrolling="no"
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: `scale(${scale})`,
          }}
        />

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