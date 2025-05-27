import { getClient } from "$lib/server/clients";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const clientId = params.id;

  if (!clientId) {
    throw error(400, "Client ID is required");
  }

  const result = await getClient(cookies, clientId);

  if (!result.success || !result.data) {
    throw error(404, result.error || "Client not found");
  }

  return {
    client: result.data,
  };
};
