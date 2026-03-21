import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchableDropdownMulti } from "./SearchableDropdownMulti";

afterEach(cleanup);

const options = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

function queryListbox() {
	return document.querySelector("[role='listbox']");
}

function queryOptions() {
	return document.querySelectorAll("[role='option']");
}

type TestOverrides = {
	values?: string[];
	setValues?: (options: string[]) => void;
	disabled?: boolean;
	onClearAll?: () => void;
	onClearOption?: (option: string) => void;
};

function renderMultiDropdown(props: TestOverrides = {}) {
	const setValues = vi.fn();
	const result = render(
		<SearchableDropdownMulti
			options={options}
			values={undefined}
			setValues={setValues}
			placeholder="Pick fruits"
			{...props}
		/>,
	);
	return { setValues, ...result };
}

describe("SearchableDropdownMulti", () => {
	it("renders with placeholder", () => {
		renderMultiDropdown();
		expect(screen.getByPlaceholderText("Pick fruits")).toBeDefined();
	});

	it("opens dropdown on focus", async () => {
		renderMultiDropdown();
		await userEvent.click(screen.getByPlaceholderText("Pick fruits"));
		expect(queryListbox()).not.toBeNull();
	});

	it("shows options when opened", async () => {
		renderMultiDropdown();
		await userEvent.click(screen.getByPlaceholderText("Pick fruits"));
		expect(queryOptions().length).toBe(options.length);
	});

	it("calls setValues with selected option", async () => {
		const { setValues } = renderMultiDropdown();
		await userEvent.click(screen.getByPlaceholderText("Pick fruits"));
		const cherryOption = screen.getByTestId("dropdown-option-2");
		await userEvent.click(cherryOption);
		expect(setValues).toHaveBeenCalledWith(["Cherry"]);
	});

	it("keeps dropdown open after selection via Enter", async () => {
		renderMultiDropdown();
		await userEvent.click(screen.getByPlaceholderText("Pick fruits"));
		await userEvent.keyboard("{Enter}");
		expect(queryListbox()).not.toBeNull();
	});

	it("filters selected options from dropdown", async () => {
		renderMultiDropdown({ values: ["Apple", "Banana"] });
		await userEvent.click(screen.getByRole("combobox"));
		const opts = queryOptions();
		// 5 total - 2 selected = 3 remaining
		expect(opts.length).toBe(3);
	});

	it("renders chips for selected values", () => {
		renderMultiDropdown({ values: ["Apple", "Banana"] });
		expect(screen.getByText("Apple")).toBeDefined();
		expect(screen.getByText("Banana")).toBeDefined();
	});

	it("removes chip via close button", async () => {
		const setValues = vi.fn();
		render(
			<SearchableDropdownMulti
				options={options}
				values={["Apple", "Banana"]}
				setValues={setValues}
				placeholder="Pick fruits"
			/>,
		);
		const removeButton = screen.getByTestId("chip-remove-apple");
		await userEvent.click(removeButton);
		expect(setValues).toHaveBeenCalledWith(["Banana"]);
	});

	it("calls onClearAll when clear all is clicked", async () => {
		const setValues = vi.fn();
		const onClearAll = vi.fn();
		render(
			<SearchableDropdownMulti
				options={options}
				values={["Apple"]}
				setValues={setValues}
				onClearAll={onClearAll}
				placeholder="Pick fruits"
			/>,
		);
		const clearAll = screen.getByTestId("clear-all");
		await userEvent.click(clearAll);
		expect(setValues).toHaveBeenCalledWith([]);
		expect(onClearAll).toHaveBeenCalled();
	});

	it("returns full object with non-primitive properties on select", async () => {
		const setValues = vi.fn();
		const objectOptions = [
			{ label: "Item", value: "item", metadata: { nested: true }, tags: ["x", "y"] },
		];
		render(
			<SearchableDropdownMulti
				options={objectOptions}
				values={undefined}
				setValues={setValues}
				placeholder="Pick"
			/>,
		);
		await userEvent.click(screen.getByPlaceholderText("Pick"));
		await userEvent.click(screen.getByTestId("dropdown-option-0"));
		expect(setValues).toHaveBeenCalledWith([
			{ label: "Item", value: "item", metadata: { nested: true }, tags: ["x", "y"] },
		]);
	});

	it("closes dropdown on Escape", async () => {
		renderMultiDropdown();
		await userEvent.click(screen.getByPlaceholderText("Pick fruits"));
		expect(queryListbox()).not.toBeNull();
		await userEvent.keyboard("{Escape}");
		expect(queryListbox()).toBeNull();
	});

	it("filters options on type", async () => {
		renderMultiDropdown();
		const input = screen.getByPlaceholderText("Pick fruits");
		await userEvent.click(input);
		await userEvent.type(input, "eld");
		const opts = queryOptions();
		expect(opts.length).toBeGreaterThanOrEqual(1);
	});

	describe("a11y", () => {
		it("input has combobox role", () => {
			renderMultiDropdown();
			expect(screen.getByRole("combobox")).toBeDefined();
		});

		it("input has aria-expanded=false when closed", () => {
			renderMultiDropdown();
			const input = screen.getByRole("combobox");
			expect(input.getAttribute("aria-expanded")).toBe("false");
		});

		it("input has aria-expanded=true when open", async () => {
			renderMultiDropdown();
			const input = screen.getByRole("combobox");
			await userEvent.click(input);
			expect(input.getAttribute("aria-expanded")).toBe("true");
		});

		it("listbox has aria-multiselectable", async () => {
			renderMultiDropdown();
			await userEvent.click(screen.getByRole("combobox"));
			const listbox = queryListbox();
			expect(listbox?.getAttribute("aria-multiselectable")).toBe("true");
		});

		it("options have role=option", async () => {
			renderMultiDropdown();
			await userEvent.click(screen.getByRole("combobox"));
			expect(queryOptions().length).toBe(options.length);
		});
	});
});
