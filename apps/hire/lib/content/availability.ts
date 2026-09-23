import { availability } from "@/content/commercial";

export type AvailabilityState = "available" | "limited" | "booked";

export const availabilityCapacity = "1–2 projects per month";

export function getAvailabilityStatus(activeProjects: number): {
  state: AvailabilityState;
  label: string;
} {
  if (activeProjects === 0) return { state: "available", label: "Available" };
  if (activeProjects === 1) return { state: "limited", label: "Limited availability" };
  if (activeProjects === 2) return { state: "booked", label: "Booked" };
  throw new RangeError("Active projects must be between 0 and 2.");
}

export const availabilityStatus = getAvailabilityStatus(availability.activeProjects);
