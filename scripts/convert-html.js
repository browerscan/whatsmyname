const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../content/education");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));

files.forEach((file) => {
  const base = file.replace(".html", "");
  const htmlPath = path.join(dir, file);
  const tsPath = path.join(dir, base + ".ts");
  const content = fs.readFileSync(htmlPath, "utf8");

  const output =
    "// Auto-generated from " +
    file +
    " for Edge Runtime compatibility\nexport default `" +
    content +
    "`;\n";
  fs.writeFileSync(tsPath, output);
  console.log("Converted", file, "to", base + ".ts");
});
