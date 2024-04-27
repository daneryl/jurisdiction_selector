import { describe, it, expect } from "vitest";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("should display a loading state", () => {
    render(<App />);
    expect(screen.getByText("Loading ...")).toBeVisible();
  });

  it("should load jurisdictions display them and remove Loading state", async () => {
    render(<App />);
    expect(screen.getByText("Loading ...")).toBeVisible();
    await waitFor(() => {
      expect(screen.getByText("Spain")).toBeVisible();
      expect(screen.getByText("United Kingdom")).toBeVisible();
    });
    expect(screen.queryByText("Loading ...")).toBeNull();
  });

  it("should load subjurisdictions when selecting one jurisdiction", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("Spain")).toBeVisible();
    });
    fireEvent.click(screen.getByText("Spain"));
    expect(screen.getByText("Loading Spain ...")).toBeVisible();
    expect(screen.queryByText("Loading United Kingdom ...")).toBeNull();

    await waitFor(
      () => {
        expect(screen.getByText("Aragón")).toBeVisible();
      },
      { timeout: 2000 }
    );
    expect(screen.queryByText("Loading Spain ...")).toBeNull();
  });
});
