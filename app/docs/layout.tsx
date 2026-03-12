import "./styles.css";
import { docsBaseOptions } from "@/lib/docs/layout";
import { docsSource } from "@/lib/docs/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout tree={docsSource.getPageTree()} {...docsBaseOptions}>
      {children}
    </DocsLayout>
  );
}
