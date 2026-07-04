import { useState } from "react";
import { CalendarPlus, Send } from "lucide-react";
import type { LeaveType } from "../../types";
import { Card, CardHeader } from "../ui/Card";
import { mockApi } from "../../data/mockApi";
import { useNotificationStore } from "~/store/notification.store";
import Button from "../ui/Button";

const LEAVE_TYPES: LeaveType[] = [
  "Annual Leave",
  "Sick Leave",
  "Casual Leave",
  "Maternity/Paternity",
  "Unpaid Leave",
];

interface FormState {
  startDate: string;
  endDate: string;
  type: LeaveType;
  reason: string;
}

const emptyForm: FormState = {
  startDate: "",
  endDate: "",
  type: "Annual Leave",
  reason: "",
};

export function LeaveRequestForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const notify = useNotificationStore((state) => state.notify);

  const today = new Date().toISOString().split("T")[0];

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.startDate) next.startDate = "Start date is required";
    if (!form.endDate) next.endDate = "End date is required";
    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) < new Date(form.startDate)
    ) {
      next.endDate = "End date cannot be before start date";
    }
    if (!form.reason.trim()) next.reason = "Please provide a reason";
    else if (form.reason.trim().length < 8)
      next.reason = "Please provide a bit more detail (min 8 characters)";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await mockApi.submitLeaveRequest(form);
      notify(
        "success",
        "Leave request submitted",
        `Your ${form.type.toLowerCase()} request from ${form.startDate} to ${form.endDate} is now pending approval.`,
      );
      setForm(emptyForm);
      onSubmitted();
    } catch {
      notify(
        "error",
        "Submission failed",
        "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow";

  return (
    <Card>
      <CardHeader
        title="New Leave Request"
        subtitle="Fill in the details below"
        icon={<CalendarPlus className="w-4.5 h-4.5" />}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              Start Date
            </label>
            <input
              type="date"
              min={today}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className={`${inputClass} ${errors.startDate ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
            />
            {errors.startDate && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.startDate}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              End Date
            </label>
            <input
              type="date"
              min={form.startDate || today}
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className={`${inputClass} ${errors.endDate ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
            />
            {errors.endDate && (
              <p className="text-[11px] text-red-500 mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
            Leave Type
          </label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as LeaveType })
            }
            className={`${inputClass} border-slate-200 dark:border-slate-700`}
          >
            {LEAVE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
            Reason
          </label>
          <textarea
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            rows={3}
            placeholder="Briefly describe the reason for your leave..."
            className={`${inputClass} resize-none ${errors.reason ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
          />
          {errors.reason && (
            <p className="text-[11px] text-red-500 mt-1">{errors.reason}</p>
          )}
        </div>

        <Button
          type="submit"
          loading={submitting}
          leftIcon={<Send className="w-4 h-4" />}
          className="w-full"
        >
          Submit Request
        </Button>
      </form>
    </Card>
  );
}
