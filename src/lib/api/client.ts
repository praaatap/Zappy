import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

export const createZap = async (triggerId: string, actions: { actionId: string }[]) => {
  return await axios.post(`${API_URL}/zap`, {
    triggerId,
    actions
  });
};