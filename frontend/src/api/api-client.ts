import type { AxiosResponse } from "axios";
import { isCancel } from "axios";
import { API_TIMEOUT } from "~/config";
import type { HttpClientOptions } from "~/lib/http-client";
import { HttpClient } from "~/lib/http-client";
import { isBlank, isString } from "~/lib/utils";

export class ApiError<T = any> extends Error {
  public response: AxiosResponse<T> | undefined;

  public code: string | number | undefined;
}

const isNonEmptyString = (s: unknown) => isString(s) && !isBlank(s);

export const DEFAULT_CLIENT_OPTIONS: HttpClientOptions = {
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  onResp: (r) => {
    return r.data;
  },
  onError: (e, options) => {
    let errorMessage: string;
    if (isNonEmptyString(e)) {
      errorMessage = e;
    } else if (isNonEmptyString(e?.response?.data)) {
      errorMessage = e?.response?.data;
    } else if (isNonEmptyString(e?.response?.data?.message)) {
      errorMessage = e?.response?.data?.message;
    } else if (isNonEmptyString(e?.response?.data?.msg)) {
      errorMessage = e?.response?.data?.msg;
    } else if (isNonEmptyString(e?.message)) {
      errorMessage = e?.message;
    } else if (isCancel(e)) {
      errorMessage = "Request cancelled";
    } else {
      errorMessage = "Request Error";
    }
    const errorCode = e?.response?.data?.code || e?.response?.status;
    const error: any = typeof e === "object" ? e : new ApiError(errorMessage);
    error.message = errorMessage;
    error.code = errorCode;
    error.title = options?.meta?.title;
    throw error;
  },
};

const createApiClient = (options?: HttpClientOptions) =>
  new HttpClient({
    ...DEFAULT_CLIENT_OPTIONS,
    ...options,
  });

export { createApiClient };
