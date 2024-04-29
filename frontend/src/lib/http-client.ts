import type {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  Canceler,
} from "axios";
import axios from "axios";
import omit from "lodash.omit";
import { isFunction, isObject, isPlainObject } from "./utils";

const isUseBodyMethod = (method: string) =>
  ["post", "put", "patch"].indexOf(method) >= 0;

const objectToUrlSearchParams = (obj: unknown) => {
  if (!isObject(obj)) return null;
  const params = new URLSearchParams();
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    const value = (obj as any)[key];
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (typeof value === "object") {
      params.append(key, JSON.stringify(value));
    } else {
      params.append(key, value);
    }
  });
  return params;
};

const paramRegExp = /:([^/]*?)(?=\/|$)/g;

const processParameterizedUrl = (url: string, data: { [key: string]: any }) => {
  if (typeof url !== "string" || url.trim() === "") {
    return { url: "", keys: [] };
  }

  const keys: string[] = [];
  const newUrl = url.replace(paramRegExp, (_, param) => {
    keys.push(param);
    return encodeURIComponent(data[param]);
  });

  return {
    url: newUrl,
    keys,
  };
};

const wrapHttpPromise = <T>(
  promise: Promise<T>,
  props: { [key: string]: any }
): ApiPromise<T> => {
  const wrapper: { [key: string]: any } = {};
  wrapper.then = (...args: any) => promise.then(...args);
  wrapper.catch = (...args: any) => promise.catch(...args);
  wrapper.finally = (...args: any) => promise.finally(...args);
  return Object.assign(wrapper, props) as ApiPromise<T>;
};

type OnErrorFn = (error: any, options: HttpClientRequestOptions) => any;

export type BeforeRequestFunction = <T>(
  data: T,
  options: HttpClientOptions
) => T;

export type HttpClientOptions = {
  onResp?: <T = any>(response: AxiosResponse<T>) => any;
  onError?: OnErrorFn;
  beforeRequest?: BeforeRequestFunction;
} & AxiosRequestConfig;

export type HttpClientRequestOptions = {
  useBody?: boolean;
  useSearchParams?: boolean;
  pathParams?: Record<string, any>;
  meta?: Record<string, any>;
} & HttpClientOptions;

export type NoBodyMethod = "get" | "delete";

export type BodyMethod = "post" | "patch" | "put";

export type Method = BodyMethod | NoBodyMethod;

export interface ApiPromise<T> extends Promise<T> {
  cancel: () => void;
}

export type RequestCaller<S, T> = (
  data?: S,
  extendedOptions?: HttpClientRequestOptions
) => ApiPromise<T>;

class HttpClient {
  private onResp?: <T = any>(response: AxiosResponse<T>) => any;

  private inst: AxiosInstance;

  private onError?: OnErrorFn;

  private beforeRequest?: BeforeRequestFunction;

  private readonly _options?: HttpClientOptions;

  constructor(options: HttpClientOptions = {}) {
    const { onResp, onError, beforeRequest, ...opts } = options;
    this._options = options;
    this.inst = axios.create(opts);
    this.onResp = onResp;
    this.onError = onError;
    this.beforeRequest = beforeRequest;
  }

  get interceptors(): {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  } {
    return this.inst.interceptors;
  }

  get options(): HttpClientOptions {
    return this._options || {};
  }

  get axios() {
    return this.inst;
  }

  registerInterceptor(
    type: keyof AxiosInstance["interceptors"],
    resolve: <V>(value: V) => V | Promise<V>,
    reject: (error: any) => any
  ): number {
    if (type === "request") {
      return this.inst.interceptors.request.use(resolve, reject);
    }
    if (type === "response") {
      return this.inst.interceptors.response.use(resolve, reject);
    }
    console.warn(
      `Fail to register interceptor, unknown interceptor type: ${type}`
    );
    return -1;
  }

  unregisterInterceptor(
    type: keyof AxiosInstance["interceptors"],
    interceptorId: number
  ): void {
    this.inst.interceptors[type].eject(interceptorId);
  }

  registerRequestInterceptor(
    resolve: <V>(value: V) => V | Promise<V>,
    reject: (error: any) => any
  ): number {
    return this.registerInterceptor("request", resolve, reject);
  }

  registerResponseInterceptor(
    resolve: <V>(value: V) => V | Promise<V>,
    reject: (error: any) => any
  ): number {
    return this.registerInterceptor("response", resolve, reject);
  }

  unregisterRequestInterceptor(interceptor: number): void {
    this.unregisterInterceptor("request", interceptor);
  }

  unregisterResponseInterceptor(interceptor: number): void {
    this.unregisterInterceptor("response", interceptor);
  }

  get<S = any, T = any>(
    url: string,
    options?: HttpClientRequestOptions
  ): RequestCaller<S, T> {
    return this.requestBuilder<S, T>("get", url, options);
  }

  post<S = any, T = any>(
    url: string,
    options?: HttpClientRequestOptions
  ): RequestCaller<S, T> {
    return this.requestBuilder<S, T>("post", url, options);
  }

  put<S = any, T = any>(
    url: string,
    options?: HttpClientRequestOptions
  ): RequestCaller<S, T> {
    return this.requestBuilder<S, T>("put", url, options);
  }

  delete<S = any, T = any>(
    url: string,
    options?: HttpClientRequestOptions
  ): RequestCaller<S, T> {
    return this.requestBuilder<S, T>("delete", url, options);
  }

  patch<S = any, T = any>(
    url: string,
    options?: HttpClientRequestOptions
  ): RequestCaller<S, T> {
    return this.requestBuilder<S, T>("patch", url, options);
  }

  request<S = any, T = any>(
    method: Method,
    url: string,
    data: S,
    options: HttpClientRequestOptions
  ): ApiPromise<T> {
    const {
      useBody,
      useSearchParams,
      onResp,
      onError,
      pathParams,
      ...restOptions
    } = options;
    let requestUrl = url;
    let reqData: any = data;

    const usePathParams = isObject(pathParams);
    const pathParamsData = usePathParams ? pathParams : data;
    if (usePathParams || isObject(pathParamsData)) {
      const { url: newUrl, keys: usedKeys } = processParameterizedUrl(
        url,
        pathParamsData as any
      );
      // exclude used data entries if we use original request data after formatting request url
      // TODO: find a way to make the data type unchanged, for example, an array, currently it will be change to object
      // which may be unexpected, and cause some error if the backend only accept array, so the omit logic now is omitted
      // if (!usePathParams) {
      //   reqData = omit(pathParamsData as Record<string, any>, usedKeys);
      // } else {
      //   reqData = { ...data };
      // }
      if (!usePathParams && usedKeys.length > 0 && isPlainObject(data)) {
        reqData = omit(pathParamsData as Record<string, any>, usedKeys);
      }
      requestUrl = newUrl;
    }
    let cancel: Canceler | undefined;
    restOptions.cancelToken = new axios.CancelToken((c) => {
      cancel = c;
    });

    let httpPromise: Promise<any>;
    if (isUseBodyMethod(method)) {
      httpPromise = this.inst[method as BodyMethod](
        requestUrl,
        reqData,
        restOptions
      );
    } else if (useBody) {
      restOptions.data = reqData;
      httpPromise = this.inst[method as NoBodyMethod](requestUrl, restOptions);
    } else {
      if (useSearchParams) {
        reqData = objectToUrlSearchParams(reqData);
      }
      restOptions.params = reqData;
      httpPromise = this.inst[method as NoBodyMethod](requestUrl, restOptions);
    }

    const resolve = onResp || this.onResp;
    const reject = onError || this.onError;
    if (resolve) httpPromise = httpPromise.then(resolve);
    if (reject)
      httpPromise = httpPromise.catch((e) => {
        reject?.(e, options);
      });

    httpPromise = wrapHttpPromise(httpPromise, { cancel });

    return httpPromise as ApiPromise<T>;
  }

  requestBuilder<S = any, T = any>(
    method: Method,
    url: string,
    options: HttpClientRequestOptions = {}
  ): RequestCaller<S, T> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    return function (
      this: HttpClient,
      data?: S,
      extendedOptions: HttpClientRequestOptions = {}
    ): ApiPromise<T> {
      const client = this instanceof HttpClient ? this : that;
      const newOptions = { ...options, ...extendedOptions };
      const newData = isFunction(client.beforeRequest)
        ? client.beforeRequest!(data, newOptions) || data
        : data;
      return client.request(method, url, newData, newOptions);
    };
  }
}

export { HttpClient };

export default HttpClient;
