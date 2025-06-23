import { describe, expect, it } from "vitest";
import {
	getLabelFromOption,
	getSearchQueryLabelFromOption,
	getValueFromOption,
	getValueStringFromOption,
	sanitizeForTestId,
} from "./utils";

describe("getLabelFromOption", () => {
	it("should return the label for object options", () => {
		const option = { label: "Test Label", value: "test" };
		expect(getLabelFromOption(option)).toBe("Test Label");
	});

	it("should return the string for string options", () => {
		expect(getLabelFromOption("Simple String")).toBe("Simple String");
	});

	it("should handle empty strings", () => {
		expect(getLabelFromOption("")).toBe("");
	});

	it("should handle object options with additional properties", () => {
		const option = { label: "Test Label", value: "test", description: "Some description" };
		expect(getLabelFromOption(option)).toBe("Test Label");
	});

	it("should handle new value options", () => {
		const option = { label: "Create New: Test", value: "test", isNewValue: true as const };
		expect(getLabelFromOption(option)).toBe("Create New: Test");
	});
});

describe("getValueFromOption", () => {
	it("should return the option object for object options with searchOptionKeys", () => {
		const option = { label: "Test Label", value: "test" };
		const result = getValueFromOption(option, ["label"]);
		expect(result).toEqual({ label: "Test Label", value: "test" });
	});

	it("should return the string for string options", () => {
		expect(getValueFromOption("Simple String", undefined)).toBe("Simple String");
	});

	it("should handle empty strings", () => {
		expect(getValueFromOption("", undefined)).toBe("");
	});

	it("should handle object options with additional properties", () => {
		const option = { label: "Test Label", value: "test", description: "Some description" };
		const result = getValueFromOption(option, ["label", "description"]);
		expect(result).toEqual({ label: "Test Label", value: "test", description: "Some description" });
	});

	it("should handle new value options", () => {
		const option = { label: "Create New: Test", value: "test", isNewValue: true as const };
		const result = getValueFromOption(option, ["label"]);
		expect(result).toEqual({ label: "test", value: "test" });
	});

	it("should return value string when no searchOptionKeys provided", () => {
		const option = { label: "Test Label", value: "test" };
		const result = getValueFromOption(option, undefined);
		expect(result).toBe("test");
	});
});

describe("getSearchQueryLabelFromOption", () => {
	it("should return the label for object options", () => {
		const option = { label: "Test Label", value: "test" };
		expect(getSearchQueryLabelFromOption(option)).toBe("Test Label");
	});

	it("should return the string for string options", () => {
		expect(getSearchQueryLabelFromOption("Simple String")).toBe("Simple String");
	});

	it("should handle empty strings", () => {
		expect(getSearchQueryLabelFromOption("")).toBe("");
	});

	it("should handle new value options", () => {
		const option = { label: "Create New: Test", value: "test", isNewValue: true as const };
		expect(getSearchQueryLabelFromOption(option)).toBe("test");
	});
});

describe("getValueStringFromOption", () => {
	it("should return the value as string for object options", () => {
		const option = { label: "Test Label", value: "test" };
		expect(getValueStringFromOption(option, ["label"])).toBe("test");
	});

	it("should return the string for string options", () => {
		expect(getValueStringFromOption("Simple String", undefined)).toBe("Simple String");
	});

	it("should handle empty strings", () => {
		expect(getValueStringFromOption("", undefined)).toBe("");
	});

	it("should handle object options with additional properties", () => {
		const option = { label: "Test Label", value: "test", description: "Some description" };
		expect(getValueStringFromOption(option, ["label", "description"])).toBe("test");
	});

	it("should handle new value options", () => {
		const option = { label: "Create New: Test", value: "test", isNewValue: true as const };
		expect(getValueStringFromOption(option, ["label"])).toBe("test");
	});
});

describe("sanitizeForTestId", () => {
	it("should remove spaces and special characters", () => {
		expect(sanitizeForTestId("Pas de la Casa, AD")).toBe("pas-de-la-casa-ad");
		expect(sanitizeForTestId("London, GB")).toBe("london-gb");
		expect(sanitizeForTestId("New York City")).toBe("new-york-city");
	});

	it("should handle multiple consecutive special characters", () => {
		expect(sanitizeForTestId("Pas de la Casa, AD")).toBe("pas-de-la-casa-ad");
		expect(sanitizeForTestId("Option (with) [brackets]")).toBe("option-with-brackets");
		expect(sanitizeForTestId("Multiple   spaces")).toBe("multiple-spaces");
	});

	it("should convert to lowercase", () => {
		expect(sanitizeForTestId("UPPERCASE")).toBe("uppercase");
		expect(sanitizeForTestId("MixedCase")).toBe("mixedcase");
	});

	it("should handle empty string", () => {
		expect(sanitizeForTestId("")).toBe("");
	});

	it("should handle string with only special characters", () => {
		expect(sanitizeForTestId("!@#$%^&*()")).toBe("");
	});

	it("should handle string with only alphanumeric characters", () => {
		expect(sanitizeForTestId("HelloWorld123")).toBe("helloworld123");
	});
});
