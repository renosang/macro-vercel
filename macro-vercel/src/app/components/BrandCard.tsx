import React from "react";

type Props = {
  name: string;
  count: number;
  gradient?: string;
};

export default function BrandCard({ name, count, gradient }: Props) {
  const style: React.CSSProperties = {
    background: gradient ?? "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))"
  };

  return (
    <div className="p-1">
      <div
        className="min-h-[64px] rounded-lg p-4 flex flex-col justify-center items-center text-center shadow-sm border border-white/60"
        style={style}
      >
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-xs text-gray-600 mt-1">({count} macro)</div>
      </div>
    </div>
  );
}