import { icons } from "./icons";
import { Popover } from "./popover";

const texts = {
  search: "Find a channel or person",
  none: "Nothing matches",
  attention: "Messages for you",
};

type Text = keyof typeof texts;

let count = 0;

export class AtlasChannelPicker extends HTMLElement {
  static readonly observedAttributes = [
    "label",
    "attention",
    ...Object.keys(texts).map((name) => `text-${name}`),
  ];

  #trigger = document.createElement("button");
  #panel = document.createElement("div");
  #input = document.createElement("input");
  #none = document.createElement("p");
  #popover: Popover | undefined;
  #host = new MutationObserver(() => this.#sync());

  connectedCallback(): void {
    this.#host.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["popover", "id", "class", "role"],
    });
    this.#sync();
  }

  disconnectedCallback(): void {
    this.#host.disconnect();
  }

  attributeChangedCallback(): void {
    if (this.contains(this.#trigger)) {
      this.#label();
    }
  }

  #text(name: Text): string {
    return this.getAttribute(`text-${name}`) ?? texts[name];
  }

  #sync(): void {
    const built =
      this.children.length === 2 &&
      this.children[0] === this.#trigger &&
      this.children[1] === this.#panel &&
      this.#trigger.getAttribute("popovertarget") === this.#panel.id &&
      this.#panel.getAttribute("popover") === "auto" &&
      this.#panel.contains(this.#input) &&
      this.#panel.contains(this.#none);

    if (built) {
      this.#filter(this.#input.value);
    } else if (this.querySelector("a") !== null) {
      this.#build();
    }

    this.#host.takeRecords();
  }

  #build(): void {
    const stalePanel = this.querySelector(":scope > .ui-channel-popover");

    stalePanel?.querySelector(":scope > input")?.remove();
    stalePanel?.querySelector("[data-testid=no-channel-match]")?.remove();
    stalePanel?.replaceWith(...stalePanel.childNodes);
    this.querySelectorAll(":scope > .ui-channel-trigger").forEach((stale) =>
      stale.remove(),
    );

    const id = `atlas-channel-picker-${String((count += 1))}`;

    this.#trigger = document.createElement("button");
    this.#trigger.type = "button";
    this.#trigger.className = "ui-channel-trigger";
    this.#trigger.dataset["testid"] = "channel-picker";
    this.#trigger.setAttribute("popovertarget", id);
    this.#trigger.setAttribute("aria-haspopup", "dialog");
    this.#trigger.setAttribute("aria-expanded", "false");
    this.#input = document.createElement("input");
    this.#input.className = "ui-input";
    this.#input.dataset["testid"] = "channel-search";
    this.#none = document.createElement("p");
    this.#none.dataset["testid"] = "no-channel-match";
    this.#none.hidden = true;
    this.#panel = document.createElement("div");
    this.#panel.id = id;
    this.#panel.popover = "auto";
    this.#panel.className = "ui-channel-popover";
    this.#panel.setAttribute("role", "dialog");
    this.#panel.append(this.#input, ...this.childNodes);
    (this.#panel.querySelector(".ui-channel-list") ?? this.#panel).append(
      this.#none,
    );
    this.replaceChildren(this.#trigger, this.#panel);
    this.#label();
    this.#popover = new Popover(this.#panel, this.#trigger, {
      changing: (open) => {
        this.#trigger.setAttribute("aria-expanded", String(open));

        if (open) {
          this.#input.value = "";
          this.#filter("");
        }
      },
      shown: () => this.#input.focus(),
    });
    this.#input.addEventListener("input", () =>
      this.#filter(this.#input.value),
    );
    this.#input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.isComposing) {
        event.preventDefault();
        this.#links()
          .find((link) => !this.#hidden(link))
          ?.click();
      }
    });
    this.#panel.addEventListener("click", (event) => {
      if (
        event.target instanceof Element &&
        event.target.closest("a") !== null
      ) {
        this.#popover?.hide();
      }
    });
  }

  #label(): void {
    const label = document.createElement("span");

    label.textContent = this.getAttribute("label") ?? "";
    this.#trigger.replaceChildren(label);
    this.#trigger.insertAdjacentHTML("beforeend", icons.chevronsUpDown);
    this.#trigger.dataset["attention"] = String(this.hasAttribute("attention"));

    if (this.hasAttribute("attention")) {
      const dot = document.createElement("span");

      dot.className = "ui-dot";
      dot.setAttribute("role", "img");
      dot.setAttribute("aria-label", this.#text("attention"));
      this.#trigger.append(dot);
    }

    this.#input.placeholder = this.#text("search");
    this.#input.setAttribute("aria-label", this.#text("search"));
    this.#panel.setAttribute("aria-label", this.#text("search"));
    this.#none.textContent = this.#text("none");
  }

  #links(): HTMLAnchorElement[] {
    return [...this.#panel.querySelectorAll<HTMLAnchorElement>("li a")];
  }

  #hidden(link: HTMLAnchorElement): boolean {
    return link.closest<HTMLElement>("li")?.hidden === true;
  }

  #filter(query: string): void {
    const needle = query.trim().toLowerCase();
    const links = this.#links();

    links.forEach((link) => {
      const item = link.closest<HTMLElement>("li");

      if (item !== null) {
        item.hidden = !(link.textContent ?? "").toLowerCase().includes(needle);
      }
    });
    this.#panel
      .querySelectorAll<HTMLElement>("li:has(li a)")
      .forEach((section) => {
        section.hidden = [
          ...section.querySelectorAll<HTMLElement>("li:has(> a)"),
        ].every((item) => item.hidden);
      });
    this.#none.hidden = links.some((link) => !this.#hidden(link));
  }
}
