import { test, expect } from "./fixtures";

test("full auth lifecycle: signup → signout → signin", async ({ page }) => {
  await page.goto("/");

  await test.step("sign up new account", async () => {
    await expect(page.getByText("Hello, Anonymous!")).toBeVisible();
    await page.getByText("Sign up instead").click();
    await page.getByPlaceholder("Email").fill("e2e@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Sign up" }).click();
    await expect(page.getByText("Hello! You are signed in.")).toBeVisible();
  });

  await test.step("sign out", async () => {
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page.getByText("Hello, Anonymous!")).toBeVisible();
  });

  await test.step("sign in with same credentials", async () => {
    await page.getByPlaceholder("Email").fill("e2e@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Hello! You are signed in.")).toBeVisible();
  });
});
