export interface GTagEvent {
  action: string;
  category: string;
  label: string;
  value?: number;
}

export type GtagFunction = {
  (command: "config", targetId: string, config: { page_path: string }): void;
  (
    command: "event",
    action: string,
    params: { [key: string]: string | number }
  ): void;
};

export interface WindowWithGTag extends Window {
  gtag?: GtagFunction;
}

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}
