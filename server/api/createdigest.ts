// allows access to runtime config
import config from "#config";
import type { IncomingMessage, ServerResponse } from "http";
import supabase from "../lib/supabase";
import { useBody } from "h3";

export default async (req: IncomingMessage, res: ServerResponse) => {
  // Todo: we can probably have a default auth.id in the table that makes the user obsolete
  const { url, access_token } = await useBody(req);
  let session = supabase.auth.session();
  if (!session.user?.id) {
    session = supabase.auth.setAuth(access_token);
    //why do I have to do this? why doesn't setAuth set the user?
    ({ user: session.user } = await supabase.auth.api.getUser(access_token));
  }
  // TODO get from user profile
  const speed = 250; // reading speed in wpm
  const length = 30; // reading lengh in minutes

  const { data: queue } = await supabase
    .from("user_content_queue")
    .select("id, content_length, priority")
    .order("priority", { ascending: true })
    .order("content_length", { ascending: true })
    .is("digest_id", null);

  if (queue.length === 0) {
    return "No new entries available";
  } else {
    // create digest and get ID.
    const { data, error } = await supabase
      .from("user_digests")
      .insert([{ user_id: session.user.id }]);

    // get from queue sorted by priority, length, only those without a digest id

    // add to digest

    let digest_length = 0;
    const max_digest_length = speed * length * 7; // 7 average chars per word
    let i = 0;
    while (digest_length < max_digest_length && i < queue.length) {
      if (digest_length + queue[i].content_length < max_digest_length) {
        await supabase
          .from("user_content_queue")
          .update({ digest_id: data[0].id })
          .eq("id", queue[i].id);
        digest_length += queue[i].content_length;
      }
      i++;
    }
    return `Created digest ${data[0].id}`;
  }
};
