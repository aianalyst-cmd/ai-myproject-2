import fs from "node:fs";

const htmlPath = "C:/Users/kazuki nishi/収益化/サイト開発/AI用語集/index.html";
const outPath = "C:/Users/kazuki nishi/収益化/サイト開発/AI用語集/ai myproject/scripts/seed-terms.sql";

const html = fs.readFileSync(htmlPath, "utf8");
const marker = "const DEFAULT_DATA = ";
const start = html.indexOf(marker);
if (start < 0) throw new Error("DEFAULT_DATA not found");
const end = html.indexOf("\n];", start);
if (end < 0) throw new Error("end not found");

const data = Function(`return ${html.slice(start + marker.length, end + 3)}`)();
if (!Array.isArray(data) || data.length < 1) throw new Error("bad data");

function esc(value) {
  return String(value ?? "").replace(/'/g, "''");
}

function detailsOf(item) {
  const usage = String(item.usage ?? "").trim();
  const caution = String(item.caution ?? "").trim();
  const parts = [];
  if (usage) parts.push(`【ビジネスでの活用法】\n${usage}`);
  if (caution) parts.push(`【注意点】\n${caution}`);
  return parts.join("\n\n");
}

const values = data.map((item) => {
  const title = esc(item.term);
  const category = esc(item.category);
  const summary = esc(item.summary);
  const details = esc(detailsOf(item));
  return `('${title}', '${category}', '${summary}', '${details}')`;
});

const sql = [
  "-- Seed terms from original index.html DEFAULT_DATA",
  "-- Columns: title, category, summary, details",
  "INSERT INTO terms (title, category, summary, details) VALUES",
  `${values.join(",\n")};`,
  "",
].join("\n");

fs.writeFileSync(outPath, sql, "utf8");
console.log(`terms ${data.length}`);
console.log(`bytes ${Buffer.byteLength(sql, "utf8")}`);
console.log(`out ${outPath}`);
