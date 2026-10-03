export const sparkline = (
  values: readonly number[],
  progress: string,
  label: string,
) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const x = (index: number) => (index / (values.length - 1)) * 100;
  const y = (value: number) => 22 - ((value - min) / (max - min || 1)) * 20;
  const points = values
    .map((value, index) => `${x(index).toFixed(1)},${y(value).toFixed(1)}`)
    .join(" ");
  const last = `${x(values.length - 1)},${y(values.at(-1) ?? 0).toFixed(1)}`;

  return `<svg class="ui-sparkline" data-progress="${progress}" viewBox="0 0 100 24" preserveAspectRatio="none" role="img" aria-label="${label}">
  <polygon class="ui-sparkline-area" points="0,24 ${points} 100,24"/>
  <polyline class="ui-sparkline-line" points="${points}"/>
  <polyline class="ui-sparkline-dot" points="${last} ${last}"/>
</svg>`;
};
