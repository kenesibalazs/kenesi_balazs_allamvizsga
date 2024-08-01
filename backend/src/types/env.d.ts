// types/env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      SESSION_SECRET: string;
      MONGODB_URI: string;
      PORT?: string;
      JWT_SECRET?: string;
    }
  }
  