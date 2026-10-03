import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SearchableSelect } from "../../react/select/searchable-select";
import { ServerSearchSelect } from "../../react/select/server-search-select";

const features = [
  { value: "f1", label: "F-1 todo.md", hint: "Done" },
  { value: "f2", label: "F-2 Chat", hint: "In progress" },
  { value: "f3", label: "F-3 Health dashboard", hint: "Ready" },
  { value: "f4", label: "F-4 Releases" },
];

const people = [
  { value: "u1", label: "Ada Lovelace", hint: "@ada" },
  { value: "u2", label: "Grace Hopper", hint: "@grace" },
  { value: "u3", label: "Alan Turing", hint: "@alan" },
];

const field = (label: string, control: React.ReactNode) => (
  <div className="ui-field" style={{ maxInlineSize: "20rem" }}>
    <span className="ui-label" id="select-label">
      {label}
    </span>
    {control}
  </div>
);

const meta = {
  title: "React/Searchable select",
  component: SearchableSelect,
  args: { name: "featureId", options: features, "aria-label": "Feature" },
  render: (args) => field("Feature", <SearchableSelect {...args} />),
} satisfies Meta<typeof SearchableSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const Chosen: Story = { args: { defaultValue: "f2" } };

export const Clearable: Story = {
  args: { defaultValue: "f2", clearable: true },
};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["f1", "f3"] },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Feature" }));
    await userEvent.click(canvas.getByRole("option", { name: /F-2 Chat/ }));

    await expect(canvas.getByRole("listbox")).toBeVisible();
  },
};

export const Invalid: Story = { args: { invalid: true } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "f1" } };

export const ServerSearch: Story = {
  render: () =>
    field(
      "Reviewer",
      <ServerSearchSelect
        name="reviewerId"
        aria-label="Reviewer"
        chosen={[]}
        searchOptions={async (text) => {
          await new Promise((resolve) => setTimeout(resolve, 400));

          return people
            .filter((person) =>
              person.label.toLowerCase().includes(text.toLowerCase()),
            )
            .slice(0, 5);
        }}
      />,
    ),
};

export const Mobile: Story = {
  ...Multiple,
  globals: { viewport: { value: "mobile", isRotated: false } },
};
