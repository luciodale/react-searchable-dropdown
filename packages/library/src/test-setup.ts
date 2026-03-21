import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock react-virtuoso to render all items directly (jsdom has no layout engine)
vi.mock("react-virtuoso", () => {
	const React = require("react");

	function Virtuoso({
		totalCount,
		itemContent,
		style,
		components,
	}: {
		totalCount: number;
		itemContent: (index: number) => React.ReactNode;
		style?: React.CSSProperties;
		components?: { Footer?: () => React.ReactNode };
	}) {
		return React.createElement(
			"div",
			{ style, "data-testid": "virtuoso-scroller" },
			Array.from({ length: totalCount }, (_, i) =>
				React.createElement("div", { key: i }, itemContent(i)),
			),
			components?.Footer?.(),
		);
	}

	function GroupedVirtuoso({
		groupCounts,
		groupContent,
		itemContent,
		style,
		components,
		context,
	}: {
		groupCounts: number[];
		groupContent: (index: number, context: unknown) => React.ReactNode;
		itemContent: (index: number) => React.ReactNode;
		style?: React.CSSProperties;
		components?: { Footer?: () => React.ReactNode };
		context?: unknown;
	}) {
		let itemIndex = 0;
		const elements: React.ReactNode[] = [];
		for (let groupIdx = 0; groupIdx < groupCounts.length; groupIdx++) {
			elements.push(
				React.createElement("div", { key: `group-${groupIdx}` }, groupContent(groupIdx, context)),
			);
			for (let i = 0; i < groupCounts[groupIdx]; i++) {
				elements.push(
					React.createElement("div", { key: `item-${itemIndex}` }, itemContent(itemIndex)),
				);
				itemIndex++;
			}
		}
		return React.createElement(
			"div",
			{ style, "data-testid": "virtuoso-scroller" },
			...elements,
			components?.Footer?.(),
		);
	}

	return { Virtuoso, GroupedVirtuoso };
});
