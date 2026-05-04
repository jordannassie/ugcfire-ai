"use client";

import Image from "next/image";

interface UGCFireLoaderProps {
  fullScreen?: boolean;
}

export default function UGCFireLoader({ fullScreen = true }: UGCFireLoaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        ...(fullScreen
          ? {
              position: "fixed",
              inset: 0,
              zIndex: 9999,
            }
          : {
              width: "100%",
              height: "100%",
              minHeight: 200,
            }),
      }}
    >
      <div style={{ position: "relative", width: 96, height: 96 }}>
        {/* Spinning orange arc */}
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          style={{
            position: "absolute",
            inset: 0,
            animation: "ugcfire-spin 1.1s linear infinite",
          }}
        >
          <style>{`
            @keyframes ugcfire-spin {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
          `}</style>
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="#FF3B1A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="207"
            strokeDashoffset="138"
          />
        </svg>

        {/* Logo centered inside the ring */}
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: "50%",
            background: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Image
            src="https://phhczohqidgrvcmszets.supabase.co/storage/v1/object/public/UGC%20Fire/images/UGCfirelog.png"
            alt="UGC Fire"
            width={64}
            height={56}
            style={{ objectFit: "contain" }}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
