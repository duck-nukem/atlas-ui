import { AtlasChannelPicker } from "./atlas-channel-picker";
import { AtlasGantt } from "./atlas-gantt";
import { AtlasSelect } from "./atlas-select";

export { AtlasChannelPicker, AtlasGantt, AtlasSelect };
export { GanttStatus } from "./atlas-gantt";
export { SEARCH_PAUSE_MS, type SearchOptions } from "./atlas-select";
export { type SelectOption } from "./select-model";

if (customElements.get("atlas-select") === undefined) {
  customElements.define("atlas-select", AtlasSelect);
}

if (customElements.get("atlas-channel-picker") === undefined) {
  customElements.define("atlas-channel-picker", AtlasChannelPicker);
}

if (customElements.get("atlas-gantt") === undefined) {
  customElements.define("atlas-gantt", AtlasGantt);
}
