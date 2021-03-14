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
  if (req.method.toLowerCase() !== "post")
    return req.respond({ status: 400, body: "method not allowed" });

  const data = await Deno.readAll(req.body);
  const verify = slash.verifyKey(
    data,
    req.headers.get("x-signature-ed25519") ?? "",
    req.headers.get("x-signature-timestamp") ?? ""
  );
  if (!verify) return req.respond({ status: 401, body: "not authorized" });

  const respond = (data: any) =>
    req.respond({
      body: JSON.stringify(data),
      headers: new Headers({
        "content-type": "application/json",
      }),
    });

  const interaction = JSON.parse(new TextDecoder("utf-8").decode(data));
  if (interaction.type == 0) respond({ type: 0 });

  respond({
    type: 4,
    data: {
      content: "Pong!",
    },
  });
};
