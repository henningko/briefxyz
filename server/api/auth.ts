// allows access to runtime config
import type { IncomingMessage, ServerResponse } from "http";
import config from "#config";
import supabase from "../lib/supabase";
import { useCookie, useBody } from "h3";

// https://egghead.io/lessons/supabase-pass-supabase-session-cookie-to-api-route-to-identify-user

export default async (req: IncomingMessage, res: ServerResponse) => {
  let auth: boolean = false;
  // const cookies = useCookies(req);
  // @ts-expect-error: Missing properties in h3
  req.body = await useBody(req);
  // without this, there's a "res.status is not a function" error, TODO understand what's happening here
  // @ts-expect-error: Missing properties in h3
  res.status = (p) => ({ json: (p) => ({}) });
  // sets Cookie when this is called with POST
  // try {
  // SSR causes this to report a missing Auth session
  supabase.auth.api.setAuthCookie(req, res);
  // @ts-expect-error: Missing properties in h3
  if (req.body?.session) {
    auth = true;
  }
  // @ts-expect-error: Missing properties in h3
  delete req.body;
  // @ts-expect-error: Missing properties in h3
  delete res.status;
  //TODO be more explicit about setting/unsetting cookie
  return {
    auth,
  };
};
