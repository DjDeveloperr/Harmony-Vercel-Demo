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
  if (req.method.toLowerCase() !== "post") return req.respond({ status: 400 });

  const verify = slash.verifyKey(
    await Deno.readAll(req.body),
    req.headers.get("x-signature-ed25519") ?? "",
    req.headers.get("x-signature-timestamp") ?? ""
  );
  if (!verify) return req.respond({ status: 401 });

  req.respond({
    body: JSON.stringify({
      type: 4,
      data: {
        content: "Pong!",
      },
    }),
    headers: new Headers({
      "content-type": "application/json",
    }),
  });
};
