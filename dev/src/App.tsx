// dev/src/App.tsx
import React from "react";
import "./App.css";
import { DataTypes } from "./components/Documentation/DataTypes";
import { Examples } from "./components/Documentation/Examples";
import { Features } from "./components/Documentation/Features";
import { Hero } from "./components/Documentation/Hero";
import { Installation } from "./components/Documentation/Installation";
import { Navigation } from "./components/Documentation/Navigation";

function App() {
	return (
		<div className="docs-container">
			<Navigation />
			<Hero />
			<main className="docs-main">
				<Features />
				<Installation />
				<Examples />
				<DataTypes />
			</main>
		</div>
	);
}

export default App;
