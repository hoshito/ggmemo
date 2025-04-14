import { GTagEvent } from "@/types/gtag";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", GA_MEASUREMENT_ID as string, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window.gtag !== "undefined") {
    const params: { [key: string]: string | number } = {
      event_category: category,
      event_label: label,
    };

    if (typeof value !== "undefined") {
      params.value = value;
    }

    window.gtag("event", action, params);
  }
};

// カスタムイベント用の関数
export const trackMemoEvent = (
  action: "create" | "edit" | "delete",
  memoId: string
) => {
  event({
    action: `memo_${action}`,
    category: "Memo",
    label: memoId,
  });
};

export const trackResultEvent = (result: "win" | "lose", gameId: string) => {
  event({
    action: "result_record",
    category: "Game Result",
    label: `${gameId}_${result}`,
  });
};
