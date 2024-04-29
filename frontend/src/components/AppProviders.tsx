import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { createQueryClient } from "~/api/query-client";

export interface AppProvidersProps {
  children?: React.ReactNode;
}

export default function AppProviders(props: AppProvidersProps) {
  const { children } = props;
  const [queryClient] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
