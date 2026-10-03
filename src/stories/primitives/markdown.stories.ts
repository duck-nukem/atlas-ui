import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, type Story } from "../html";

type Args = {
  heading: string;
  task: string;
  goal: string;
  feature: string;
  person: string;
  page: string;
  quote: string;
  code: string;
};

const rendered = ({
  heading,
  task,
  goal,
  feature,
  person,
  page,
  quote,
  code,
}: Args) => `<div class="ui-markdown">
<h2>${heading}</h2>
<p>Ship the chat rework from <a href="#${task}" class="app-link" data-kind="task">${task}</a> under <a href="#${goal}" class="app-link" data-kind="goal">${goal}</a> and <a href="#${feature}" class="app-link" data-kind="feature">${feature}</a>. Ask <a href="#${person}" class="mention">@${person}</a> before merging, see <a href="#${page}" class="wiki-link">${page}</a>.</p>
<ul class="contains-task-list">
<li class="task-list-item"><input type="checkbox" checked disabled> Squash the migrations</li>
<li class="task-list-item"><input type="checkbox" disabled> Run <code>npm run check</code> on the whole tree</li>
<li>Link to <a href="#T-289" class="app-link" data-kind="task">T-289</a></li>
</ul>
<ol>
<li>Fetch</li>
<li>Rebase</li>
</ol>
<blockquote>
<p>${quote}</p>
</blockquote>
<table>
<thead>
<tr>
<th>Step</th>
<th>Owner</th>
</tr>
</thead>
<tbody>
<tr>
<td>Review</td>
<td>Grace</td>
</tr>
<tr>
<td>Deploy</td>
<td>Alan</td>
</tr>
</tbody>
</table>
<pre><code class="hljs language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> limit = <span class="hljs-title class_">Duration</span>.<span class="hljs-title function_">days</span>(<span class="hljs-number">7</span>); <span class="hljs-comment">// ${code}</span>
</code></pre>
<p><strong>Bold</strong>, <em>italic</em> and <del>gone</del>.</p>
</div>`;

const story = html(rendered, {
  docs: {
    description: {
      component:
        "Styles for Markdown the server renders to HTML. G-, F- and T- keys, mentions and wiki links come out as links with app-link, mention or wiki-link classes.",
    },
  },
});

export default {
  title: "Primitives/Markdown",
  ...story,
  parameters: {
    ...story.parameters,
    a11y: {
      config: {
        rules: [
          { id: "label", enabled: false },
          { id: "scrollable-region-focusable", enabled: false },
        ],
      },
    },
  },
  args: {
    heading: "Release checklist",
    task: "T-276",
    goal: "G-3",
    feature: "F-9",
    person: "alex",
    page: "Deploys",
    quote: "Never push without the self review.",
    code: "seven days",
  },
} satisfies Meta<Args>;

export const Rendered: Story<Args> = {};

export const LongCodeLine: Story<Args> = {
  args: { code: "seven days ".repeat(30) },
  play: async ({ canvas }) => {
    const block = canvas.getByRole("heading").closest(".ui-markdown")!;

    await expect(block.scrollWidth).toBeLessThanOrEqual(block.clientWidth);
  },
};
