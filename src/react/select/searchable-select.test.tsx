import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { userEvent as browser } from "vitest/browser";
import { SearchableSelect } from "./searchable-select";

const options = [
  { value: "f1", label: "F-1 todo.md" },
  { value: "f2", label: "F-2 Chat" },
];

describe("SearchableSelect", () => {
  it("filters options by the typed query", async () => {
    render(
      <SearchableSelect
        name="featureId"
        options={options}
        aria-label="Feature"
      />,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Feature" }));

    await userEvent.type(screen.getByTestId("select-search"), "chat");

    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
      "F-2 Chat",
    ]);
  });

  it("describes an invalid select by the error of its field", () => {
    render(
      <SearchableSelect
        id="featureId"
        name="featureId"
        options={options}
        aria-label="Feature"
        invalid
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Feature" });

    expect(trigger).toHaveAttribute("aria-describedby", "featureId-error");
  });

  it("stores the chosen value in a hidden input", async () => {
    const { container } = render(
      <SearchableSelect
        name="featureId"
        options={options}
        aria-label="Feature"
      />,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Feature" }));

    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    expect(container.querySelector("input[name=featureId]")).toHaveValue("f2");
  });

  it("keeps several values when multiple", async () => {
    const { container } = render(
      <SearchableSelect
        name="ids"
        options={options}
        multiple
        defaultValue={["f1"]}
        aria-label="Ids"
      />,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Ids" }));

    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    expect(
      [...container.querySelectorAll("input[name=ids]")].map((i) =>
        i.getAttribute("value"),
      ),
    ).toEqual(["f1", "f2"]);
  });

  it("selects the highlighted option with Enter", async () => {
    const { container } = render(
      <SearchableSelect
        name="featureId"
        options={options}
        aria-label="Feature"
      />,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Feature" }));

    fireEvent.keyDown(screen.getByTestId("select-search"), {
      key: "ArrowDown",
    });
    fireEvent.keyDown(screen.getByTestId("select-search"), { key: "Enter" });

    expect(container.querySelector("input[name=featureId]")).toHaveValue("f2");
  });

  it("closes a multiple choice list when done is pressed", async () => {
    render(
      <SearchableSelect
        name="ids"
        options={options}
        multiple
        aria-label="Ids"
      />,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Ids" }));
    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    await userEvent.click(screen.getByTestId("select-done"));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("auto selects the only value", () => {
    const singleOption = [{ value: "f1", label: "F-1 todo.md" }];
    const { container } = render(
      <SearchableSelect
        name="featureId"
        options={singleOption}
        aria-label="Feature"
      />,
    );

    expect(container.querySelector("input[name=featureId]")).toHaveValue("f1");
  });
});

describe("SearchableSelect choices", () => {
  it("clears a clearable choice", async () => {
    render(
      <SearchableSelect
        name="featureId"
        options={options}
        defaultValue="f1"
        clearable
        data-testid="select"
      />,
    );
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.click(screen.getByTestId("option-none"));

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "");
  });

  it("hides the none choice while searching", async () => {
    render(
      <SearchableSelect
        name="featureId"
        options={options}
        clearable
        data-testid="select"
      />,
    );
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.type(screen.getByTestId("select-search"), "chat");

    expect(screen.queryByTestId("option-none")).toBeNull();
  });

  it("says so when nothing matches the query", async () => {
    render(
      <SearchableSelect
        name="featureId"
        options={options}
        data-testid="select"
      />,
    );
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.type(screen.getByTestId("select-search"), "zzz");

    expect(screen.getByTestId("select-note")).toHaveAttribute(
      "data-note",
      "noMatches",
    );
  });

  it("chooses nothing on Enter when nothing matches", async () => {
    render(
      <SearchableSelect
        name="featureId"
        options={options}
        data-testid="select"
      />,
    );
    await userEvent.click(screen.getByTestId("select"));
    await userEvent.type(screen.getByTestId("select-search"), "zzz");

    fireEvent.keyDown(screen.getByTestId("select-search"), { key: "Enter" });

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "");
  });

  it("moves up to the last option from the first", async () => {
    render(
      <SearchableSelect
        name="featureId"
        options={options}
        data-testid="select"
      />,
    );
    await userEvent.click(screen.getByTestId("select"));

    fireEvent.keyDown(screen.getByTestId("select-search"), { key: "ArrowUp" });
    fireEvent.keyDown(screen.getByTestId("select-search"), { key: "Enter" });

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "f2");
  });

  it("closes the list on Escape", async () => {
    render(
      <SearchableSelect
        name="featureId"
        options={options}
        data-testid="select"
      />,
    );
    await userEvent.click(screen.getByTestId("select"));

    await browser.keyboard("{Escape}");

    expect(screen.getByTestId("select")).toHaveAttribute("data-open", "false");
  });
});

describe("SearchableSelect by keyboard", () => {
  it("reaches the none choice above the first option", async () => {
    render(
      <SearchableSelect
        name="featureId"
        options={options}
        defaultValue="f1"
        clearable
        data-testid="select"
      />,
    );
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.keyboard("{ArrowUp}{Enter}");

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "");
  });

  it("tells assistive technology which option is active", async () => {
    render(
      <SearchableSelect
        name="featureId"
        options={options}
        data-testid="select"
      />,
    );
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.keyboard("{ArrowDown}");

    expect(
      screen.getByTestId("select-search").getAttribute("aria-activedescendant"),
    ).toBe(screen.getByTestId("option-f2").id);
  });
});

describe("SearchableSelect after a search", () => {
  it("picks the first option again when reopened, not the none choice", async () => {
    render(
      <SearchableSelect
        name="featureId"
        options={options}
        clearable
        data-testid="select"
      />,
    );
    await userEvent.click(screen.getByTestId("select"));
    await userEvent.keyboard("Chat{Enter}");
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.keyboard("{Enter}");

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "f1");
  });
});

describe("SearchableSelect after hovering", () => {
  it("starts at the first option again when reopened", async () => {
    render(
      <SearchableSelect
        name="featureId"
        options={options}
        data-testid="select"
      />,
    );
    await userEvent.click(screen.getByTestId("select"));
    await userEvent.hover(screen.getByTestId("option-f2"));
    await browser.keyboard("{Escape}");
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.keyboard("{Enter}");

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "f1");
  });
});

function savingForm(submits: string[][], multiple: boolean): ReactElement {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submits.push(
          new FormData(event.currentTarget).getAll("ids").map(String),
        );
      }}
    >
      <SearchableSelect
        name="ids"
        options={options}
        multiple={multiple}
        submitOnChange
        aria-label="Ids"
      />
    </form>
  );
}

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });

describe("SearchableSelect saving on change", () => {
  it("does not save a multiple choice while picking", async () => {
    const submits: string[][] = [];
    render(savingForm(submits, true));
    await userEvent.click(screen.getByRole("combobox", { name: "Ids" }));

    await userEvent.click(screen.getByRole("option", { name: "F-1 todo.md" }));
    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));
    await nextFrame();

    expect(submits).toEqual([]);
  });

  it("saves a multiple choice once when the list closes", async () => {
    const submits: string[][] = [];
    render(savingForm(submits, true));
    await userEvent.click(screen.getByRole("combobox", { name: "Ids" }));
    await userEvent.click(screen.getByRole("option", { name: "F-1 todo.md" }));
    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    await browser.keyboard("{Escape}");

    await waitFor(() => {
      expect(submits).toEqual([["f1", "f2"]]);
    });
  });

  it("saves a single choice right away", async () => {
    const submits: string[][] = [];
    render(savingForm(submits, false));
    await userEvent.click(screen.getByRole("combobox", { name: "Ids" }));

    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    await waitFor(() => {
      expect(submits).toEqual([["f2"]]);
    });
  });
});
