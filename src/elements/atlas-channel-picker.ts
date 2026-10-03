import { icons } from "./icons";
import { Popover } from "./popover";

let count = 0;

export class AtlasChannelPicker extends HTMLElement {
  #popover: Popover | undefined;

  connectedCallback(): void {
    const list = this.querySelector<HTMLElement>(".ui-channel-list");

    if (list === null || this.#popover !== undefined) {
      return;
    }

    const id = `atlas-channel-picker-${String((count += 1))}`;
    const search =
      this.getAttribute("text-search") ?? "Find a channel or person";
    const trigger = document.createElement("button");
    const label = document.createElement("span");
    const input = document.createElement("input");
    const none = document.createElement("p");
    const panel = document.createElement("div");

    label.textContent = this.getAttribute("label") ?? "";
    trigger.type = "button";
    trigger.className = "ui-channel-trigger";
    trigger.dataset["testid"] = "channel-picker";
    trigger.dataset["attention"] = String(this.hasAttribute("attention"));
    trigger.setAttribute("popovertarget", id);
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    trigger.append(label);
    trigger.insertAdjacentHTML("beforeend", icons.chevronsUpDown);

    if (this.hasAttribute("attention")) {
      const dot = document.createElement("span");

      dot.className = "ui-dot";
      dot.setAttribute("role", "img");
      dot.setAttribute(
        "aria-label",
        this.getAttribute("text-attention") ?? "Messages for you",
      );
      trigger.append(dot);
    }

    input.className = "ui-input";
    input.placeholder = search;
    input.setAttribute("aria-label", search);
    input.dataset["testid"] = "channel-search";
    none.dataset["testid"] = "no-channel-match";
    none.hidden = true;
    none.textContent = this.getAttribute("text-none") ?? "Nothing matches";
    list.append(none);
    panel.id = id;
    panel.popover = "auto";
    panel.className = "ui-channel-popover";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", search);
    panel.append(input, ...this.childNodes);
    this.replaceChildren(trigger, panel);

    this.#popover = new Popover(panel, trigger, {
      changing: (open) => {
        trigger.setAttribute("aria-expanded", String(open));

        if (open) {
          input.value = "";
          this.#filter(list, none, "");
        }
      },
      shown: () => input.focus(),
    });
    input.addEventListener("input", () =>
      this.#filter(list, none, input.value),
    );
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.isComposing) {
        event.preventDefault();
        list.querySelector<HTMLAnchorElement>("li:not([hidden]) > a")?.click();
      }
    });
    panel.addEventListener("click", (event) => {
      if (
        event.target instanceof Element &&
        event.target.closest("a") !== null
      ) {
        this.#popover?.hide();
      }
    });
  }

  #filter(list: HTMLElement, none: HTMLElement, query: string): void {
    const needle = query.trim().toLowerCase();
    const sections = [
      ...list.querySelectorAll<HTMLElement>(":scope > ul > li"),
    ];

    sections.forEach((section) => {
      const entries = [...section.querySelectorAll<HTMLElement>("ul > li")];

      entries.forEach((entry) => {
        entry.hidden = !(entry.querySelector("a span")?.textContent ?? "")
          .toLowerCase()
          .includes(needle);
      });
      section.hidden = entries.every((entry) => entry.hidden);
    });
    none.hidden = sections.some((section) => !section.hidden);
  }
}
