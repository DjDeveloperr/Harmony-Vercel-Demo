import { ServerRequest } from "./deps.ts";

export default async (req: ServerRequest) => {
  req.respond({ body: `Hello from Deno v${Deno.version.deno}!` });
};
