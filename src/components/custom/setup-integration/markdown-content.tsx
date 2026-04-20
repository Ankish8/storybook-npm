import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"
import { cn } from "../../../lib/utils"

export type MarkdownBubbleTone =
  | "assistant-default"
  | "assistant-error"
  | "assistant-success"
  | "user-default"
  | "user-error"
  | "user-success"

const toneToCodeBlockClass: Record<MarkdownBubbleTone, string> = {
  "assistant-default": "border-semantic-border-layout bg-semantic-bg-ui text-semantic-text-primary",
  "assistant-error": "border-semantic-border-primary bg-semantic-error-surface text-semantic-error-text",
  "assistant-success":
    "border-semantic-border-primary bg-semantic-success-surface text-semantic-success-text",
  "user-default": "border-semantic-border-layout bg-semantic-bg-hover text-semantic-text-primary",
  "user-error":
    "border-semantic-border-primary bg-semantic-error-surface text-semantic-error-text",
  "user-success":
    "border-semantic-border-primary bg-semantic-success-surface text-semantic-success-text",
}

function createMarkdownComponents(tone: MarkdownBubbleTone): Components {
  const codeBlockSurface = toneToCodeBlockClass[tone]

  return {
    p: ({ children }) => <p className="m-0 mb-2 last:mb-0">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-semantic-text-link underline underline-offset-2 hover:text-semantic-primary"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="m-0 mb-2 list-disc pl-4 last:mb-0">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="m-0 mb-2 list-decimal pl-4 last:mb-0">{children}</ol>
    ),
    li: ({ children }) => <li className="m-0 [&>p]:m-0">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="m-0 mb-2 border-l-2 border-semantic-border-layout pl-2 last:mb-0 [&>p]:m-0">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-2 border-semantic-border-layout" />,
    h1: ({ children }) => (
      <h1 className="m-0 mb-2 text-base font-semibold leading-snug last:mb-0">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="m-0 mb-2 text-base font-semibold leading-snug last:mb-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="m-0 mb-2 text-sm font-semibold leading-snug last:mb-0">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="m-0 mb-2 text-sm font-semibold leading-snug last:mb-0">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="m-0 mb-2 text-sm font-semibold leading-snug last:mb-0">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="m-0 mb-2 text-sm font-semibold leading-snug last:mb-0">{children}</h6>
    ),
    code: ({ className, children, ...props }) => {
      const isBlock = /language-/.test(className ?? "")
      if (isBlock) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        )
      }
      return (
        <code
          className={cn(
            "rounded px-1 py-0.5 font-mono text-[0.8125rem]",
            codeBlockSurface
          )}
          {...props}
        >
          {children}
        </code>
      )
    },
    pre: ({ children }) => (
      <pre
        className={cn(
          "m-0 mb-2 max-w-full overflow-x-auto rounded-md border px-2 py-2 font-mono text-xs leading-relaxed last:mb-0",
          codeBlockSurface
        )}
      >
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <div className="my-2 max-w-full overflow-x-auto last:mb-0">
        <table className="w-full min-w-[240px] border-collapse border border-semantic-border-layout text-left text-xs">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-semantic-bg-ui text-semantic-text-primary">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-semantic-border-layout last:border-b-0">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border border-semantic-border-layout px-2 py-1.5 font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-semantic-border-layout px-2 py-1.5 align-top">{children}</td>
    ),
  }
}

export interface MarkdownBubbleContentProps {
  markdown: string
  tone: MarkdownBubbleTone
  className?: string
}

/**
 * Renders GFM Markdown (tables, lists, task lists, strikethrough) inside chat bubbles.
 */
function MarkdownBubbleContent({ markdown, tone, className }: MarkdownBubbleContentProps) {
  const components = React.useMemo(() => createMarkdownComponents(tone), [tone])

  return (
    <div className={cn("min-w-0 max-w-full", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}

MarkdownBubbleContent.displayName = "MarkdownBubbleContent"

export { MarkdownBubbleContent }
