export type Plan = "free" | "pro" | "max" | "team"

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 5,
  pro: 50,
  max: 1000,
  team: 10000,
}
