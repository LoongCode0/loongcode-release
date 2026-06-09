import React from "react";

export type IconName =
  | "layout"
  | "tools"
  | "puzzle"
  | "swap"
  | "phone"
  | "refresh";

// 统一描边线性图标，白色 stroke，置于渐变圆徽内。viewBox 24，子元素继承 stroke。
const PATHS: Record<IconName, React.ReactNode> = {
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="12" y1="12" x2="21" y2="12" />
    </>
  ),
  tools: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <polyline points="7 9 10 12 7 15" />
      <line x1="12.5" y1="15" x2="16.5" y2="15" />
    </>
  ),
  puzzle: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <line x1="17.5" y1="14.5" x2="17.5" y2="20.5" />
      <line x1="14.5" y1="17.5" x2="20.5" y2="17.5" />
    </>
  ),
  swap: (
    <>
      <line x1="4" y1="9" x2="20" y2="9" />
      <polyline points="17 6 20 9 17 12" />
      <line x1="20" y1="15" x2="4" y2="15" />
      <polyline points="7 12 4 15 7 18" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <line x1="10.5" y1="5.5" x2="13.5" y2="5.5" />
      <circle cx="12" cy="18" r="0.9" />
    </>
  ),
  refresh: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <polyline points="20.5 3.5 20.5 8 16 8" />
    </>
  ),
};

export const Icon: React.FC<{ name: IconName; size?: number }> = ({
  name,
  size = 56,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {PATHS[name]}
  </svg>
);
