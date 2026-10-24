// Shared number/scale helpers for the analytics charts. Plain JS so both the
// server panel and the client chart components can import it.

const compactFmt = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const fullFmt = new Intl.NumberFormat('en-US');

/** 1284 -> "1.3K", 2_400_000 -> "2.4M" (for tiles + axis ticks). */
export function compact(n) {
  return compactFmt.format(Number(n) || 0);
}

/** 1284 -> "1,284" (for tooltips + tables, where exact matters). */
export function full(n) {
  return fullFmt.format(Number(n) || 0);
}

/** Round a max value up to a clean 1/2/5 x 10^k axis bound (min 1). */
export function niceMax(max) {
  const m = Number(max) || 0;
  if (m <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(m)));
  const f = m / pow;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nice * pow;
}

/** Share of a total as a rounded percentage (0 when total is 0). */
export function pct(part, total) {
  const t = Number(total) || 0;
  if (t <= 0) return 0;
  return Math.round(((Number(part) || 0) / t) * 100);
}
