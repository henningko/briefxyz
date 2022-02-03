import config from "#config";
import type { IncomingMessage, ServerResponse } from "http";
import supabase from "../lib/supabase";
import { useCookie, useBody } from "h3";

export default async (req: IncomingMessage, res: ServerResponse) => {
  // https://supabase.com/docs/reference/javascript/auth-setauth
  // const { user } = supabase.auth.setAuth(useCookie(req, "sb:token"));
  const token = useCookie(req, "sb:token");
  const session = supabase.auth.setAuth(token);
  // @ts-ignore
  req.session = session;
};
