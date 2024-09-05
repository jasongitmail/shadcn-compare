import {
	fetchAndExtractComponents,
	markdownIntro,
	mergeResultArrays,
	resultToMarkdownTable,
	updateReadme,
} from "./lib";

(async () => {
	try {
		const schadcn = await fetchAndExtractComponents(
			"https://ui.shadcn.com/docs",
			"aside div:has(h4:contains('Components')) a",
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

		// Combine result arrays.
		const resultShadcn = mergeResultArrays(
			[schadcn, schadcnSvelte],
			["schadcn", "schadcnSvelte"],
		);
		const resultAll = mergeResultArrays(
			[schadcn, schadcnSvelte, bitsUi, meltUi],
			["schadcn", "schadcnSvelte", "bitsUi", "meltUi"],
		);

		// Build the markdown
		const intro = markdownIntro();
		const shadcnTable = resultToMarkdownTable(resultShadcn);
		const allTable = resultToMarkdownTable(resultAll);
		const markdown = `${intro}\n\n# Shadcn\n${shadcnTable}\n\n# All\n${allTable}`;

		updateReadme(markdown);
	} catch (error) {
		console.error("Error occurred:", error);
	}
})();
