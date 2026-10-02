import * as React from "react";
import {
  DocsContainer,
  type DocsContainerProps,
} from "@storybook/addon-docs/blocks";
import { create } from "storybook/theming";

const neutralDocsTheme = create({
  base: "light",
  textColor: "#5E5E5E",
  textMutedColor: "#707070",
});

/** Documentation follows the v2 text palette without changing v1 Docs. */
export function V2DocsContainer({
  children,
  ...props
}: React.PropsWithChildren<DocsContainerProps>) {
  const isV2 = props.context.componentStories()[0]?.title.startsWith("V2/");
  return (
    <DocsContainer {...props} theme={isV2 ? neutralDocsTheme : props.theme}>
      {isV2 ? <div className="v2-docs">{children}</div> : children}
    </DocsContainer>
  );
}
