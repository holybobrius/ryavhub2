export class UnauthError extends Error {
  type: string;

  constructor() {
    super();
    this.type = "UnauthError";
  }
}

export const isUnauthError = (e: unknown): e is UnauthError =>
  e instanceof UnauthError && e.type === "UnauthError";
