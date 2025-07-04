export class ServerError extends Error {
    public statusCode: number;
  
    constructor(message: string, statusCode: number = 500) {
      super(message);
      this.name = "ServerError";
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor); 
    }
  }