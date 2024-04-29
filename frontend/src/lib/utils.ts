import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isString = (value: unknown): value is string => {
  return Object.prototype.toString.call(value) === "[object String]";
};

export const isPlainObject = (value: unknown): boolean => {
  if (
    !value ||
    typeof value !== "object" ||
    {}.toString.call(value) !== "[object Object]"
  ) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const Ctor =
    {}.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return (
    typeof Ctor == "function" &&
    Ctor instanceof Ctor &&
    Function.prototype.toString.call(Ctor) ===
      Function.prototype.toString.call(Object)
  );
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: unknown): value is Function => {
  return Object.prototype.toString.call(value) === "[object Function]";
};

export const isObject = (value: unknown): value is object => {
  return typeof value === "object" && value != null;
};

export const removeEndSlash = (s: string) => s.replace(/\/+$/, "");

export const ensureStartSlash = (s: string) =>
  s.startsWith("/") ? s : "/" + s;

export const concatUrl = (parent: string, child: string | string[]) => {
  const c = Array.isArray(child) ? child[0] : child;
  if (typeof c === "undefined") return parent;
  return removeEndSlash(parent) + ensureStartSlash(c);
};

export const isBlank = (str: string | null | undefined) => {
  return !str || str.trim().length === 0;
};
