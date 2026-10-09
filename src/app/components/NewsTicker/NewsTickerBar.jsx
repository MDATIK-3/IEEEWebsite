import { getTickerItems } from "@/lib/queries";
import NewsTicker from "./NewsTicker";

/**
 * Server component for the news ticker.
 *
 * Fetches ticker items (cached in `@/lib/queries`) and renders nothing when
 * there is no content, so the bar — and its layout offset — only appear when
 * there is something to show.
 */
export default async function NewsTickerBar() {
  const items = await getTickerItems();
  if (!items.length) return null;
  return <NewsTicker items={items} />;
}
