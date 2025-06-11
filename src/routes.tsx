import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { SearchExample } from "./components/SearchExample";

// Define search params type
interface SearchParams {
	page?: number;
}

// Root route
const rootRoute = createRootRoute({
	component: () => <SearchExample />,
});

// Index route
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => <h1>Welcome to the Home Page</h1>,
});

// About route
const aboutRoute = createRoute({
	path: "/about",
	getParentRoute: () => rootRoute,
	component: () => <h1>About Us</h1>,
});

export type TSearchParams = {
	buttonFilters: {
		[key: string]: boolean;
	};
};

const buttonFiltersRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/fitlers",
	component: () => <h1>Filteres Us</h1>,
	validateSearch: (search: Record<string, unknown>): TSearchParams => {
		return {
			buttonFilters: Object.keys(search).reduce(
				(acc, key) => {
					acc[key] = search[key] === "true";
					return acc;
				},
				{} as Record<string, boolean>,
			),
		};
	},
});

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, buttonFiltersRoute]);

// Create the router
export const router = createRouter({ routeTree });

// Register the router for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
