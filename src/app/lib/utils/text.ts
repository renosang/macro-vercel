export function replaceHonorific(text: string, mode: "both" | "anh" | "chi"): string {
  // mode "both" -> keep "anh/chị"
  if (mode === "both") return text;
  const map = {
    "anh/chị": mode === "anh" ? "anh" : "chị",
    "Anh/chị": mode === "anh" ? "Anh" : "Chị",
    "ANH/CHỊ": mode === "anh" ? "ANH" : "CHỊ"
  };
  let out = text;
  // Replace common variants
  for (const [k, v] of Object.entries(map)) {
    out = out.replaceAll(k, v);
  }
  return out;
}