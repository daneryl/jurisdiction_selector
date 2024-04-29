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
  const subJurisdictions: { [k: number]: Jurisdiction[] } = {
    1: [{ id: 3, name: "Aragón" }],
    3: [{ id: 4, name: "Huesca" }],
  };
  if (subJurisdictions[id]) {
    return subJurisdictions[id];
  }
  throw new Error("Jurisdiction not found");
};

const renderApp = (onChange: (data: Jurisdiction[]) => void = () => { }) => {
  render(
    <App
      useJurisdictionsAPI={() => {
        return { fetchJurisdictions, fetchSubJurisdictions };
      }}
      onChange={onChange}
    />
  );
};

describe("App", () => {
  it("should display a loading state", () => {
    renderApp();
    expect(screen.getByText("Loading ...")).toBeVisible();
  });

  it("should load jurisdictions, display them and remove loading state", async () => {
    renderApp();
    expect(screen.getByText("Loading ...")).toBeVisible();
    await waitFor(() => {
      expect(screen.getByText("Spain")).toBeVisible();
      expect(screen.getByText("United Kingdom")).toBeVisible();
    });
    expect(screen.queryByText("Loading ...")).toBeNull();
  });

  describe("when checking a jurisdiction", () => {
    it("should load its subjurisdictions", async () => {
      let dataSelected: Jurisdiction[] = [];
      renderApp((data) => {
        dataSelected = data;
      });
      await waitFor(() => expect(screen.getByText("Spain")).toBeVisible());
      fireEvent.click(screen.getByText("Spain"));
      expect(screen.getByText("Loading Spain ...")).toBeVisible();
      expect(screen.queryByText("Loading United Kingdom ...")).toBeNull();

      await waitFor(() => expect(screen.getByText("Aragón")).toBeVisible(), {
        timeout: 2000,
      });
      expect(screen.queryByText("Loading Spain ...")).toBeNull();
      expect(dataSelected).toEqual([{ id: 1, name: "Spain" }]);
    });

    it("should load its subjurisdictions only once", async () => {
      renderApp();
      await waitFor(() => expect(screen.getByText("Spain")).toBeVisible());
      fireEvent.click(screen.getByText("Spain"));
      expect(screen.getByText("Loading Spain ...")).toBeVisible();
      expect(screen.queryByText("Loading United Kingdom ...")).toBeNull();

      await waitFor(() => expect(screen.getByText("Aragón")).toBeVisible(), {
        timeout: 2000,
      });
      fireEvent.click(screen.getByText("Spain"));
      expect(screen.queryByText("Loading Spain ...")).toBeNull();
    });
  });

  describe("when checking a subjurisdiction", () => {
    it("should load its subjurisdictions", async () => {
      let dataSelected: Jurisdiction[] = [];
      renderApp((data) => {
        dataSelected = data;
      });
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
      expect(dataSelected).toEqual([
        { id: 1, name: "Spain" },
        { id: 3, name: "Aragón" },
      ]);
    });
  });

  it("should properly track the values selected", async () => {
    let dataSelected: Jurisdiction[] = [];
    renderApp((data) => {
      dataSelected = data;
    });
    await waitFor(() => expect(screen.getByText("Spain")).toBeVisible());
    fireEvent.click(screen.getByText("Spain"));
    await waitFor(() => expect(screen.getByText("Aragón")).toBeVisible(), {
      timeout: 2000,
    });
    fireEvent.click(screen.getByText("Aragón"));
    expect(screen.queryByText("Loading Aragón ...")).toBeVisible();
    await waitFor(
      () => expect(screen.queryByText("Loading Aragón ...")).toBeNull(),
      { timeout: 2000 }
    );
    expect(screen.queryByText("Loading Aragón ...")).toBeNull();
    expect(dataSelected).toEqual([
      { id: 1, name: "Spain" },
      { id: 3, name: "Aragón" },
    ]);

    fireEvent.click(screen.getByText("Spain"));

    expect(dataSelected).toEqual([{ id: 3, name: "Aragón" }]);
  });
});
