export {};

declare global {
  interface Window {
    __PW_RENDERED__?: {
      id: string | null;
      text: string;
    }[];
  }
}
    