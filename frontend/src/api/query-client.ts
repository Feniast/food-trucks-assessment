import { Query, QueryCache, QueryClient } from "@tanstack/react-query";

type OnQueryErrorFn = (
  error: Error,
  query: Query<unknown, unknown, unknown>
) => void;

const onErrorFns: OnQueryErrorFn[] = [];

export const onQueryError = (fn: OnQueryErrorFn) => {
  onErrorFns.push(fn);

  return () => {
    const idx = onErrorFns.findIndex((v) => v === fn);
    if (idx >= 0) {
      onErrorFns.splice(idx, 1);
    }
  };
};

export const createQueryClient = () => {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        onErrorFns.forEach((fn) => {
          fn(error, query);
        });
      },
    }),
    defaultOptions: {
      queries: {
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 5_000,
        retry: 1,
      },
    },
  });
};
