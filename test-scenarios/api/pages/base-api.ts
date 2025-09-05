import { APIRequest, APIResponse } from "@playwright/test";
import { APIRequestContext } from "playwright";
export default class BaseApi {
  protected readonly request: APIRequestContext;
  public apiUrl: string;
  public apiEndpoint: string;
  public apiHeader: string;
  public apiRequest: APIRequest | null;
  public apiResponse: APIResponse | null;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.apiEndpoint = "";
    this.apiUrl = "";
    this.apiHeader = "";
    this.apiRequest = null;
    this.apiResponse = null;
  }
  getAPIRequestContext() {
    return this.request;
  }
}
