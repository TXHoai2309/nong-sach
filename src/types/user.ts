export interface User {
  id: string;
  email: string;
  name: string;
}

export interface RegisteredUser extends User {
  passwordHash: string; // Storing plain text password for local state/mock purposes
}
