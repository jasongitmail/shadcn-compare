import {
  fetchAndExtractComponents,
  mergeResultArrays,
  resultToMarkdownTable,
  updateReadme,
  markdownIntro,
} from "./src/lib";

(async () => {
  try {
    const schadcn = await fetchAndExtractComponents(
      "https://ui.shadcn.com/docs/components/accordion",
    );
    const schadcnSvelte = await fetchAndExtractComponents(
      "https://www.shadcn-svelte.com/docs/components/accordion",
    );
    const bitsUi = await fetchAndExtractComponents(
      "https://www.bits-ui.com/docs/components/accordion",
    );
    const meltUi = await fetchAndExtractComponents(
      "https://melt-ui.com/docs/builders/accordion",
      "nav > div:nth-of-type(2) div.px-1 a",
    );

    // console.log(schadcn[0]);
    // console.log(schadcnSvelte[0]);
    // console.log(bitsUi[0]);
    // console.log(meltUi[0]);
    // return;

    const resultShadcn = mergeResultArrays(
      [schadcn, schadcnSvelte],
      ["schadcn", "schadcnSvelte"],
    );
    const resultAll = mergeResultArrays(
      [schadcn, schadcnSvelte, bitsUi, meltUi],
      ["schadcn", "schadcnSvelte", "bitsUi", "meltUi"],
    );
    console.log(resultAll);

    const intro = markdownIntro();
    const shadcnTable = resultToMarkdownTable(resultShadcn);
    const allTable = resultToMarkdownTable(resultAll);
    const markdown = `${intro}\n\n# Shadcn\n${shadcnTable}\n\n# All\n${allTable}`;
    console.log(markdown);
    // return;

    updateReadme(markdown);
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();
