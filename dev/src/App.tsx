// dev/src/App.tsx
import React from "react";
import "./App.css";
import { DataTypes } from "./components/documentation/DataTypes";
import { Examples } from "./components/documentation/Examples";
import { Features } from "./components/documentation/Features";
import { Hero } from "./components/documentation/Hero";
import { Installation } from "./components/documentation/Installation";
import { Navigation } from "./components/documentation/Navigation";

function App() {
	return (
		<div className="docs-container">
			<Navigation />
			<Hero />
			<main className="docs-main">
				<Installation />
				<Examples />
				<Features />
				<DataTypes />
			</main>
		</div>
	);
}

export default App;
