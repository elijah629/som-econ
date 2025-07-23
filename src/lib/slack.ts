export interface SlackUserResponse {
  ok: boolean;
  profile: {
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
  };
}

export async function fetchUser(slackId: string): Promise<SlackUserResponse> {
  return await fetch(
    "https://slack.com/api/users.profile.get?user=" + slackId,
    {
      next: {
        revalidate: false
      },
      cache: "force-cache",
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT}`,
      },
    },
  ).then((x) => x.json());
}
