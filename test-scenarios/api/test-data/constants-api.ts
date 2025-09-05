export const REQRES_SUFFIX = "@reqres.in";
export const REQRES_URL = "https://reqres.in/";
export const END_POINT_API_REGISTER = "/api/register";
export const POST_METHOD = "Post";
export type CreateUserResponse = {
  id: number | string;
  token: string;
};
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
