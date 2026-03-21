import type { SiteConfig } from "@luciodale/docs-ui-kit/types/config";

export const siteConfig: SiteConfig = {
	title: "react-searchable-dropdown",
	description:
		"A TypeScript-first searchable dropdown for React. Virtualized lists, keyboard navigation, single and multi-select, full styling control.",
	siteUrl: "https://react-searchable-dropdown-docs.pages.dev",
	logoSrc: "/projects/react-searchable-dropdown/logo.svg",
	logoAlt: "react-searchable-dropdown logo",
	installCommand: "npm install @luciodale/react-searchable-dropdown",
	githubUrl: "https://github.com/luciodale/react-searchable-dropdown",
	author: "Lucio D'Alessandro",
	socialLinks: {
		github: "https://github.com/luciodale/react-searchable-dropdown",
		linkedin: "https://linkedin.com/in/lucio-d-alessandro",
	},
	navLinks: [
		{ href: "/docs/getting-started", label: "Docs" },
		{ href: "/demo/single-select", label: "Examples" },
	],
	sidebarSections: [
		{
			title: "Getting Started",
			links: [{ href: "/docs/getting-started", label: "Getting Started" }],
		},
		{
			title: "Guides",
			links: [
				{ href: "/docs/configuration", label: "Configuration" },
				{ href: "/docs/filtering", label: "Filtering" },
				{ href: "/docs/styling", label: "Styling" },
				{ href: "/docs/multi-select", label: "Multi Select" },
				{ href: "/docs/grouping", label: "Grouping" },
			],
		},
		{
			title: "Reference",
			links: [{ href: "/docs/api", label: "API" }],
		},
		{
			title: "Examples",
			links: [
				{ href: "/demo/single-select", label: "Single Select" },
				{ href: "/demo/multi-select", label: "Multi Select" },
				{ href: "/demo/custom-data", label: "Custom Data" },
				{ href: "/demo/groups", label: "Groups" },
			],
		},
	],
	copyright: "Lucio D'Alessandro",
};
