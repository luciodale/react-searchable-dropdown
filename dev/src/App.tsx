// dev/src/App.tsx
import React from "react";
import "./App.css";
import { DefaultDropdownDemo } from "./components/DefaultDropdownDemo";
import { SlickGreyEleganceDropdownDemo } from "./components/SlickGreyDropdownDemo"; // <--- NEW
// import { SearchExample } from "./SearchExample"; // Keep or remove if you replace it completely

function App() {
	return (
		<div
			className="App"
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "40px",
				padding: "20px",
			}}
		>
			<h2 style={{ textAlign: "center" }}>React Searchable Dropdown Demos</h2>
			<DefaultDropdownDemo />
			<SlickGreyEleganceDropdownDemo />
		</div>
	);
}

export default App;
