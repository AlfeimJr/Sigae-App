export type HttpError = {
  headers: {
    normalizedNames: Record<string, string>;
    lazyUpdate: any | null;
  };
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  error: {
    code: string;
    message: string;
  };
};
