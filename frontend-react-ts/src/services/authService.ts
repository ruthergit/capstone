// services/authService.ts
import api from "./api";

type LoginResponse = {
  user: {
    id: number;
    name: string;
    type: string;
    [key: string]: any;
  };
  token: string;
};

export const login = async (
  login_id: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/login", { login_id, password });
  return response.data;
};
