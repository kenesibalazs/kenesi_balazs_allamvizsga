import 'express-session';

declare module 'express-session' {
  interface Session {
    user?: any; // Adjust the type as per your user object structure
  }
}
