import type { LeaveType } from "../types";

export interface LeaveRequestFormInput {
  startDate: string;
  endDate: string;
  type: LeaveType;
  reason: string;
}

export type LeaveRequestFormErrors = Partial<Record<keyof LeaveRequestFormInput, string>>;

/**
 * Validates a leave request form. Pure function (no DOM/state), so it's
 * fully unit-testable independent of the React component that uses it.
 */
export function validateLeaveRequest(form: LeaveRequestFormInput): LeaveRequestFormErrors {
  const errors: LeaveRequestFormErrors = {};

  if (!form.startDate) errors.startDate = "Start date is required";
  if (!form.endDate) errors.endDate = "End date is required";

  if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
    errors.endDate = "End date cannot be before start date";
  }

  const trimmedReason = form.reason.trim();
  if (!trimmedReason) {
    errors.reason = "Please provide a reason";
  } else if (trimmedReason.length < 8) {
    errors.reason = "Please provide a bit more detail (min 8 characters)";
  }

  return errors;
}
