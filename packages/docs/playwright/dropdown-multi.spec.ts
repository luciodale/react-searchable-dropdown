import { expect, test } from "@playwright/test";

test.describe("SearchableDropdownMulti", () => {
	test("should keep dropdown open after selecting an option", async ({ page }) => {
		await page.goto("/");

		await page.getByTestId("tab-multi-select").click();
		const dropdownInput = page.getByTestId("lda-multi-search-query-input");
		await dropdownInput.click();

		// Verify dropdown is open (option in dropdown)
		await expect(
			page.locator(".lda-multi-dropdown-options >> text=Pas de la Casa, AD"),
		).toBeVisible();

		// Select first option
		await page.locator(".lda-multi-dropdown-options >> text=Pas de la Casa, AD").click();

		// Verify dropdown remains open (other options still in dropdown)
		await expect(page.locator(".lda-multi-dropdown-options >> text=Ordino, AD")).toBeVisible();
		await expect(page.locator(".lda-multi-dropdown-options >> text=la Massana, AD")).toBeVisible();

		// Verify selected option appears as a chip (in container)
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-pas-de-la-casa-ad"]'),
		).toBeVisible();
	});

	test("should remove option when clicking X on chip", async ({ page }) => {
		await page.goto("/");
		await page.getByTestId("tab-multi-select").click();
		const dropdownInput = page.getByTestId("lda-multi-search-query-input");
		await dropdownInput.click();

		// Select an option
		await page.locator(".lda-multi-dropdown-options >> text=Pas de la Casa, AD").click();

		// Verify chip is created (in container)
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-pas-de-la-casa-ad"]'),
		).toBeVisible();

		// Click the X button on the chip using the sanitized test ID
		await page
			.locator('.lda-multi-dropdown-container [data-testid="chip-remove-pas-de-la-casa-ad"]')
			.click();

		// Verify chip is removed (in container)
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-pas-de-la-casa-ad"]'),
		).not.toBeVisible();
	});

	test("should clear all options when clicking clear all button", async ({ page }) => {
		await page.goto("/");
		await page.getByTestId("tab-multi-select").click();
		const dropdownInput = page.getByTestId("lda-multi-search-query-input");
		await dropdownInput.click();

		// Select multiple options
		await page.locator(".lda-multi-dropdown-options >> text=Pas de la Casa, AD").click();
		await page.locator(".lda-multi-dropdown-options >> text=Ordino, AD").click();
		await page.locator(".lda-multi-dropdown-options >> text=la Massana, AD").click();

		// Verify chips are created (in container)
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-pas-de-la-casa-ad"]'),
		).toBeVisible();
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-ordino-ad"]'),
		).toBeVisible();
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-la-massana-ad"]'),
		).toBeVisible();

		// Click clear all button (in container)
		await page.locator('.lda-multi-dropdown-container [data-testid="clear-all"]').click();

		// Verify all chips are removed (in container)
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-pas-de-la-casa-ad"]'),
		).not.toBeVisible();
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-ordino-ad"]'),
		).not.toBeVisible();
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-la-massana-ad"]'),
		).not.toBeVisible();
	});

	test("should remove option from dropdown when selected", async ({ page }) => {
		await page.goto("/");
		await page.getByTestId("tab-multi-select").click();
		const dropdownInput = page.getByTestId("lda-multi-search-query-input");
		await dropdownInput.click();

		// Verify all options are initially visible (in dropdown)
		await expect(
			page.locator(".lda-multi-dropdown-options >> text=Pas de la Casa, AD"),
		).toBeVisible();
		await expect(page.locator(".lda-multi-dropdown-options >> text=Ordino, AD")).toBeVisible();
		await expect(page.locator(".lda-multi-dropdown-options >> text=la Massana, AD")).toBeVisible();

		// Select an option
		await page.locator(".lda-multi-dropdown-options >> text=Pas de la Casa, AD").click();

		// Verify the option is no longer in the dropdown
		await expect(
			page.locator(".lda-multi-dropdown-options >> text=Pas de la Casa, AD"),
		).not.toBeVisible();

		// Verify it appears as a chip instead (in container)
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-pas-de-la-casa-ad"]'),
		).toBeVisible();
	});

	test("should handle multiple selections correctly", async ({ page }) => {
		await page.goto("/");
		await page.getByTestId("tab-multi-select").click();
		const dropdownInput = page.getByTestId("lda-multi-search-query-input");
		await dropdownInput.click();

		// Select multiple options
		await page.locator(".lda-multi-dropdown-options >> text=Pas de la Casa, AD").click();
		await page.locator(".lda-multi-dropdown-options >> text=Ordino, AD").click();

		// Verify both are selected as chips (in container)
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-pas-de-la-casa-ad"]'),
		).toBeVisible();
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-ordino-ad"]'),
		).toBeVisible();

		// Verify they're not in the dropdown anymore
		await expect(
			page.locator(".lda-multi-dropdown-options >> text=Pas de la Casa, AD"),
		).not.toBeVisible();
		await expect(page.locator(".lda-multi-dropdown-options >> text=Ordino, AD")).not.toBeVisible();

		// Verify remaining options are still in dropdown
		await expect(page.locator(".lda-multi-dropdown-options >> text=la Massana, AD")).toBeVisible();
	});

	test("should filter options excluding already selected ones", async ({ page }) => {
		await page.goto("/");
		await page.getByTestId("tab-multi-select").click();
		const dropdownInput = page.getByTestId("lda-multi-search-query-input");
		await dropdownInput.focus();
		await dropdownInput.fill("london");

		// Select a London option (in dropdown)
		await page.locator(".lda-multi-dropdown-options >> text=London, GB").click();

		// Verify it's selected as a chip (in container)
		await expect(
			page.locator('.lda-multi-dropdown-container [data-testid="chip-remove-london-gb"]'),
		).toBeVisible();

		// Verify it's not in the filtered dropdown anymore
		await expect(page.locator(".lda-multi-dropdown-options >> text=London, GB")).not.toBeVisible();
	});
});
