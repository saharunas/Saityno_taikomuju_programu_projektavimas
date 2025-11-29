export type Post = {
  id: number;
  communityId: number;
  title: string;
  text: string;
  userId: number;
  creationDate?: string;
  authorUsername: string;
  canEdit: boolean;
};
