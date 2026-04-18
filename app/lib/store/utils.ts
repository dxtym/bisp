export async function fetchApi<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const result = await res.json();
  if (!result.success) throw new Error(result.message ?? result.error);
  return result.data as T;
}
