import { expect, test } from "@playwright/test";

test.describe("SearchableDropdown", () => {
	test("should open dropdown and select an option", async ({ page }) => {
		await page.goto("/");

		const dropdownInput = page.getByTestId("lda-dropdown-search-query-input");

		await dropdownInput.click();

		await expect(page.locator("text=Pas de la Casa, AD")).toBeVisible();
		await expect(page.locator("text=Ordino, AD")).toBeVisible();
		await expect(page.locator("text=la Massana, AD")).toBeVisible();

		await page.locator("text=la Massana, AD").click();

		await expect(page.locator("text=Pas de la Casa, AD")).not.toBeVisible();
		await expect(page.locator("text=Ordino, AD")).not.toBeVisible();

		await expect(dropdownInput).toHaveValue("la Massana, AD");
	});

	test("should filter options when typing", async ({ page }) => {
		await page.goto("/");

		const dropdownInput = page.getByTestId("lda-dropdown-search-query-input");

		await dropdownInput.focus();
		await dropdownInput.fill("new london");

		await expect(page.locator("text=New London")).toHaveCount(8);
		await expect(page.locator("text=El Tarter, AD")).not.toBeVisible();
	});

	test("should handle keyboard navigation", async ({ page }) => {
		await page.goto("/");

		const dropdownInput = page.getByTestId("lda-dropdown-search-query-input").first();

		await dropdownInput.click();

		await dropdownInput.press("ArrowDown");
		await dropdownInput.press("ArrowDown");
		await dropdownInput.press("Enter");

		await expect(dropdownInput).toHaveValue("Pas de la Casa, AD");

		await dropdownInput.click();
		await dropdownInput.press("ArrowDown");
		await dropdownInput.press("ArrowDown");
		await dropdownInput.press("ArrowDown");
		await dropdownInput.press("Tab");

		await expect(dropdownInput).toHaveValue("Ordino, AD");
	});

	test("should close dropdown when pressing Escape", async ({ page }) => {
		await page.goto("/");

		const dropdownInput = page.getByTestId("lda-dropdown-search-query-input");
		await dropdownInput.click();

		// Verify dropdown is open
		await expect(page.locator("text=Pas de la Casa, AD")).toBeVisible();

		// Press Escape
		await page.keyboard.press("Escape");

		// Verify dropdown is closed
		await expect(page.locator("text=Pas de la Casa, AD")).not.toBeVisible();
	});

	test("should close dropdown when clicking outside", async ({ page }) => {
		await page.goto("/");

		const dropdownInput = page.getByTestId("lda-dropdown-search-query-input");
		await dropdownInput.click();

		// Verify dropdown is open
		await expect(page.locator("text=Pas de la Casa, AD")).toBeVisible();

		// Click outside the dropdown (on the page body)
		await page.click("body");

		// Verify dropdown is closed
		await expect(page.locator("text=Pas de la Casa, AD")).not.toBeVisible();
	});

	test("should show 'Create New' option when no matches found", async ({ page }) => {
		await page.goto("/");

		const dropdownInput = page.getByTestId("lda-dropdown-search-query-input");
		await dropdownInput.focus();
		await dropdownInput.fill("something not found");

		await expect(page.locator("text=Create New: something not found")).toHaveCount(1);
	});

	test("should select 'Create New' option when clicked", async ({ page }) => {
		await page.goto("/");

		const dropdownInput = page.getByTestId("lda-dropdown-search-query-input");
		await dropdownInput.focus();
		await dropdownInput.fill("city name");

		// Click on the "Create New" option
		await page.locator("text=Create New: city name").click();

		// Verify the input shows the new value
		await expect(dropdownInput).toHaveValue("city name");
	});

	// making sure the navigation index is reset when closing and reopening the dropdown
	test("should select first option when pressing Enter without navigation", async ({ page }) => {
		await page.goto("/");

		const dropdownInput = page.getByTestId("lda-dropdown-search-query-input");
		await dropdownInput.click();

		await dropdownInput.press("ArrowDown");
		await dropdownInput.press("ArrowDown");
		await dropdownInput.press("ArrowDown");

		await page.click("body");

		await dropdownInput.click();
		await dropdownInput.press("Enter");

		await expect(dropdownInput).toHaveValue("El Tarter, AD");
	});
});
