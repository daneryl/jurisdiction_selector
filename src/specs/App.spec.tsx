import { describe, it, expect } from "vitest";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App, { Jurisdiction } from "../App";

const fetchJurisdictions = async (): Promise<Jurisdiction[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1));
  return [
    { id: 1, name: "Spain" },
    { id: 2, name: "United Kingdom" },
  ];
};

const fetchSubJurisdictions = async (id: number): Promise<Jurisdiction[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1));
  const subJurisdictions: {[k: number]: Jurisdiction[]} = {
    1: [{ id: 3, name: "Aragón" }],
    3: [{ id: 4, name: "Huesca" }],
  };
  if (subJurisdictions[id]) {
    return subJurisdictions[id];
  }
  throw new Error("Jurisdiction not found");
};

const renderApp = () => {
  render(
    <App
      useJurisdictionsAPI={() => {
        return { fetchJurisdictions, fetchSubJurisdictions };
      }}
    />
  );
};

describe("App", () => {
  it("should display a loading state", () => {
    renderApp();
    expect(screen.getByText("Loading ...")).toBeVisible();
  });

  it("should load jurisdictions display them and remove Loading state", async () => {
    renderApp();
    expect(screen.getByText("Loading ...")).toBeVisible();
    await waitFor(() => {
      expect(screen.getByText("Spain")).toBeVisible();
      expect(screen.getByText("United Kingdom")).toBeVisible();
    });
    expect(screen.queryByText("Loading ...")).toBeNull();
  });

  it("should load subjurisdictions when selecting one jurisdiction", async () => {
    renderApp();
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

  it("should load subjurisdictions when selecting one subjurisdiction", async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText("Spain")).toBeVisible();
    });
    fireEvent.click(screen.getByText("Spain"));
    await waitFor(
      () => {
        expect(screen.getByText("Aragón")).toBeVisible();
      },
      { timeout: 2000 }
    );
    fireEvent.click(screen.getByText("Aragón"));
    expect(screen.queryByText("Loading Aragón ...")).toBeVisible();
    await waitFor(
      () => {
        expect(screen.getByText("Aragón")).toBeVisible();
        expect(screen.getByText("Huesca")).toBeVisible();
      },
      { timeout: 2000 }
    );
    expect(screen.queryByText("Loading Aragón ...")).toBeNull();
  });
});
