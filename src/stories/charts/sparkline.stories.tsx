import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";
import { sparkline } from "./sparkline";

const rising = [3, 4, 3, 5, 6, 5, 7, 8, 7, 9, 10, 12];
const falling = [12, 11, 12, 9, 10, 8, 7, 7, 6, 5, 6, 4];

const set = `
<div class="ui-stack" style="max-inline-size:16rem">
  ${sparkline(rising, "improved", "Deploys per week rose from 3 to 12 over 12 weeks")}
  ${sparkline(falling, "worsened", "Deploys per week fell from 12 to 4 over 12 weeks")}
  ${sparkline([5, 5, 6, 5, 5, 6, 5, 5, 6, 5, 5, 5], "unchanged", "Deploys per week stayed near 5 over 12 weeks")}
</div>`;

export default {
  title: "Charts/Trend line",
  parameters: {
    docs: {
      description: {
        component:
          "The server writes the points into a 100 by 24 viewBox. The stroke keeps its width at any size, and the label states the trend in words.",
      },
    },
  },
} satisfies Meta;

export const Progress = html(set);

export const Tall = html(
  `<div style="--ui-sparkline-height:5rem;max-inline-size:32rem">${sparkline(rising, "improved", "Deploys per week rose from 3 to 12 over 12 weeks")}</div>`,
);

export const Mobile = mobile(set);
