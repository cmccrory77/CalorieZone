import { QueryClient, QueryFunction } from "@tanstack/react-query";

function isCapacitor(): boolean {
  try {
    const w = window as any;
    if (w.Capacitor && w.Capacitor.isNativePlatform && w.Capacitor.isNativePlatform()) return true;
    if (window.location.protocol === "capacitor:") return true;
    if (window.location.protocol === "ionic:") return true;
    if (document.URL.includes("capacitor://") || document.URL.includes("ionic://")) return true;
    return false;
  } catch {
    return false;
  }
}

const NATIVE_API_BASE = "https://caloriezone.app";

export function resolveApiUrl(path: string): string {
  if (path.startsWith("http")) return path;
  if (isCapacitor()) return NATIVE_API_BASE + path;
  return path;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fullUrl = resolveApiUrl(url);
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const path = queryKey.join("/") as string;
    const fullUrl = resolveApiUrl(path);
    const res = await fetch(fullUrl);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
