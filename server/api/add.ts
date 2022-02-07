// allows access to runtime config
import config from "#config";
// import mdit from "markdown-it";
import type { IncomingMessage, ServerResponse } from "http";
// import { createClient } from "@supabase/supabase-js";
import supabase from "../lib/supabase";
import { useCookie, useBody } from "h3";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import sanitizeHtml from "sanitize-html";

// const supabase = createClient(config.supabaseUrl, config.supabaseKey);
// const markdown = new mdit({
//   html: true,
//   linkify: false,
//   typographer: true,
//   breaks: true,
// });

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
export default async (req: IncomingMessage, res: ServerResponse) => {
  const { url, type, access_token } = await useBody(req);
  const response = await $fetch(url);
  const doc = new JSDOM(response);
  const reader = new Readability(doc.window.document);
  const article = reader.parse();
  const clean = sanitizeHtml(article.content, { allowedTags: allowedTags });
  // let clean = article.sanitize(article, { FORBID_TAGS: ["div"] });
  let session = supabase.auth.session();
  if (!session.user?.id) {
    session = supabase.auth.setAuth(access_token);
    //why do I have to do this? why doesn't setAuth set the user?
    ({ user: session.user } = await supabase.auth.api.getUser(access_token));
  }
  if (session.user?.id) {
    try {
      const { data, error } = await supabase.from("user_content").insert([
        {
          title: article.title,
          data: clean,
          type: "article",
          user_id: session.user.id,
          format: "text/html",
        },
      ]);
      return { success: "Added successfully" };
    } catch (error) {
      res.statusCode = 500;
      return error;
    }
  } else {
    res.statusCode = 401;
    return "Unauthorized";
  }
};
