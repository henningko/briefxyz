// allows access to runtime config
import config from "#config";
import mdit from "markdown-it";
import sanitizeHtml from "sanitize-html";
import type { IncomingMessage, ServerResponse } from "http";
// import { createClient } from "@supabase/supabase-js";
import supabase from "../lib/supabase";
import { useCookie } from "h3";

// const supabase = createClient(config.supabaseUrl, config.supabaseKey);
const allowedTags = [
  "address",
  "article",
  "aside",
  "footer",
  "header",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hgroup",
  "main",
  "section",
  "blockquote",
  "dd",
  "dl",
  "dt",
  "figcaption",
  "figure",
  "img",
  "hr",
  "li",
  "main",
  "ol",
  "p",
  "pre",
  "ul",
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "br",
  "cite",
  "code",
  "data",
  "dfn",
  "em",
  "i",
  "kbd",
  "mark",
  "q",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr",
  "caption",
  "col",
  "colgroup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
];
const markdown = new mdit({
  html: true,
  linkify: false,
  typographer: true,
  breaks: true,
});
export default async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { data: digest } = await supabase
      .from("user_digests")
      .select("id")
      .order("created_at", { ascending: false })
      .range(0, 1);
    const { data } = await supabase
      .from("user_content_queue")
      .select("title, content, type, target_url, format")
      .gt("inserted_at", new Date(Date.now() - 86400000).toISOString()) // Only past 24 hours
      .order("type", { ascending: false })
      .eq("digest_id", digest[0].id);
    const sanitized = data.map((el) => {
      if (el.format === "text/html") {
        let fEl = el;
        fEl.content = sanitizeHtml(el.content, { allowedTags: allowedTags });
        return fEl;
      } else {
        let fEl = el;
        fEl.content = sanitizeHtml(markdown.render(el.content), {
          allowedTags: allowedTags,
        });
        return fEl;
      }
    });
    // res.setHeader("Content-Type", "text/html; charset=UTF-8");
    // return markdown.render(data[1].data);
    return sanitized;
  } catch (error) {
    console.log(`this is from get ${error}`);
  }
};
