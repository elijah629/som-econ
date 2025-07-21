export interface CachetUser {
  id: string,
  expiration: string, // Date
  user: string,
  displayName: string,
  pronouns: string,
  image: string, // URL
}

const BASE_URL = "https://cachet.dunkirk.sh";
const REQUEST_INIT: RequestInit = { cache: "force-cache" };

// yeah this is all we need... full docs @ https://cachet.dunkirk.sh/swagger
export async function user(slackId: string): Promise<CachetUser> {
  const REQUEST_URL = `/users/${slackId}`;

  return await fetch(BASE_URL + REQUEST_URL, REQUEST_INIT).then(x => x.json()) as CachetUser;
}
