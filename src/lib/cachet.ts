export interface CachetUser {
  id: string;
  expiration: string; // Date
  user: string;
  displayName: string;
  pronouns: string;
  image: string; // URL, 512x512
}

const BASE_URL = "https://cachet.dunkirk.sh";
const REQUEST_INIT: NextFetchRequestConfig & RequestInit = {
  cache: "force-cache",
  next: { revalidate: 5 * 60 },
};

// yeah this is all we need... full docs @ https://cachet.dunkirk.sh/swagger
export async function fetchCachetUser(slackId: string): Promise<CachetUser> {
  const REQUEST_URL = `/users/${slackId}`;

  return (await fetch(BASE_URL + REQUEST_URL, REQUEST_INIT).then((x) =>
    x.json(),
  )) as CachetUser;
}
