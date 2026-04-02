import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const createZap = async (triggerId: string, actions: { actionId: string }[]) => {
  return await axios.post(`${API_URL}/zap`, {
    triggerId,
    actions
  });
};