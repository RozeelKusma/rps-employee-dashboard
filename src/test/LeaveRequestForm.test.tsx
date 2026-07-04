import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeaveRequestForm } from "../components/leave/LeaveRequestForm";
import { useNotificationStore } from "../store/notification.store";

const onSubmitted = vi.fn();

beforeEach(() => {
  onSubmitted.mockClear();
  useNotificationStore.setState({ notifications: [] });
});

describe("LeaveRequestForm validation", () => {
  it("shows all required field errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<LeaveRequestForm onSubmitted={onSubmitted} />);

    await user.click(screen.getByRole("button", { name: /submit request/i }));

    expect(await screen.findByText(/start date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/end date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/please provide a reason/i)).toBeInTheDocument();
    expect(onSubmitted).not.toHaveBeenCalled();
  });

  it("shows error when reason is too short", async () => {
    const user = userEvent.setup();
    render(<LeaveRequestForm onSubmitted={onSubmitted} />);

    await user.type(screen.getByPlaceholderText(/briefly describe/i), "short");
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    expect(await screen.findByText(/min 8 characters/i)).toBeInTheDocument();
  });

  it("shows error when end date is before start date", async () => {
    const user = userEvent.setup();
    render(<LeaveRequestForm onSubmitted={onSubmitted} />);

    const startInput = screen.getAllByDisplayValue("")[0];
    const endInput = screen.getAllByDisplayValue("")[1];

    await user.type(startInput, "2026-09-10");
    await user.type(endInput, "2026-09-05");
    await user.type(screen.getByPlaceholderText(/briefly describe/i), "Valid reason here");
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    expect(await screen.findByText(/end date cannot be before start date/i)).toBeInTheDocument();
  });
});

describe("LeaveRequestForm submission", () => {
  it("submits successfully, calls onSubmitted, and shows a success notification", async () => {
    const user = userEvent.setup();
    render(<LeaveRequestForm onSubmitted={onSubmitted} />);

    const [startInput, endInput] = screen.getAllByDisplayValue("");
    await user.type(startInput, "2026-08-01");
    await user.type(endInput, "2026-08-03");
    await user.type(screen.getByPlaceholderText(/briefly describe/i), "Family gathering out of town");
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));

    const { notifications } = useNotificationStore.getState();
    expect(notifications.some((n) => n.type === "success")).toBe(true);
  });

  it("resets the form after successful submission", async () => {
    const user = userEvent.setup();
    render(<LeaveRequestForm onSubmitted={onSubmitted} />);

    const [startInput, endInput] = screen.getAllByDisplayValue("");
    await user.type(startInput, "2026-08-01");
    await user.type(endInput, "2026-08-03");
    await user.type(screen.getByPlaceholderText(/briefly describe/i), "Family gathering out of town");
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => expect(onSubmitted).toHaveBeenCalled());

    expect(screen.getByPlaceholderText(/briefly describe/i)).toHaveValue("");
  });

  it("renders all leave type options in the select", () => {
    render(<LeaveRequestForm onSubmitted={onSubmitted} />);

    const select = screen.getByRole("combobox");
    const options = Array.from((select as HTMLSelectElement).options).map((o) => o.value);

    expect(options).toContain("Annual Leave");
    expect(options).toContain("Sick Leave");
    expect(options).toContain("Casual Leave");
    expect(options).toContain("Maternity/Paternity");
    expect(options).toContain("Unpaid Leave");
  });

  it("defaults leave type to Annual Leave", () => {
    render(<LeaveRequestForm onSubmitted={onSubmitted} />);
    expect(screen.getByRole("combobox")).toHaveValue("Annual Leave");
  });
});
