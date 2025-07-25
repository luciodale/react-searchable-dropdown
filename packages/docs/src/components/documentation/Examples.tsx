import React, { useState } from "react";
import { AbsoluteOverflowDemo } from "../AbsoluteOverflowDemo";
import { CustomDataDemo } from "../CustomDataDemo";
import { GroupsDropdownDemo } from "../GroupsDropdownDemo";
import { MultiDropdownDemo } from "../MultiDropdownDemo";
import { ServerOptionsDropdownDemo } from "../ServerOptionsDropdownDemo";
import { SingleDropdownDemo } from "../SingleDropdownDemo";
import { SlickGreyEleganceDropdownDemo } from "../SlickGreyDropdownDemo";
import { getComponentCode } from "../documentation/CodeSnippets";

export function Examples() {
	const [activeTab, setActiveTab] = useState<
		"single" | "multi" | "custom" | "styled" | "server" | "absolute-overflow" | "groups"
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
					data-testid="tab-single-select"
				>
					Single Select
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "multi" ? "active" : ""}`}
					onClick={() => setActiveTab("multi")}
					data-testid="tab-multi-select"
				>
					Multi Select
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "groups" ? "active" : ""}`}
					onClick={() => setActiveTab("groups")}
					data-testid="tab-groups"
				>
					Groups
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "custom" ? "active" : ""}`}
					onClick={() => setActiveTab("custom")}
					data-testid="tab-custom-data"
				>
					Use Your Data
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "styled" ? "active" : ""}`}
					onClick={() => setActiveTab("styled")}
					data-testid="tab-custom-style"
				>
					Custom Style
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "server" ? "active" : ""}`}
					onClick={() => setActiveTab("server")}
					data-testid="tab-server-search"
				>
					Server-Side Search
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "absolute-overflow" ? "active" : ""}`}
					onClick={() => setActiveTab("absolute-overflow")}
					data-testid="tab-absolute-overflow"
				>
					Absolute Overflow
				</button>
			</div>

			<div className="demo-container" data-testid="demo-container">
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
				) : activeTab === "groups" ? (
					<GroupsDropdownDemo />
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
