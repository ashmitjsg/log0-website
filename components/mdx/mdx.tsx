import { FeedbackBlock } from "@/components/docs/feedback/client";
import { onBlockFeedbackAction } from "@/lib/docs/github";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { MDXComponents } from "mdx/types";
import { Mermaid } from "@/components/mdx/mermaid";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    FeedbackBlock: ({ children, ...rest }) => (
      <FeedbackBlock {...rest} onSendAction={onBlockFeedbackAction}>
        {children}
      </FeedbackBlock>
    ),
    Mermaid,
    Tab,
    Tabs,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
