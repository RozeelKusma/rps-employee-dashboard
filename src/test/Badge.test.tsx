import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Badge,
  leaveStatusTone,
  announcementTone,
} from "../components/ui/Badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge tone="success">Approved</Badge>);
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });
});

describe("leaveStatusTone", () => {
  it("maps known statuses to the correct tone", () => {
    expect(leaveStatusTone("Approved")).toBe("success");
    expect(leaveStatusTone("Pending")).toBe("warning");
    expect(leaveStatusTone("Rejected")).toBe("error");
  });

  it("falls back to neutral for unknown statuses", () => {
    expect(leaveStatusTone("Unknown")).toBe("neutral");
  });
});

describe("announcementTone", () => {
  it("maps Urgent to error tone", () => {
    expect(announcementTone("Urgent")).toBe("error");
  });

  it("maps Holiday to success tone", () => {
    expect(announcementTone("Holiday")).toBe("success");
  });

  it("falls back to neutral for unrecognized categories", () => {
    expect(announcementTone("Something Else")).toBe("neutral");
  });
});
