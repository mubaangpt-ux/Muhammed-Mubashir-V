import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const source = resolve(rootDir, "public", ".htaccess");
const target = resolve(rootDir, "dist", ".htaccess");

await mkdir(dirname(target), { recursive: true });
await copyFile(source, target);

console.log("[postbuild] copied .htaccess to dist");
