/**
 * Triggers a browser download of `content` as a file with the given `filename`.
 * No-op when called outside the browser (e.g. SSR / unit-test runs without `window`).
 *
 * Reusable for future CSV / ODS exports — the only required customization is the
 * MIME type, which defaults to plain UTF-8 text.
 */
export const downloadTextFile = (
  filename: string,
  content: string,
  mimeType = "text/plain;charset=utf-8",
): void => {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
