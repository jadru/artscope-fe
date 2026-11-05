// AS-18: one rule for detail pages (article / profile / team) when their API call fails.
// Kept free of path aliases and framework imports so it is easy to unit-test.

export type DetailLoad<T> =
  | { status: 'ok'; data: T }
  | { status: 'not-found' }
  | { status: 'unavailable'; error: unknown };

/** HTTP status carried by a ServerApiError (`status`) or an axios error (`response.status`). */
export function errorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const e = error as { status?: unknown; response?: { status?: unknown } };
  if (typeof e.status === 'number') return e.status;
  if (typeof e.response?.status === 'number') return e.response.status;
  return undefined;
}

/** 404/410 mean the item does not exist; anything else (network, timeout, 5xx, 429…) is transient. */
export function isMissingStatus(status: number | undefined) {
  return status === 404 || status === 410;
}

/** An API answer that carries no item (empty body, non-object, or an empty object). */
export function isEmptyPayload(value: unknown) {
  return value === null || value === undefined || typeof value !== 'object' || Object.keys(value as object).length === 0;
}

export async function loadDetail<T>(fetcher: () => Promise<T>): Promise<DetailLoad<T>> {
  try {
    const data = await fetcher();
    return isEmptyPayload(data) ? { status: 'not-found' } : { status: 'ok', data };
  } catch (error) {
    return isMissingStatus(errorStatus(error)) ? { status: 'not-found' } : { status: 'unavailable', error };
  }
}

/** Robots for a page whose data could not be loaded: never index the placeholder. */
export const UNAVAILABLE_ROBOTS = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
} as const;

/** Thrown by a page when its data is temporarily unavailable; the (main) error boundary renders the retry UI. */
export class DetailUnavailableError extends Error {
  constructor(kind: string, cause: unknown) {
    super(`${kind} temporarily unavailable`, { cause });
    this.name = 'DetailUnavailableError';
  }
}
