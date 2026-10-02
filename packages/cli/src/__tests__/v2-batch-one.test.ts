import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { getRegistry } from "../utils/registry";

const names = ["badge", "tag", "input", "checkbox", "switch"];
describe.each(names)("v2-%s registry contract", (name) => {
  it("installs one unprefixed file at the correct depth", async () => {
    const component = (await getRegistry("tw-"))["v2-" + name];
    expect(component.unprefixed).toBe(true);
    expect(component.files).toHaveLength(1);
    expect(component.files[0].name).toBe("v2/" + name + ".tsx");
    expect(component.files[0].content).toContain('from "../../../lib/utils"');
    expect(component.files[0].content).not.toMatch(/(^|[\s"'\x60:])-?tw-/);
  });
  it("equals current source for every consumer prefix", async () => {
    const source = fs
      .readFileSync(
        fileURLToPath(
          new URL(
            "../../../../src/components/ui/v2/" + name + ".tsx",
            import.meta.url
          )
        ),
        "utf8"
      )
      .replace('"@/lib/utils"', '"../../../lib/utils"');
    for (const prefix of ["", "tw-", "app-"]) {
      expect((await getRegistry(prefix))["v2-" + name].files[0].content).toBe(
        source
      );
    }
  });
  it("retains class merging and icon dependencies when used", async () => {
    const component = (await getRegistry())["v2-" + name];
    expect(component.dependencies).toContain("tailwind-merge@^2.6.0");
    if (["tag", "input", "checkbox"].includes(name)) {
      expect(component.dependencies).toContain("lucide-react");
    }
  });
});
