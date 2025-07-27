export interface SlackUserResponse {
  ok: boolean;
  profile?: SlackProfile
}

export interface SlackProfile {

    /*title: string,
        phone: string,
        skype: string,
        real_name_normalized: string,*/
    real_name: string;
    display_name: string;
    /*display_name_normalized: string,
        fields: Record<string, {value: string, alt: string}>,
        status_text: string,
        status_emoji: string,
        status_emoji_display_info: [],
        status_expiration: number,
        avatar_hash: string,
        guest_invited_by: string,
        huddle_state: "default_unset" | string, // IDK possible values
        huddle_state_expiration_ts: number,
        first_name: string,
        last_name: string,*/
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
    image_512: string;
    // status_text_canonical: string
}

export async function fetchUser(slackId: string): Promise<SlackProfile> {
  const res: SlackUserResponse = await fetch(
    "https://slack.com/api/users.profile.get?user=" + slackId,
    {
      cache: "force-cache",
      next: { revalidate: 3600 },
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT}`,
      },
    },
  ).then((x) => x.json());

  if (!res.profile) {
    throw new Error("Profile not found / Ratelimited");
  }

  return res.profile;
}
