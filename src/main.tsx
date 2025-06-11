import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import "./index.css";
import { router } from "./routes";

// Start MSW in development
if (import.meta.env.DEV) {
	await import("./mocks/browser").then(({ worker }) => worker.start());
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
