import test from "node:test";
import assert from "node:assert/strict";
import {
  controlArgTypes,
  expectedParentOrigin,
  exportedStories,
  mapArgs,
  mergeParameters,
  prepareStory,
  safePatch,
  serializable,
} from "./model.mjs";

test("per-story parameters replace fixed-axis arrays but preserve nested docs and meta include", () => {
  const result = mergeParameters(
    {
      controls: { include: ["value", "size"], exclude: ["old"] },
      docs: { description: { component: "Body" } },
    },
    {
      controls: { exclude: ["size"] },
      docs: { description: { story: "Gallery" } },
    }
  );
  assert.deepEqual(result.controls, {
    include: ["value", "size"],
    exclude: ["size"],
  });
  assert.deepEqual(result.docs.description, {
    component: "Body",
    story: "Gallery",
  });
});
test("CSF composition merges defaults, argTypes and decorators without invoking play hooks", () => {
  const decorator = () => null;
  const play = () => {
    throw new Error("Must not run");
  };
  const prepared = prepareStory(
    {
      default: {
        title: "V2/Input",
        args: { value: "", size: "default" },
        argTypes: { size: { control: "select", options: ["default", "sm"] } },
        decorators: [decorator],
      },
      Overview: {},
      Error: {
        args: { value: "bad" },
        argTypes: { size: { options: ["sm"] } },
        play,
        beforeEach: play,
        decorators: [decorator],
      },
    },
    "Error",
    "input"
  );
  assert.deepEqual(prepared.initialArgs, { value: "bad", size: "default" });
  assert.deepEqual(prepared.argTypes.size, {
    control: "select",
    options: ["sm"],
  });
  assert.equal(prepared.decorators.length, 2);
  assert.equal(prepared.story.play, play);
});
test("CSF include/exclude metadata and Overview order are respected", () => {
  const entries = exportedStories({
    default: { excludeStories: /Helper/ },
    AllVariants: {},
    Helper: {},
    Overview: {},
    Default: {},
  });
  assert.deepEqual(
    entries.map((x) => x.id),
    ["Overview", "AllVariants", "Default"]
  );
});
test("Controls honor inclusion/exclusion, disable, actions and conditional visibility", () => {
  const prepared = {
    parameters: {
      controls: {
        include: [
          "value",
          "size",
          "disabled",
          "onChange",
          "hidden",
          "page",
          "total",
        ],
        exclude: ["size"],
      },
    },
    argTypes: {
      value: { control: "text" },
      size: { control: "select" },
      disabled: { control: false },
      hidden: { table: { disable: true } },
      total: { control: "number", if: { arg: "page", eq: 2 } },
    },
  };
  const args = {
    value: "text",
    size: "sm",
    disabled: false,
    onChange() {},
    hidden: true,
    page: 1,
    total: 100,
  };
  assert.deepEqual(Object.keys(controlArgTypes(prepared, args)), [
    "value",
    "page",
  ]);
  assert.deepEqual(
    Object.keys(controlArgTypes(prepared, { ...args, page: 2 })),
    ["value", "page", "total"]
  );
  assert.deepEqual(
    controlArgTypes(
      { ...prepared, parameters: { controls: { disable: true } } },
      args
    ),
    {}
  );
});
test("React mappings stay private and raw enum controls remain serializable", () => {
  const icon = {
    $$typeof: Symbol.for("react.transitional.element"),
    props: {},
  };
  const definitions = {
    leftIcon: { control: "boolean", mapping: { true: icon, false: undefined } },
  };
  assert.equal(mapArgs({ leftIcon: true }, definitions).leftIcon, icon);
  assert.equal(mapArgs({ leftIcon: false }, definitions).leftIcon, undefined);
  assert.deepEqual(serializable({ leftIcon: true, icon }), { leftIcon: true });
  assert.equal(
    "mapping" in
      controlArgTypes(
        { parameters: {}, argTypes: definitions },
        { leftIcon: true }
      ).leftIcon,
    false
  );
});
test("JSON metadata drops callbacks, JSX and circular references without losing repeated values", () => {
  const repeated = { label: "same" };
  const data = {
    first: repeated,
    second: repeated,
    callback() {},
    jsx: { $$typeof: Symbol.for("react.element") },
    date: new Date("2026-10-05T00:00:00Z"),
  };
  data.circular = data;
  assert.deepEqual(serializable(data), {
    first: repeated,
    second: repeated,
    date: "2026-10-05T00:00:00.000Z",
  });
});
test("parent control patches cannot replace callbacks or inject prototype keys", () => {
  assert.deepEqual(
    safePatch(
      JSON.parse(
        '{"value":"new","onChange":"replace","__proto__":{"polluted":true}}'
      ),
      new Set(["value"])
    ),
    { value: "new" }
  );
  assert.equal(safePatch([], new Set()), null);
  assert.equal({}.polluted, undefined);
});
test("parent origin is exact: dev6009 and same production origin only", () => {
  const dev = { origin: "http://localhost:6011", hostname: "localhost" };
  assert.equal(
    expectedParentOrigin(dev, "http://localhost:6009"),
    "http://localhost:6009"
  );
  assert.equal(expectedParentOrigin(dev, "https://evil.example"), dev.origin);
  const prod = { origin: "https://docs.example", hostname: "docs.example" };
  assert.equal(expectedParentOrigin(prod, prod.origin), prod.origin);
  assert.equal(
    expectedParentOrigin(prod, "http://localhost:6009"),
    prod.origin
  );
});
