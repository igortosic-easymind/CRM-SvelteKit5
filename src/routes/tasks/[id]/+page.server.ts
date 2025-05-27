import { getTask } from "$lib/server/tasks";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const taskId = params.id;

  if (!taskId) {
    throw error(400, "Client ID is required");
  }

  const result = await getTask(cookies, taskId);

  if (!result.success || !result.data) {
    throw error(404, result.error || "Client not found");
  }

  return {
    task: result.data,
  };
};
