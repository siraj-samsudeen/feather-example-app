import { test } from "./fixtures";

test("full auth lifecycle: signup → signout → signin", async ({ session }) => {
  // Sign up
  await session
    .visit("/")
    .assertText("Hello, Anonymous!")
    .click("Sign up instead")
    .fillIn("Email", "e2e@example.com")
    .fillIn("Password", "password123")
    .clickButton("Sign up")
    .assertText("Hello! You are signed in.");

  // Sign out
  await session
    .clickButton("Sign out")
    .assertText("Hello, Anonymous!");

  // Sign in
  await session
    .fillIn("Email", "e2e@example.com")
    .fillIn("Password", "password123")
    .clickButton("Sign in")
    .assertText("Hello! You are signed in.");
});
