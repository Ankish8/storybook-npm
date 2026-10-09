import selectorParser from "postcss-selector-parser";

/** Add forced-state classes without removing real interaction selectors. */
export default function pseudoStates() {
  return {
    postcssPlugin: "myoperator-docs-pseudo-states",
    Rule(rule) {
      if (
        !rule.selector ||
        !/:(hover|active|focus|focus-visible|focus-within)\b/.test(
          rule.selector
        )
      )
        return;
      rule.selector = selectorParser((root) =>
        root.walkPseudos((node) => {
          if (
            ![
              ":hover",
              ":active",
              ":focus",
              ":focus-visible",
              ":focus-within",
            ].includes(node.value)
          )
            return;
          const original = node.clone();
          const state = selectorParser.className({
            value: `pseudo-${node.value.slice(1)}`,
          });
          const pseudo = selectorParser.pseudo({ value: ":is" });
          const live = selectorParser.selector();
          live.append(original);
          const forced = selectorParser.selector();
          forced.append(state);
          pseudo.append(live);
          pseudo.append(forced);
          node.replaceWith(pseudo);
        })
      ).processSync(rule.selector);
    },
  };
}
pseudoStates.postcss = true;
