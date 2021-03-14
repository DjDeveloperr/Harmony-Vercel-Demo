import { ServerRequest, SlashClient } from "../deps.ts";

const slash = new SlashClient({
  id: Deno.env.get("ID")!,
  token: Deno.env.get("TOKEN")!,
  publicKey: Deno.env.get("PUBLIC_KEY")!,
});

await slash.commands.bulkEdit([
  {
    name: "ping",
    description: "Just ping!",
  },
]);

export default async (req: ServerRequest) => {
  const d = await slash.verifyServerRequest(req);
  if (d === false) return req.respond({ status: 401, body: "not authorized" });

  if (d.type === 1) return d.respond({ type: 1 });
  d.reply("Pong!");
};
