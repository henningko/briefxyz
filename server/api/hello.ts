import { useBody, useCookies, useQuery } from "h3";

export default async (req, res) => {
  // const query = await useQuery(req);
  // const body = await useBody(req); // only for POST request
  //https://getpocket.com/developer/docs/authentication
  // https://developers.google.com/identity/protocols/oauth2
  // https://javascript.info/fetch
  // https://developers.google.com/calendar/api/guides/auth
  // Get Consumer Key from Database with Secret

  // Retrieve Code from Auth endpoint POST /v3/oauth/request

  // have user log in on the frontend and capture redirect

  // redirect should trigger requesting of access_token

  // store accesss token

  // const consumer_key = "100722-b6adc050e91c808a559ce2d";
  // const code = "9aae9e0d-5415-4c71-cbec-a15ae9";
  // const cookies = useCookies(req);
  // try {
  //   const { access_token, username } = await $fetch(
  //     "https://getpocket.com/v3/oauth/authorize",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json; charset=UTF8",
  //         "X-Accept": "application/json",
  //         accept: "*/*",
  //       },
  //       body: { consumer_key: consumer_key, code: code },
  //     }
  //   );
  //   console.log(access_token);
  // } catch (error) {
  //   console.log("erroring");
  //   console.log(error);
  // }

  // return { query, body, cookies };
  return "Hello world";
};
