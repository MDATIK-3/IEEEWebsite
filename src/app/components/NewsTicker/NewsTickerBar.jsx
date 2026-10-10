import { getTickerItems } from "@/lib/queries";
import NewsTicker from "./NewsTicker";

/**
 * Server component for the news ticker.
 *
 * Seeds the client ticker with the cached, server-rendered items. We always
 * mount <NewsTicker> (even with zero items) so its polling can reveal the first
 * item the moment it reaches its scheduled start time; the client renders
 * nothing — no bar, no layout offset — until there is something to show.
 */
export default async function NewsTickerBar() {
  const items = await getTickerItems();
  return <NewsTicker items={items} />;
}
