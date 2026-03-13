import {
  AISearch,
  AISearchPanel,
  AISearchTrigger,
} from "@/components/docs/ai/search";
import "./styles.css";
import { docsBaseOptions } from "@/lib/docs/layout";
import { docsSource } from "@/lib/docs/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/docs/ui/button";
import { MessageCircleIcon } from "lucide-react";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    // TODO:  Add and use your own AI models, update the configurations in useChat and /api/chat route. Ref: https://www.fumadocs.dev/docs/integrations/llms#ask-ai
    <AISearch>
      <AISearchPanel />
      <AISearchTrigger
        position="float"
        className={cn(
          buttonVariants({
            variant: "secondary",
            className: "text-fd-muted-foreground rounded-2xl",
          })
        )}
      >
        <MessageCircleIcon className="size-4.5" />
        Ask AI
      </AISearchTrigger>
      <DocsLayout tree={docsSource.getPageTree()} {...docsBaseOptions}>
        {children}
      </DocsLayout>
    </AISearch>
  );
}
