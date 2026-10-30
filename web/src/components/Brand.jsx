import React from 'react';
import { Link } from 'react-router-dom';

export function Pumpkin({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 54 54" fill="none" aria-hidden="true">
      <path
        d="M27 17C25 9 30 5 35 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M27 14c5-7 12-4 12-4-1 5-7 8-12 4Z" fill="currentColor" />
      <ellipse cx="17" cy="32" rx="12" ry="16" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="37" cy="32" rx="12" ry="16" stroke="currentColor" strokeWidth="1.8" />
      <ellipse
        cx="27"
        cy="32"
        rx="11"
        ry="18"
        fill="var(--paper)"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M27 15v34" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Labuibu, home">
      <Pumpkin />
      <span>
        labuibu<span className="brand-tag">LABU ASLI PREMIUM</span>
      </span>
    </Link>
  );
}
