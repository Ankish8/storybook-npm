/** Shared, framework-free CSF preparation and JSON boundary. */
export const CHANNEL = "myoperator-v2-docs";
const blockedKeys = new Set(["__proto__", "prototype", "constructor"]);
const plain = (value) =>
  value !== null &&
  typeof value === "object" &&
  (Object.getPrototypeOf(value) === Object.prototype ||
    Object.getPrototypeOf(value) === null);

/** @returns {Record<string, any>} */
export function mergeParameters(...values) {
  const result = {};
  for (const value of values) {
    if (!plain(value)) continue;
    for (const [key, next] of Object.entries(value)) {
      if (blockedKeys.has(key)) continue;
      result[key] = plain(next)
        ? mergeParameters(plain(result[key]) ? result[key] : {}, next)
        : next;
    }
  }
  return result;
}

export function matchesFilter(name, filter) {
  if (filter == null) return false;
  if (Array.isArray(filter)) return filter.includes(name);
  if (filter instanceof RegExp) {
    filter.lastIndex = 0;
    return filter.test(name);
  }
  return typeof filter === "string" && name === filter;
}

export function storyName(id) {
  return id
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}

export function exportedStories(module) {
  const meta = module.default || {};
  return Object.entries(module)
    .filter(
      ([id, value]) =>
        id !== "default" &&
        !id.startsWith("__") &&
        (plain(value) || typeof value === "function") &&
        (!meta.includeStories || matchesFilter(id, meta.includeStories)) &&
        !matchesFilter(id, meta.excludeStories)
    )
    .map(([id, story]) => ({
      id,
      name: story.name || story.storyName || storyName(id),
      story,
    }))
    .sort((a, b) =>
      a.id === "Overview"
        ? -1
        : b.id === "Overview"
          ? 1
          : a.name.localeCompare(b.name)
    );
}

export function prepareStory(module, id, component) {
  const meta = module.default || {};
  const entries = exportedStories(module);
  const entry = entries.find((item) => item.id === id);
  if (!entry) throw new Error(`Unknown story ${component}/${id}`);
  const story = entry.story;
  const parameters = mergeParameters(meta.parameters, story.parameters);
  const argTypes = mergeParameters(meta.argTypes, story.argTypes);
  const initialArgs = { ...(meta.args || {}), ...(story.args || {}) };
  return {
    component,
    id,
    title: meta.title || component,
    meta,
    story,
    entries,
    parameters,
    argTypes,
    initialArgs,
    decorators: [...(meta.decorators || []), ...(story.decorators || [])],
  };
}

export function mapArgs(args, argTypes) {
  const mapped = { ...args };
  for (const [key, definition] of Object.entries(argTypes)) {
    if (
      definition?.mapping &&
      Object.prototype.hasOwnProperty.call(
        definition.mapping,
        String(args[key])
      )
    )
      mapped[key] = definition.mapping[String(args[key])];
  }
  return mapped;
}

export function serializable(value, seen = new WeakSet()) {
  if (value === null || ["string", "boolean"].includes(typeof value))
    return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  if (
    value === undefined ||
    typeof value === "function" ||
    typeof value === "symbol" ||
    typeof value === "bigint"
  )
    return undefined;
  // JSX has a React symbol and can contain circular owner/fiber references.
  if (value && value.$$typeof) return undefined;
  if (seen.has(value)) return undefined;
  seen.add(value);
  let result;
  if (Array.isArray(value))
    result = value.map((entry) => serializable(entry, seen) ?? null);
  else if (plain(value)) {
    result = {};
    for (const [key, entry] of Object.entries(value)) {
      if (blockedKeys.has(key)) continue;
      const safe = serializable(entry, seen);
      if (safe !== undefined) result[key] = safe;
    }
  }
  seen.delete(value);
  return result;
}

export function controlArgTypes(prepared, args) {
  if (prepared.parameters.controls?.disable) return {};
  const controls = prepared.parameters.controls || {};
  const all = {
    ...Object.fromEntries(Object.keys(args).map((name) => [name, {}])),
    ...prepared.argTypes,
  };
  const result = {};
  for (const [name, definition] of Object.entries(all)) {
    if (controls.include && !matchesFilter(name, controls.include)) continue;
    if (
      matchesFilter(name, controls.exclude) ||
      definition?.control === false ||
      definition?.control?.disable ||
      definition?.table?.disable
    )
      continue;
    if (typeof args[name] === "function") continue;
    if (definition?.if) {
      const condition = definition.if;
      const actual = condition.arg ? args[condition.arg] : undefined;
      if ("truthy" in condition && Boolean(actual) !== condition.truthy)
        continue;
      if ("exists" in condition && (actual !== undefined) !== condition.exists)
        continue;
      if ("eq" in condition && actual !== condition.eq) continue;
      if ("neq" in condition && actual === condition.neq) continue;
    }
    const type =
      typeof definition?.control === "string"
        ? definition.control
        : definition?.control?.type ||
          (definition?.options
            ? "select"
            : typeof args[name] === "boolean"
              ? "boolean"
              : typeof args[name] === "number"
                ? "number"
                : typeof args[name] === "string"
                  ? "text"
                  : "object");
    if (
      serializable(args[name]) === undefined &&
      !definition?.mapping &&
      !definition?.control
    )
      continue;
    result[name] = serializable({
      ...definition,
      name: definition?.name || name,
      control: {
        ...(plain(definition?.control) ? definition.control : {}),
        type,
      },
      mapping: undefined,
    });
  }
  return result;
}

export function safePatch(patch, allowedKeys) {
  if (!plain(patch)) return null;
  const output = {};
  for (const [key, value] of Object.entries(patch)) {
    if (blockedKeys.has(key) || !allowedKeys.has(key)) continue;
    const safe = serializable(value);
    if (safe !== undefined) output[key] = safe;
  }
  return output;
}

export function expectedParentOrigin(location, requested) {
  const allowed = new Set([location.origin]);
  if (["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)) {
    allowed.add("http://localhost:6009");
    allowed.add("http://127.0.0.1:6009");
  }
  return requested && allowed.has(requested) ? requested : location.origin;
}
