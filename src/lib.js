import cheerio from "cheerio";
import fs from "fs";
import path from "path";

// Fetch HTML, extract component names and URLs, and return an array of objects
// with `name` and `url` properties.
export async function fetchAndExtractComponents(url, regex) {
  try {
    const response = await fetch(url);
    const body = await response.text();

    const $ = cheerio.load(body);

    // Select all anchor tags inside the specified section
    const componentAnchors = $(regex ? regex : "div.pb-4:nth-of-type(2) a");

    // Map through each anchor tag and construct an object with the name and url.
    // `.get()` converts cheerio object to a plain array.
    const components = componentAnchors
      .map((i, anchor) => ({
        name: $(anchor).text().replace("New", "").replace("Updated", "").trim(),
        url: new URL(url).origin + $(anchor).attr("href"),
      }))
      .get();

    console.log("components", components);
    return components;
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
}

// Capitalize the first letter of each word
function capitalizeFirstLetter(string) {
  return string.replace(/\b\w/g, (l) => l.toUpperCase());
}

export function mergeResultArrays(arrays, libNames) {
  // Combine all unique component names from all result arrays.
  const allNames = new Set(
    arrays.flat().map((item) => capitalizeFirstLetter(item.name))
  );

  const mergedArray = Array.from(allNames)
    .sort()
    .map((name) => {
      const libUrls = {};

      arrays.forEach((array, index) => {
        const item = array.find((item) => item.name === name);
        const libraryKey = capitalizeFirstLetter(libNames[index]);
        libUrls[libraryKey] = item ? item.url : "";
      });

      return { name, libUrls };
    });

  return mergedArray;
}

export function resultToMarkdownTable(arr) {
  const libUrlsKeys = arr.length > 0 ? Object.keys(arr[0].libUrls) : [];

  const header = `| Component Name | ${libUrlsKeys.join(" | ")} |`;
  const separator = `| --- |${" --- |".repeat(libUrlsKeys.length)}`;

  const rows = arr.map((item) => {
    // Map each key in libUrls to either a Markdown link or an empty string
    const libUrlsCells = libUrlsKeys
      .map((key) => {
        const url = item.libUrls[key];
        return url ? `[🟢](${url})` : "❌";
      })
      .join(" | ");

    return `| ${item.name} | ${libUrlsCells} |`;
  });

  // Combine the header, separator, and rows into a single string
  return [header, separator, ...rows].join("\n");
}

/**
 * Updates the README.md file with the provided markdown content.
 *
 * @param {string} markdown - The markdown content to write to the README.md file.
 */
export function updateReadme(markdown) {
  const readmePath = path.join(__dirname, "../README.md");

  fs.writeFileSync(readmePath, markdown, "utf8", (err) => {
    if (err) {
      console.error("Error writing to README.md:", err);
      return;
    }
    console.log("README.md has been updated.");
  });
}

export function markdownIntro() {
  const currentDate = new Date().toISOString();

  const md = `# README

Compares UI components available in:
- [shadcn](https://ui.shadcn.com/docs/components)
- [shadcn-svelte](https://www.shadcn-svelte.com/docs/components)
- [bits-ui](https://www.bits-ui.com/docs/components)
- [melt-ui](https://melt-ui.com/docs/builders/accordion)

Last updated: ${currentDate}. Updates checked daily via [cron.yml](https://github.com/jasongitmail/shadcn-compare/actions/workflows/cron.yml).

Jump to table:
- [Shadcn](#shadcn)
- [All](#all)
`;

  return md;
}
