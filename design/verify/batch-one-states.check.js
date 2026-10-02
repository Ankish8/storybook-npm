/**
 * Read-only computed-style checks for A1, using the recorded spec and web-panel diffs.
 * Open each component's States iframe (Badge/Tag: Variants and sizes), then evaluate
 * this expression. Static components check every variant × size; interactive ones
 * check every selection × size × Default/Hover/Focus/Disabled/Disabled+hover.
 * Thin CSS borders are rasterized to a device pixel by Chrome; source tests also
 * assert the authored 0.4px width.
 */
(() => {
  const nodes = Array.from(document.querySelectorAll("[data-v2-component]"));
  const component = nodes[0]?.getAttribute("data-v2-component");
  const counts = { badge: 30, tag: 27, input: 10, checkbox: 45, switch: 30 };
  const failures = [];
  let checks = 0;
  const check = (key, actual, expected) => {
    checks++;
    if (actual !== expected) failures.push({ key, actual, expected });
  };
  const rgb = (hex) => {
    const h = hex.replace("#", "");
    return (
      "rgb(" +
      [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16)).join(", ") +
      ")"
    );
  };
  const zeroShadow = (value) =>
    value === "none" ||
    value.split(", rgba").every((v) => v.includes("0px 0px 0px 0px"));
  const palettes = {
    badge: {
      default: ["F5F5F5", "E9EAEB", "181D27"],
      primary: ["F5F5F5", "E9EAEB", "181D27"],
      outline: ["FFFFFF", "E9EAEB", "181D27"],
      disabled: ["F5F5F5", null, "717680"],
      information: ["ECF1FB", "000000", "2F5398"],
      active: ["ECFDF3", "ABEFC6", "067647"],
      failed: ["FEF3F2", "FECDCA", "B42318"],
      warning: ["FFFAEB", "FEDF89", "B54708"],
      destructive: ["FEF3F2", "FECDCA", "B42318"],
      secondary: ["EAF8FA", "27ABB8", "181D27"],
    },
    tag: {
      default: ["F5F5F5", "E9EAEB", "181D27"],
      primary: ["F5F5F5", "E9EAEB", "181D27"],
      secondary: ["F5F5F5", "E9EAEB", "181D27"],
      accent: ["EAF8FA", "27ABB8", "181D27"],
      info: ["ECF1FB", "A8C0EC", "2F5398"],
      success: ["ECFDF3", "ABEFC6", "067647"],
      warning: ["FFFAEB", "FEDF89", "B54708"],
      error: ["FEF3F2", "FECDCA", "B42318"],
      destructive: ["FEF3F2", "FECDCA", "B42318"],
    },
  };
  check("matrix count", nodes.length, counts[component]);
  for (const node of nodes) {
    const css = getComputedStyle(node);
    const variant = node.getAttribute("data-variant");
    const size = node.getAttribute("data-size") || "default";
    const state =
      node.getAttribute("data-visual-state") || node.getAttribute("data-state");
    const disabled = state?.startsWith("Disabled") || false;
    const hover = state === "Hover";
    const focus = state === "Focus";
    const key = component + "/" + variant + "/" + size + "/" + state;
    const eq = (property, expected) =>
      check(key + " " + property, css[property], expected);
    eq("boxSizing", "border-box");
    eq("opacity", "1");
    if (component === "badge" || component === "tag") {
      const [bg, border, text] = palettes[component][variant];
      eq("height", { sm: "20px", default: "24px", lg: "30px" }[size]);
      eq("borderRadius", component === "badge" ? "25px" : "8px");
      eq("gap", component === "badge" ? "8px" : "6px");
      eq("fontFamily", "Inter, sans-serif");
      eq("fontWeight", "400");
      eq(
        "fontSize",
        (component === "badge" ? size === "lg" : size !== "sm")
          ? "14px"
          : "12px"
      );
      eq("backgroundColor", rgb(bg));
      eq("color", rgb(text));
      if (border) {
        eq("borderTopColor", rgb(border));
        check(
          key + " visible border",
          Number.parseFloat(css.borderTopWidth) > 0,
          true
        );
      } else {
        eq("borderTopWidth", "0px");
      }
      eq(
        "paddingLeft",
        (component === "badge"
          ? { sm: "8px", default: "12px", lg: "16px" }
          : { sm: "6px", default: "8px", lg: "12px" })[size]
      );
    } else if (component === "input") {
      eq("height", "40px");
      eq("borderRadius", "8px");
      eq("paddingLeft", "16px");
      eq("paddingRight", "16px");
      eq("fontFamily", "Inter, sans-serif");
      eq("fontSize", "16px");
      eq("fontWeight", "400");
      eq("lineHeight", "24px");
      eq("backgroundColor", rgb(disabled ? "F5F5F5" : "FFFFFF"));
      eq("color", rgb("181D27"));
      eq("borderTopWidth", "1px");
      eq(
        "borderTopColor",
        rgb(
          disabled
            ? "E9EAEB"
            : variant === "error"
              ? "F04438"
              : focus
                ? "27ABB8"
                : hover
                  ? "C0C3CA"
                  : "E9EAEB"
        )
      );
      check(key + " disabled", node.disabled, disabled);
      if (focus)
        check(
          key + " focus shadow",
          css.boxShadow.includes(
            variant === "error"
              ? "rgba(240, 68, 56, 0.4) 0px 0px 4px 0px"
              : "rgba(39, 171, 184, 0.4) 0px 0px 4px 0px"
          ),
          true
        );
      else check(key + " no shadow", zeroShadow(css.boxShadow), true);
    } else if (component === "checkbox") {
      const selected = variant !== "unchecked";
      const bg = selected
        ? disabled
          ? "A2A6B1"
          : hover
            ? "2F384D"
            : "343E55"
        : hover
          ? "F5F5F5"
          : "FFFFFF";
      const border = selected
        ? disabled
          ? "A2A6B1"
          : hover && variant === "checked"
            ? "2F384D"
            : "343E55"
        : disabled
          ? "F5F5F5"
          : focus
            ? "343E55"
            : hover
              ? "C0C3CA"
              : "E9EAEB";
      eq("height", { sm: "16px", default: "20px", lg: "24px" }[size]);
      eq("width", { sm: "16px", default: "20px", lg: "24px" }[size]);
      eq("borderRadius", "4px");
      eq("borderTopWidth", "1px");
      eq("backgroundColor", rgb(bg));
      eq("borderTopColor", rgb(border));
      check(key + " disabled", node.disabled, disabled);
      const icon = node.querySelector("svg");
      check(key + " icon presence", Boolean(icon), selected);
      if (icon) {
        const glyph = getComputedStyle(icon);
        check(
          key + " icon width",
          glyph.width,
          { sm: "12px", default: "14px", lg: "16px" }[size]
        );
        check(key + " icon color", glyph.color, rgb("FFFFFF"));
        check(key + " icon stroke", glyph.strokeWidth, "3px");
      }
      if (focus || (hover && variant === "checked"))
        check(
          key + " shadow",
          css.boxShadow.includes("rgb(235, 236, 238) 0px 0px 0px 2px"),
          true
        );
      else check(key + " no shadow", zeroShadow(css.boxShadow), true);
    } else if (component === "switch") {
      const on = variant === "on";
      const dimensions = {
        sm: ["32px", "18px", "14px", 14],
        default: ["36px", "20px", "16px", 16],
        lg: ["44px", "24px", "20px", 20],
      }[size];
      eq("width", dimensions[0]);
      eq("height", dimensions[1]);
      eq("borderRadius", "12px");
      eq("borderTopWidth", "2px");
      eq(
        "backgroundColor",
        rgb(
          on
            ? disabled
              ? "A2A6B1"
              : hover
                ? "2F384D"
                : "343E55"
            : hover
              ? "E9EAEB"
              : "EBECEE"
        )
      );
      check(key + " disabled", node.disabled, disabled);
      const thumb = getComputedStyle(node.querySelector("span"));
      check(key + " thumb width", thumb.width, dimensions[2]);
      check(key + " thumb height", thumb.height, dimensions[2]);
      check(
        key + " thumb surface",
        thumb.backgroundColor,
        rgb(disabled ? (on ? "EBECEE" : "F5F5F5") : "FFFFFF")
      );
      const translate =
        thumb.transform === "none"
          ? 0
          : Number.parseFloat(thumb.transform.split(",")[4]);
      check(key + " thumb translation", translate, on ? dimensions[3] : 0);
      check(
        key + " thumb shadow",
        thumb.boxShadow.includes("rgba(0, 0, 0, 0.06) 0px 2px 8px 0px"),
        true
      );
      if (focus) {
        eq("outlineStyle", "solid");
        eq("outlineWidth", "1px");
        eq("outlineOffset", "3px");
        eq("outlineColor", rgb("343E55"));
      }
    }
  }
  return {
    component,
    elements: nodes.length,
    checks,
    mismatches: failures.length,
    failures,
  };
})();
