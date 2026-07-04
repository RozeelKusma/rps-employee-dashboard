import { describe, it, expect } from "vitest";
import { generateAttendance, computeAttendanceSummary, generateLeaveBalances } from "../data/mockGenerators";

describe("generateAttendance", () => {
  it("generates one record per day up to today, inclusive", () => {
    const records = generateAttendance(10);
    expect(records.length).toBeGreaterThan(0);
    expect(records.length).toBeLessThanOrEqual(11);
  });

  it("marks Saturdays and Sundays as weekend", () => {
    const records = generateAttendance(30);
    const weekends = records.filter((r) => {
      const day = new Date(r.date).getDay();
      return day === 0 || day === 6;
    });
    weekends.forEach((r) => expect(r.status).toBe("weekend"));
  });

  it("never generates a record dated after today", () => {
    const records = generateAttendance(14);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    records.forEach((r) => {
      expect(new Date(r.date).getTime()).toBeLessThanOrEqual(today.getTime());
    });
  });

  it("is deterministic across calls (seeded, not Math.random)", () => {
    const a = generateAttendance(20);
    const b = generateAttendance(20);
    expect(a).toEqual(b);
  });

  it("attaches check-in/out times only to working statuses", () => {
    const records = generateAttendance(20);
    records.forEach((r) => {
      if (r.status === "present" || r.status === "late" || r.status === "half-day") {
        expect(r.checkIn).toBeDefined();
      } else {
        expect(r.checkIn).toBeUndefined();
      }
    });
  });
});

describe("computeAttendanceSummary", () => {
  it("counts working days as everything excluding weekends", () => {
    const records = generateAttendance(20);
    const summary = computeAttendanceSummary(records);
    const expectedWorkingDays = records.filter((r) => r.status !== "weekend").length;
    expect(summary.totalWorkingDays).toBe(expectedWorkingDays);
  });

  it("computes an attendance rate between 0 and 100", () => {
    const records = generateAttendance(30);
    const summary = computeAttendanceSummary(records);
    expect(summary.attendanceRate).toBeGreaterThanOrEqual(0);
    expect(summary.attendanceRate).toBeLessThanOrEqual(100);
  });

  it("returns zero attendance rate gracefully when there are no working days", () => {
    const summary = computeAttendanceSummary([{ date: "2026-01-03", status: "weekend" }]);
    expect(summary.attendanceRate).toBe(0);
    expect(summary.totalWorkingDays).toBe(0);
  });
});

describe("generateLeaveBalances", () => {
  it("ensures remaining equals total minus used for every leave type", () => {
    const balances = generateLeaveBalances();
    balances.forEach((b) => {
      expect(b.remaining).toBe(b.total - b.used);
    });
  });

  it("never returns a negative remaining balance", () => {
    const balances = generateLeaveBalances();
    balances.forEach((b) => expect(b.remaining).toBeGreaterThanOrEqual(0));
  });
});
