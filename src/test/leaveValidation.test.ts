import { describe, it, expect } from "vitest";
import { validateLeaveRequest } from "../lib/leaveValidation";

const validForm = {
  startDate: "2026-08-01",
  endDate: "2026-08-03",
  type: "Annual Leave" as const,
  reason: "Family vacation to the mountains",
};

describe("validateLeaveRequest", () => {
  it("returns no errors for a fully valid form", () => {
    expect(validateLeaveRequest(validForm)).toEqual({});
  });

  it("requires a start date", () => {
    const errors = validateLeaveRequest({ ...validForm, startDate: "" });
    expect(errors.startDate).toBeDefined();
  });

  it("requires an end date", () => {
    const errors = validateLeaveRequest({ ...validForm, endDate: "" });
    expect(errors.endDate).toBeDefined();
  });

  it("rejects an end date before the start date", () => {
    const errors = validateLeaveRequest({ ...validForm, startDate: "2026-08-10", endDate: "2026-08-05" });
    expect(errors.endDate).toMatch(/cannot be before/i);
  });

  it("allows a single-day leave request (start === end)", () => {
    const errors = validateLeaveRequest({ ...validForm, startDate: "2026-08-01", endDate: "2026-08-01" });
    expect(errors.endDate).toBeUndefined();
  });

  it("requires a reason", () => {
    const errors = validateLeaveRequest({ ...validForm, reason: "" });
    expect(errors.reason).toBeDefined();
  });

  it("requires the reason to have a minimum length", () => {
    const errors = validateLeaveRequest({ ...validForm, reason: "sick" });
    expect(errors.reason).toMatch(/more detail/i);
  });

  it("trims whitespace before validating the reason length", () => {
    const errors = validateLeaveRequest({ ...validForm, reason: "   sick   " });
    expect(errors.reason).toBeDefined();
  });
});
