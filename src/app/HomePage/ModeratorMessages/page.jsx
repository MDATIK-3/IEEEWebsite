import ModeratorMessagesClient from './ModeratorMessagesClient';
import { getModeratorMessages } from '@/lib/queries';

export const revalidate = 86400;

export default async function ModeratorMessages() {
  const moderators = await getModeratorMessages();

  return <ModeratorMessagesClient moderators={moderators} />;
}
