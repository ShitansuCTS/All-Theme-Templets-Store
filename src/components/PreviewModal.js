"use client";

import { useEffect, useState } from "react";

export default function PreviewModal({ template, onClose }) {
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">
            <h3>Template {template.id}</h3>
            <p className="muted small">
              {template.category} · {template.stack}
            </p>
          </div>
          <div className="modal-actions">
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
            <button className="btn btn-ghost" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        <div className="modal-body">
          {!loaded && (
            <div className="modal-loading">
              <span className="spinner" />
              Loading website...
            </div>
          )}
          <iframe
            src={template.url}
            title={`Preview ${template.id}`}
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
}