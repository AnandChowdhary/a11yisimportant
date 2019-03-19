interface SearchResult {
  statuses: Tweet[];
  search_metadata: SearchMeta;
}

interface SearchMeta {
  completed_in: number;
  max_id: number;
  next_results: string;
  query: string;
  refresh_url: string;
  count: number;
  since_id: number;
}

interface User {
  id_str: string;
  name: string;
  screen_name: string;
  location?: string;
  description?: string;
  url?: string;
  protected: boolean;
  followers_count: number;
  friends_count: number;
  listed_count: number;
  favourites_count: number;
  statuses_count: number;
  created_at: string;
  profile_image_url_https?: string;
  following: boolean;
  follow_request_sent: boolean;
}

interface Tweet {
  id_str: string;
  created_at: string;
  text: string;
  truncated: boolean;
  user: User;
  retweet_count: number;
  favorite_count: number;
  favorited: boolean;
  retweeted: boolean;
  possibly_sensitive: boolean;
  lang: string;
  retweeted_status?: Tweet;
  in_reply_to_status_id_str?: string;
}

export { SearchResult, SearchMeta, User, Tweet };
