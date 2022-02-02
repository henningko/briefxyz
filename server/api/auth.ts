// allows access to runtime config
import type { IncomingMessage, ServerResponse } from "http";
import config from "#config";
import { createClient } from "@supabase/supabase-js";
import { useCookies, useBody } from "h3";

// https://egghead.io/lessons/supabase-pass-supabase-session-cookie-to-api-route-to-identify-user
const supabase = createClient(config.supabaseUrl, config.supabaseKey);
export default async (req: IncomingMessage, res: ServerResponse) => {
  // const cookies = useCookies(req);
  // @ts-expect-error: Missing properties in h3
  req.body = await useBody(req);
  // without this, there's a "res.status is not a function" error, TODO understand what's happening here
  // @ts-expect-error: Missing properties in h3
  res.status = (p) => ({ json: (p) => ({}) });
  // sets Cookie when this is called with POST
  const user = await supabase.auth.api.setAuthCookie(req, res);
  // @ts-expect-error: Missing properties in h3
  delete req.body;
  // @ts-expect-error: Missing properties in h3
  delete res.status;

  return {
    updated: true,
  };
};
