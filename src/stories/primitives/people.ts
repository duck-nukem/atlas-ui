const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const avatar = (name: string, tone: number, size: string) =>
  `<span class="ui-avatar"${size === "default" ? "" : ` data-size="${size}"`}><span data-tone="${tone}">${initials(name)}</span></span>`;

export const peopleStack = (people: readonly string[], shown: number) => {
  const more = people.length - shown;

  return `<button class="ui-avatar-stack" type="button" aria-label="${people.join(", ")}">
  <span class="ui-avatar-group">
    ${people
      .slice(0, shown)
      .map((name, index) => avatar(name, index % 8, "sm"))
      .join(
        "",
      )}${more > 0 ? `<span class="ui-avatar-group-count">+${more}</span>` : ""}
  </span>
</button>`;
};
