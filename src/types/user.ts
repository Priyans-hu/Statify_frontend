export type User = {
  user_id: string;
  role: string;
  org_id: string;
  username: string;
  org_slug: string;
  iat: number; // UNIX timestamp
  exp: number; // UNIX timestamp
};
