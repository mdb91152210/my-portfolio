// --- Dummy API functions for a static portfolio (no backend) ---

function updateLocal(key: string, value: number) {
  if (typeof window === 'undefined') return;
  const prev = Number(localStorage.getItem(key) || 0);
  localStorage.setItem(key, String(prev + value));
}

export function postView({ slug }: { slug: string }) {
  updateLocal(`views-${slug}`, 1);
  return Promise.resolve({ ok: true });
}

export function postShare({ slug }: { slug: string }) {
  updateLocal(`shares-${slug}`, 1);
  return Promise.resolve({ ok: true });
}

export function postReaction({
  slug,
  type,
  count,
}: {
  slug: string;
  type: string;
  count: number;
}) {
  updateLocal(`reactions-${slug}-${type}`, count);
  return Promise.resolve({ ok: true });
}
