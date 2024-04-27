import { describe, it, expect } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("should display a loading state", () => {
    render(<App />);
    expect(screen.getByText("Loading ...")).toBeVisible();
  });

  it("should load jurisdictions and display them as checkboxes", async () => {
    render(<App />);
    expect(screen.getByText("Loading ...")).toBeVisible();
    await waitFor(() => {
      expect(screen.getByText("SPAIN")).toBeVisible();
    });
    expect(screen.getByText("Loading ...")).toBeNull();
  });
});
