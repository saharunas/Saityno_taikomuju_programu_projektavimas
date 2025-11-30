export type User = {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  role: "Guest" | "Member" | "Admin";
  isBlocked: boolean;
};
