"use client";

import { useState } from "react";
import { Macro } from "@lib/storage/types";
import { replaceHonorific } from "@lib/utils/text";
import { copyToClipboard } from "@lib/utils/copy";

/**
 * MacroItem component
 *
 * - Khi bấm nút danh xưng: thay text tương ứng và tự copy vào clipboard.
 * - Hỗ trợ nhiều biến thể danh xưng (khoảng trắng, dấu phân cách khác).
 * - Hiển thị animation tick nhỏ khi copy thành công.
 */

type Props = { macro: Macro };

export default function MacroItem({ macro }: Props) {
  const [mode, setMode] = useState<"both" | "anh" | "chi">("both");
  const [status, setStatus] = useState<null | "copied" | "error">(null);

  // Helper: mở rộng replaceHonorific (nếu bạn đã có replaceHonorific, dùng nó; 
  // dưới đây gọi replaceHonorific để giữ logic hiện có)
  const getReplacedText = (m: "both" | "anh" | "chi") => {
    // nếu replaceHonorific đã xử lý các biến thể, bạn có thể chỉ return replaceHonorific(...)
    // Nếu chưa, bạn có thể thay bằng logic regex ở đây. Hiện sử dụng replaceHonorific:
    return replaceHonorific(macro.content, m);
  };

  const handleModeClick = async (newMode: "both" | "anh" | "chi") => {
    setMode(newMode);
    setStatus(null);

    const finalText = getReplacedText(newMode);

    try {
      const ok = await copyToClipboard(finalText);
      if (ok) {
        setStatus("copied");
        // ẩn sau 1.6s
        setTimeout(() => setStatus(null), 1600);
      } else {
        setStatus("error");
        setTimeout(() => setStatus(null), 2200);
      }
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus(null), 2200);
    }
  };

  // Animated tick SVG (small). We'll toggle visible when status === "copied".
  const Tick = ({ visible }: { visible: boolean }) => (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 20,
        height: 20,
        marginLeft: 8,
        transform: visible ? "scale(1)" : "scale(0.6)",
        opacity: visible ? 1 : 0,
        transition: "transform 220ms cubic-bezier(.2,.9,.2,1), opacity 220ms ease",
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" stroke="#16A34A" strokeWidth="1.5" fill="rgba(16,185,129,0.08)"/>
        <path d="M7.5 12.5l2.4 2.4L16.5 9" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <strong>{macro.title}</strong>
            <span className="badge" style={{ fontSize: 12, opacity: 0.8 }}>{macro.categoryId}</span>
            {/* show tick next to title when copied */}
            <Tick visible={status === "copied"} />
          </div>

          <div className="hint" style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
            {getReplacedText(mode)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 160 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => handleModeClick("both")}
              className={`button ${mode === "both" ? "" : "secondary"}`}
              title="Giữ nguyên danh xưng (anh/chị) và sao chép"
            >
              anh/chị
            </button>

            <button
              onClick={() => handleModeClick("anh")}
              className={`button ${mode === "anh" ? "" : "secondary"}`}
              title="Thay thành 'anh' và sao chép"
            >
              anh
            </button>

            <button
              onClick={() => handleModeClick("chi")}
              className={`button ${mode === "chi" ? "" : "secondary"}`}
              title="Thay thành 'chị' và sao chép"
            >
              chị
            </button>
          </div>

          {/* feedback area */}
          <div style={{ minHeight: 22 }}>
            {status === "copied" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#16A34A", fontSize: 13 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20 6L9 17l-5-5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Đã sao chép
              </div>
            )}
            {status === "error" && (
              <div style={{ color: "#dc2626", fontSize: 13 }}>Không thể sao chép. Kiểm tra quyền clipboard.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}