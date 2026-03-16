import { getMDXComponents } from "@/components/mdx/mdx";
import {
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "@/components/docs/ai/page-actions";
import { docsSource } from "@/lib/docs/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { links } from "@/lib/links";
import { Feedback } from "@/components/docs/feedback/client";
import { onPageFeedbackAction } from "@/lib/docs/github";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = docsSource.getPage(params.slug);

  if (!page) notFound();

  // URL to fetch Markdown content, only need to append .mdx to URL if you have `*.mdx` configured.
  const markdownUrl = `${page.url}.mdx`;

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <div className="flex flex-row gap-2 items-center border-b pt-2 pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${links.websiteGithubRepo}/blob/main/content/docs/${page.path}`}
          />
        </div>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(docsSource, page),
          })}
        />
      </DocsBody>
      <Feedback onSendAction={onPageFeedbackAction} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return docsSource.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">
): Promise<Metadata> {
  const params = await props.params;
  const page = docsSource.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
