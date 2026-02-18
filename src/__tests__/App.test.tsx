import { screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, afterEach } from "vitest";
import { renderWithConvexAuth } from "convex-test-provider";
import { convexTest } from "convex-test";

import schema from "../../convex/schema";
import { modules } from "../../convex/test.setup";
import App from "../App";

afterEach(() => cleanup());

function renderApp(options?: { authenticated?: boolean; signInError?: Error }) {
  const t = convexTest(schema, modules);
  return renderWithConvexAuth(<App />, t, {
    authenticated: options?.authenticated ?? true,
    signInError: options?.signInError,
  });
}

describe("App", () => {
  test("authenticated user sees greeting and sign-out button", async () => {
    renderApp({ authenticated: true });

    expect(
      await screen.findByText("Hello! You are signed in."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign out/i }),
    ).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Email")).not.toBeInTheDocument();
  });

  test("unauthenticated user sees greeting and sign-in form", async () => {
    renderApp({ authenticated: false });

    expect(
      await screen.findByText("Hello, Anonymous!"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /sign out/i }),
    ).not.toBeInTheDocument();
  });

  test("sign-in form toggles between sign-in and sign-up", async () => {
    const user = userEvent.setup();
    renderApp({ authenticated: false });

    // Default: sign-in mode
    expect(await screen.findByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign up instead")).toBeInTheDocument();

    // Toggle to sign-up
    await user.click(screen.getByText("Sign up instead"));
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign in instead")).toBeInTheDocument();

    // Toggle back to sign-in
    await user.click(screen.getByText("Sign in instead"));
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Sign up instead")).toBeInTheDocument();
  });

  test("sign-out button toggles to unauthenticated view", async () => {
    const user = userEvent.setup();
    renderApp({ authenticated: true });

    expect(
      await screen.findByText("Hello! You are signed in."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    expect(
      await screen.findByText("Hello, Anonymous!"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  test("form submission toggles to authenticated view", async () => {
    const user = userEvent.setup();
    renderApp({ authenticated: false });

    // Credentials are arbitrary — the mock signIn() unconditionally succeeds.
    // Backend credential validation is tested separately in convex/ tests.
    await screen.findByPlaceholderText("Email");
    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByText("Sign in"));

    expect(
      await screen.findByText("Hello! You are signed in."),
    ).toBeInTheDocument();
  });

  test("error display on sign-in failure", async () => {
    const user = userEvent.setup();
    renderApp({
      authenticated: false,
      signInError: new Error("Invalid credentials"),
    });

    await screen.findByPlaceholderText("Email");
    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrong");
    await user.click(screen.getByText("Sign in"));

    await waitFor(() => {
      expect(
        screen.getByText(/Error signing in: Invalid credentials/),
      ).toBeInTheDocument();
    });
  });
});
