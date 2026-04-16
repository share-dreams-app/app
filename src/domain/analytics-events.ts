export const MVP_ANALYTICS_EVENT_TYPES = [
  "dream_created",
  "task_created",
  "checkin_submitted",
  "supporter_invited",
  "support_interaction",
  "task_completed",
  "dream_completed",
  "reward_defined",
  "reward_completed",
  "reward_ai_suggested",
  "reward_ai_accepted",
  "weekly_active_user"
] as const;

export type MvpAnalyticsEventType = (typeof MVP_ANALYTICS_EVENT_TYPES)[number];

export type AnalyticsEventPayload = Record<string, string | number | boolean | null>;
