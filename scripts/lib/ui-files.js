import fs from "node:fs";
import path from "node:path";

/** Relative primitive paths, including version namespaces, without stories/tests. */
export function uiComponentFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
    if (entry.isDirectory() && !entry.name.startsWith("__")) {
      files.push(...uiComponentFiles(path.join(directory,entry.name)).map(file=>entry.name+"/"+file));
    } else if (entry.isFile() && entry.name.endsWith(".tsx") && !/\.(stories|test)\./.test(entry.name) && entry.name !== "index.tsx") files.push(entry.name);
  }
  return files.sort();
}
