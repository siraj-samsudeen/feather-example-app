import { cleanup } from "@testing-library/react";
import { afterEach, describe, test } from "vitest";
import { renderWithSession } from "feather-testing-convex/rtl";
import { convexTest } from "convex-test";

import schema from "../../convex/schema";
import { modules } from "../../convex/test.setup";
import App from "../App";

afterEach(() => cleanup());

function renderApp(options?: { authenticated?: boolean; signInError?: Error }) {
  const t = convexTest(schema, modules);
  return renderWithSession(<App />, t, {
    authenticated: options?.authenticated ?? true,
    signInError: options?.signInError,
  });
}

describe("App", () => {
  test("authenticated user sees greeting and sign-out button", async () => {
    const session = renderApp({ authenticated: true });

    await session
      .assertText("Hello! You are signed in.")
      .assertText("Sign out")
      .refuteText("Email");
  });

  test("unauthenticated user sees greeting and sign-in form", async () => {
    const session = renderApp({ authenticated: false });

    await session
      .assertText("Hello, Anonymous!")
      .assertText("Sign in")
      .refuteText("Sign out");
  });

  test("sign-in form toggles between sign-in and sign-up", async () => {
    const session = renderApp({ authenticated: false });

    await session
      .assertText("Sign in")
      .assertText("Don't have an account?")
      .assertText("Sign up instead");

    await session
      .click("Sign up instead")
      .assertText("Sign up")
      .assertText("Already have an account?")
      .assertText("Sign in instead");

    await session
      .click("Sign in instead")
      .assertText("Sign in")
      .assertText("Sign up instead");
  });

  test("sign-out button toggles to unauthenticated view", async () => {
    const session = renderApp({ authenticated: true });

    await session
      .assertText("Hello! You are signed in.")
      .clickButton("Sign out")
      .assertText("Hello, Anonymous!");
  });

  test("form submission toggles to authenticated view", async () => {
    const session = renderApp({ authenticated: false });

    // Credentials are arbitrary — the mock signIn() unconditionally succeeds.
    // Backend credential validation is tested separately in convex/ tests.
    await session
      .fillIn("Email", "test@example.com")
      .fillIn("Password", "password123")
      .click("Sign in")
      .assertText("Hello! You are signed in.");
  });

  test("error display on sign-in failure", async () => {
    const session = renderApp({
      authenticated: false,
      signInError: new Error("Invalid credentials"),
    });

    await session
      .fillIn("Email", "test@example.com")
      .fillIn("Password", "wrong")
      .click("Sign in")
      .assertText("Error signing in: Invalid credentials");
  });
});
