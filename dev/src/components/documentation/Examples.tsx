import React, { useState } from "react";
import { AbsoluteOverflowDemo } from "../AbsoluteOverflowDemo";
import { CustomDataDemo } from "../CustomDataDemo";
import { MultiDropdownDemo } from "../MultiDropdownDemo";
import { ServerOptionsDropdownDemo } from "../ServerOptionsDropdownDemo";
import { SingleDropdownDemo } from "../SingleDropdownDemo";
import { SlickGreyEleganceDropdownDemo } from "../SlickGreyDropdownDemo";
import { getComponentCode } from "../documentation/CodeSnippets";

export function Examples() {
	const [activeTab, setActiveTab] = useState<
		"single" | "multi" | "custom" | "styled" | "server" | "absolute-overflow"
	>("single");

	const exampleSnippet = getComponentCode(activeTab);

	return (
		<section className="docs-section">
			<h2>Basic Usage</h2>
			<div className="demo-tabs">
				<button
					type="button"
					className={`tab-button ${activeTab === "single" ? "active" : ""}`}
					onClick={() => setActiveTab("single")}
				>
					Single Select
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "multi" ? "active" : ""}`}
					onClick={() => setActiveTab("multi")}
				>
					Multi Select
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "custom" ? "active" : ""}`}
					onClick={() => setActiveTab("custom")}
				>
					Use Your Data
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "styled" ? "active" : ""}`}
					onClick={() => setActiveTab("styled")}
				>
					Custom Style
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "server" ? "active" : ""}`}
					onClick={() => setActiveTab("server")}
				>
					Server-Side Search
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "absolute-overflow" ? "active" : ""}`}
					onClick={() => setActiveTab("absolute-overflow")}
				>
					Absolute Overflow
				</button>
			</div>

			<div className="demo-container">
				{activeTab === "single" ? (
					<SingleDropdownDemo />
				) : activeTab === "multi" ? (
					<MultiDropdownDemo />
				) : activeTab === "custom" ? (
					<CustomDataDemo />
				) : activeTab === "styled" ? (
					<SlickGreyEleganceDropdownDemo />
				) : activeTab === "absolute-overflow" ? (
					<AbsoluteOverflowDemo />
				) : (
					<ServerOptionsDropdownDemo />
				)}
			</div>

			{activeTab === "styled" && (
				<div className="docs-section">
					<p>
						The styles for this example are defined in{" "}
						<a
							href="https://github.com/luciodale/react-searchable-dropdown/blob/main/dev/src/styles/slick-grey.css"
							target="_blank"
							rel="noopener noreferrer"
						>
							slick-grey.css
						</a>
						. Import this file to use the same styling.
					</p>
				</div>
			)}

			{exampleSnippet && (
				<div className="code-block">
					<pre>
						<code>{exampleSnippet}</code>
					</pre>
				</div>
			)}
		</section>
	);
}
