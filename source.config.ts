import {
  remarkFeedbackBlock,
  RemarkFeedbackBlockOptions,
} from "fumadocs-core/mdx-plugins";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

const feedbackOptions: RemarkFeedbackBlockOptions = {
  // other options:
};

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [[remarkFeedbackBlock, feedbackOptions]],
  },
});
