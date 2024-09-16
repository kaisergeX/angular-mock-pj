export interface UserSchema {
  id: string;
  username: string;
  password: string;
}

export type UserData = Omit<UserSchema, 'id' | 'password'>;
