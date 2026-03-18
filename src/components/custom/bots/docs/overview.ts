/**
 * BotList module — single-page docs built from per-component props.
 * Each section uses only its own component's props.
 */

import { designTokensTable } from "./design-tokens";
import {
  botListDescription,
  botListPropsTable,
  botListEvents,
  botCardDescription,
  botCardPropsTable,
  botCardEvents,
  createBotModalDescription,
  createBotModalPropsTable,
  createBotModalEvents,
  botListHeaderDescription,
  botListHeaderPropsTable,
  botListHeaderEvents,
  botListSearchDescription,
  botListSearchPropsTable,
  botListSearchEvents,
  botListCreateCardDescription,
  botListCreateCardPropsTable,
  botListCreateCardEvents,
  botListGridDescription,
  botListGridPropsTable,
  botListGridEvents,
  botListActionDescription,
  botListActionPropsTable,
  botListActionEvents,
  botTypePropsTable,
} from "./props";

function eventsLine(events: readonly string[]): string {
  if (events.length === 0) return "**Events:** —";
  return "**Events:** " + events.map((e) => "`" + e + "`").join(", ");
}

const intro = `
# BotList Module

Full-page bot management view: header, search, responsive grid of bot cards, and Create Bot modal.

## Installation

\`\`\`bash
npx myoperator-ui add bots
\`\`\`

## Import

\`\`\`tsx
import {
  BotList,
  BotListHeader,
  BotListSearch,
  BotListCreateCard,
  BotListGrid,
  BotCard,
  BotListAction,
  CreateBotModal,
} from "@/components/custom/bots";
import type {
  BotListProps,
  BotListHeaderProps,
  BotListSearchProps,
  BotListCreateCardProps,
  BotListGridProps,
  BotCardProps,
  BotListActionProps,
  CreateBotModalProps,
  Bot,
  BotType,
} from "@/components/custom/bots";
\`\`\`

## Design Tokens

${designTokensTable}
`;

/** Single-page docs: each section shows only that component's props. */
export const overview =
  intro +
  `
---

## BotList

${botListDescription}

${eventsLine(botListEvents)}

${botListPropsTable}

---

## BotCard

${botCardDescription}

${eventsLine(botCardEvents)}

${botCardPropsTable}

---

## BotListHeader

${botListHeaderDescription}

${eventsLine(botListHeaderEvents)}

${botListHeaderPropsTable}

---

## BotListSearch

${botListSearchDescription}

${eventsLine(botListSearchEvents)}

${botListSearchPropsTable}

---

## BotListCreateCard

${botListCreateCardDescription}

${eventsLine(botListCreateCardEvents)}

${botListCreateCardPropsTable}

---

## BotListGrid

${botListGridDescription}

${eventsLine(botListGridEvents)}

${botListGridPropsTable}

---

## BotListAction

${botListActionDescription}

${eventsLine(botListActionEvents)}

${botListActionPropsTable}

---

## CreateBotModal

${createBotModalDescription}

${eventsLine(createBotModalEvents)}

${createBotModalPropsTable}

---

## Bot (type)

${botTypePropsTable}
`;
