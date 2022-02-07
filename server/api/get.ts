// allows access to runtime config
import config from "#config";
import mdit from "markdown-it";
import type { IncomingMessage, ServerResponse } from "http";
// import { createClient } from "@supabase/supabase-js";
import supabase from "../lib/supabase";
import { useCookie } from "h3";

// const supabase = createClient(config.supabaseUrl, config.supabaseKey);
const markdown = new mdit({
  html: true,
  linkify: false,
  typographer: true,
  breaks: true,
});
export default async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { data } = await supabase
      .from("user_content")
      .select("title, data, type, target_url, format")
      .gt("inserted_at", new Date(Date.now() - 86400000).toISOString()) // Only past 24 hours
      .order("type", { ascending: false });
    const dataMarkdown = data.map((el) => {
      if (el.format === "text/markdown") {
        let fEl = el;
        fEl.data = markdown.render(el.data);
        return fEl;
      }
    });
    // res.setHeader("Content-Type", "text/html; charset=UTF-8");
    // return markdown.render(data[1].data);
    return dataMarkdown;
  } catch (error) {
    console.log(`this is from get ${error}`);
  }
};
