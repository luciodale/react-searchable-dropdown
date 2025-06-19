// dev/src/App.tsx
import React from "react";
import "./App.css";
import { DataTypes } from "./components/documentation/DataTypes";
import { Examples } from "./components/documentation/Examples";
import { Features } from "./components/documentation/Features";
import { Hero } from "./components/documentation/Hero";
import { Installation } from "./components/documentation/Installation";
import { Navigation } from "./components/documentation/Navigation";
// import "@luciodale/react-searchable-dropdown/dist/assets/single-style.css";
// import "@luciodale/react-searchable-dropdown/dist/assets/multi-style.css";
import "../../src/assets/multi-style.css";
import "../../src/assets/single-style.css";
import "./styles/slick-grey.css";

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
