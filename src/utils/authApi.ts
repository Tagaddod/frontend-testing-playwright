import { request } from "@playwright/test";
import { URLs } from "../config/urls";
import { ENV } from "../config/env";

export async function apiLogin() {
  const api = await request.newContext();

  const response = await api.post(URLs.graphql, {
    data: {
      query: `
        mutation {
          login(email: "${ENV.ADMIN_EMAIL}", password: "${ENV.ADMIN_PASSWORD}", type: EMAIL) {
            id
            jwtToken
          }
        }
      `
    }
  });

  const json = await response.json();
  const token = json?.data?.login?.jwtToken;

  if (!token) throw new Error("Login failed: token not returned");

  return { token };
}
