import { parse } from "jsr:@std/yaml";
import { ensureDirSync } from "jsr:@std/fs";
import { CSS, render } from "jsr:@deno/gfm@0.6";

function compileReadme(content: string): string {
  // Rewrite URLs
  content = content.replace(/\.\/src\//g, "./");
  content = content.replace(/\.yaml/g, ".json");
  const template = Deno.readTextFileSync(
    new URL("../src/index.template.html", import.meta.url),
  );
  const body = render(content);
  const html = template
    .replace("{{CSS}}", CSS)
    .replace("{{BODY}}", body);
  return html;
}

function compileCatalog(content: string): string {
  const schema = parse(content);
  return JSON.stringify(schema, null, 2);
}

function main(): void {
  ensureDirSync(new URL("../dist/v1", import.meta.url));
  const catalog = Deno.readTextFileSync(
    new URL("../src/v1/catalog.yaml", import.meta.url),
  );
  Deno.writeTextFileSync(
    new URL("../dist/v1/catalog.json", import.meta.url),
    compileCatalog(catalog),
  );
  const readme = Deno.readTextFileSync(
    new URL("../README.md", import.meta.url),
  );
  Deno.writeTextFileSync(
    new URL("../dist/index.html", import.meta.url),
    compileReadme(readme),
  );
}

if (import.meta.main) {
  main();
}
