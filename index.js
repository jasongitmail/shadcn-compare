import {
  fetchAndExtractComponents,
  mergeResultArrays,
  resultToMarkdownTable,
  updateReadme,
} from "./src/lib";

(async () => {
  try {
    const schadcn = await fetchAndExtractComponents(
      "https://ui.shadcn.com/docs/components/accordion",
    );
    const schadcnSvelte = await fetchAndExtractComponents(
      "https://www.shadcn-svelte.com/docs/components/accordion",
    );
    // const bitsUi = await fetchAndExtractComponents(
    //   "https://www.bits-ui.com/docs/components/pin-input",
    // );

    console.log(schadcn[0]);
    console.log(schadcnSvelte[0]);
    // console.log(bitsUi[0]);

    const result = mergeResultArrays(
      [schadcn, schadcnSvelte],
      ["schadcn", "schadcnSvelte"],
    );
    // const result = mergeResultArrays(
    //   [schadcn, schadcnSvelte, bitsUi],
    //   ["schadcn", "schadcnSvelte", "bitsUi"],
    // );
    console.log(result);

    const markdown = resultToMarkdownTable(result);
    console.log(markdown);

    updateReadme(markdown);
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();

// mergeResultArrays
