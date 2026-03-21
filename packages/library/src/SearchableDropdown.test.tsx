import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchableDropdown } from "./SearchableDropdown";
import type { TDropdownOption, TSearchableDropdownProps } from "./types";

afterEach(cleanup);

const options = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

function queryListbox() {
	return document.querySelector("[role='listbox']");
}

function queryOptions() {
	return document.querySelectorAll("[role='option']");
}

type TestOverrides = {
	value?: string;
	setValue?: (option: string) => void;
	disabled?: boolean;
};

function renderDropdown(props: TestOverrides = {}) {
	const setValue = vi.fn();
	const result = render(
		<SearchableDropdown
			options={options}
			value={undefined}
			setValue={setValue}
			placeholder="Pick a fruit"
			{...props}
		/>,
	);
	return { setValue, ...result };
}

describe("SearchableDropdown", () => {
	it("renders with placeholder", () => {
		renderDropdown();
		expect(screen.getByPlaceholderText("Pick a fruit")).toBeDefined();
	});

	it("opens dropdown on focus", async () => {
		renderDropdown();
		await userEvent.click(screen.getByPlaceholderText("Pick a fruit"));
		expect(queryListbox()).not.toBeNull();
	});

	it("shows options when opened", async () => {
		renderDropdown();
		await userEvent.click(screen.getByPlaceholderText("Pick a fruit"));
		expect(queryOptions().length).toBe(options.length);
	});

	it("filters options on type", async () => {
		renderDropdown();
		const input = screen.getByPlaceholderText("Pick a fruit");
		await userEvent.click(input);
		await userEvent.type(input, "ban");
		const opts = queryOptions();
		// "Banana" + "Create New: ban" option
		expect(opts.length).toBeGreaterThanOrEqual(1);
		expect(document.querySelector("[role='option']")?.textContent).toContain("ban");
	});

	it("calls setValue on option click", async () => {
		const { setValue } = renderDropdown();
		await userEvent.click(screen.getByPlaceholderText("Pick a fruit"));
		const cherryOption = screen.getByTestId("dropdown-option-2");
		await userEvent.click(cherryOption);
		expect(setValue).toHaveBeenCalledWith("Cherry");
	});

	it("closes dropdown after selection via Enter", async () => {
		const { setValue } = renderDropdown();
		const input = screen.getByPlaceholderText("Pick a fruit");
		await userEvent.click(input);
		await userEvent.keyboard("{Enter}");
		expect(setValue).toHaveBeenCalledWith("Apple");
		expect(queryListbox()).toBeNull();
	});

	it("navigates options with arrow keys", async () => {
		renderDropdown();
		const input = screen.getByPlaceholderText("Pick a fruit");
		await userEvent.click(input);
		await userEvent.keyboard("{ArrowDown}");
		const secondOption = screen.getByTestId("dropdown-option-1");
		expect(secondOption.getAttribute("aria-selected")).toBe("true");
	});

	it("closes dropdown on Escape", async () => {
		renderDropdown();
		const input = screen.getByPlaceholderText("Pick a fruit");
		await userEvent.click(input);
		expect(queryListbox()).not.toBeNull();
		await userEvent.keyboard("{Escape}");
		expect(queryListbox()).toBeNull();
	});

	it("renders disabled state", () => {
		renderDropdown({ disabled: true });
		const input = screen.getByPlaceholderText("Pick a fruit");
		expect(input).toHaveProperty("disabled", true);
	});

	describe("a11y", () => {
		it("input has combobox role", () => {
			renderDropdown();
			expect(screen.getByRole("combobox")).toBeDefined();
		});

		it("input has aria-expanded=false when closed", () => {
			renderDropdown();
			const input = screen.getByRole("combobox");
			expect(input.getAttribute("aria-expanded")).toBe("false");
		});

		it("input has aria-expanded=true when open", async () => {
			renderDropdown();
			const input = screen.getByRole("combobox");
			await userEvent.click(input);
			expect(input.getAttribute("aria-expanded")).toBe("true");
		});

		it("listbox has role=listbox", async () => {
			renderDropdown();
			await userEvent.click(screen.getByRole("combobox"));
			expect(queryListbox()).not.toBeNull();
		});

		it("options have role=option", async () => {
			renderDropdown();
			await userEvent.click(screen.getByRole("combobox"));
			expect(queryOptions().length).toBe(options.length);
		});

		it("input has aria-controls pointing to listbox", async () => {
			renderDropdown();
			const input = screen.getByRole("combobox");
			await userEvent.click(input);
			const listbox = queryListbox();
			expect(input.getAttribute("aria-controls")).toBe(listbox?.id);
		});

		it("input has aria-activedescendant when navigating", async () => {
			renderDropdown();
			const input = screen.getByRole("combobox");
			await userEvent.click(input);
			const firstOption = screen.getByTestId("dropdown-option-0");
			expect(input.getAttribute("aria-activedescendant")).toBe(firstOption.id);
		});

		it("input has aria-autocomplete=list", () => {
			renderDropdown();
			const input = screen.getByRole("combobox");
			expect(input.getAttribute("aria-autocomplete")).toBe("list");
		});
	});

	describe("object options", () => {
		const objectOptions = [
			{ label: "Red", value: "red" },
			{ label: "Green", value: "green" },
			{ label: "Blue", value: "blue" },
		];

		it("renders object option labels", async () => {
			render(
				<SearchableDropdown
					options={objectOptions}
					value={undefined}
					setValue={vi.fn()}
					searchOptionKeys={["label"]}
					placeholder="Pick a color"
				/>,
			);
			await userEvent.click(screen.getByPlaceholderText("Pick a color"));
			expect(screen.getByText("Red")).toBeDefined();
			expect(screen.getByText("Green")).toBeDefined();
		});

		it("calls setValue with full object", async () => {
			const setValue = vi.fn();
			render(
				<SearchableDropdown
					options={objectOptions}
					value={undefined}
					setValue={setValue}
					searchOptionKeys={["label"]}
					placeholder="Pick a color"
				/>,
			);
			await userEvent.click(screen.getByPlaceholderText("Pick a color"));
			await userEvent.click(screen.getByText("Blue"));
			expect(setValue).toHaveBeenCalledWith({ label: "Blue", value: "blue" });
		});

		it("defaults searchOptionKeys to ['label'] for object options", async () => {
			render(
				<SearchableDropdown
					options={objectOptions}
					value={undefined}
					setValue={vi.fn()}
					placeholder="Pick a color"
				/>,
			);
			const input = screen.getByPlaceholderText("Pick a color");
			await userEvent.click(input);
			await userEvent.type(input, "gre");
			const texts = Array.from(queryOptions()).map((o) => o.textContent);
			expect(texts.some((t) => t?.includes("Green"))).toBe(true);
		});

		it("allows searching additional keys via searchOptionKeys", async () => {
			const extendedOptions = [
				{ label: "Red", value: "red", hex: "#ff0000" },
				{ label: "Green", value: "green", hex: "#00ff00" },
			];
			render(
				<SearchableDropdown
					options={extendedOptions}
					value={undefined}
					setValue={vi.fn()}
					searchOptionKeys={["label", "hex"]}
					placeholder="Pick"
				/>,
			);
			const input = screen.getByPlaceholderText("Pick");
			await userEvent.click(input);
			await userEvent.type(input, "#00ff");
			const texts = Array.from(queryOptions()).map((o) => o.textContent);
			expect(texts.some((t) => t?.includes("Green"))).toBe(true);
		});
	});

	describe("callback return types", () => {
		it("returns full object with non-primitive properties on select", async () => {
			const setValue = vi.fn();
			const options = [
				{ label: "Item", value: "item", metadata: { color: "red", sizes: [1, 2, 3] }, tags: ["a"] },
			];
			render(
				<SearchableDropdown
					options={options}
					value={undefined}
					setValue={setValue}
					placeholder="Pick"
				/>,
			);
			await userEvent.click(screen.getByPlaceholderText("Pick"));
			await userEvent.click(screen.getByText("Item"));
			expect(setValue).toHaveBeenCalledWith({
				label: "Item",
				value: "item",
				metadata: { color: "red", sizes: [1, 2, 3] },
				tags: ["a"],
			});
		});

		it("returns string value on select for string options", async () => {
			const setValue = vi.fn();
			render(
				<SearchableDropdown
					options={["Alpha", "Beta"]}
					value={undefined}
					setValue={setValue}
					placeholder="Pick"
				/>,
			);
			await userEvent.click(screen.getByPlaceholderText("Pick"));
			await userEvent.click(screen.getByText("Beta"));
			expect(setValue).toHaveBeenCalledWith("Beta");
		});
	});

	describe("wrapper component", () => {
		it("generic wrapper forwards props without type errors", async () => {
			function MyDropdown<T extends TDropdownOption, G>(props: TSearchableDropdownProps<T, G>) {
				return <SearchableDropdown dropdownOptionsHeight={320} debounceDelay={0} {...props} />;
			}

			const setValue = vi.fn();
			render(
				<MyDropdown
					options={["Alpha", "Beta", "Gamma"]}
					value={undefined}
					setValue={setValue}
					placeholder="Wrapped"
				/>,
			);
			const input = screen.getByPlaceholderText("Wrapped");
			await userEvent.click(input);
			expect(queryOptions().length).toBe(3);
		});

		it("generic wrapper works with object options", async () => {
			function MyDropdown<T extends TDropdownOption, G>(props: TSearchableDropdownProps<T, G>) {
				return <SearchableDropdown placeholder="Wrapped" {...props} />;
			}

			const objectOptions = [
				{ label: "One", value: "1" },
				{ label: "Two", value: "2" },
			];
			const setValue = vi.fn();
			render(<MyDropdown options={objectOptions} value={undefined} setValue={setValue} />);
			const input = screen.getByPlaceholderText("Wrapped");
			await userEvent.click(input);
			expect(queryOptions().length).toBe(2);
		});
	});

	describe("disabled options", () => {
		const optionsWithDisabled = [
			{ label: "Active", value: "active" },
			{ label: "Disabled", value: "disabled", disabled: true },
		];

		it("marks disabled option with aria-disabled", async () => {
			render(
				<SearchableDropdown
					options={optionsWithDisabled}
					value={undefined}
					setValue={vi.fn()}
					searchOptionKeys={["label"]}
					placeholder="Pick"
				/>,
			);
			await userEvent.click(screen.getByPlaceholderText("Pick"));
			const disabledOption = screen.getByText("Disabled").closest("[role='option']");
			expect(disabledOption?.getAttribute("aria-disabled")).toBe("true");
		});
	});
});
