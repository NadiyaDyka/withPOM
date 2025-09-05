import BaseApi from "./base-api";
import { APIRequestContext } from "playwright";
import { REQRES_URL } from "../test-data/constants-api";

export default class LoginApi extends BaseApi {
  userEmail: string;
  userPassword: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.apiEndpoint = "api/login";
    this.apiUrl = `${process.env.REQRES_URL ?? REQRES_URL}${this.apiEndpoint}`;
    this.userEmail = "";
    this.userPassword = "";
  }

  async setupRequest(userEmail: string, userPassword: string) {
    this.userEmail = userEmail;
    this.userPassword = userPassword;
  }
}
