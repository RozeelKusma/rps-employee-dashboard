import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import type { AppNotification } from "../../types";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success:
    "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200",
  error:
    "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200",
  warning:
    "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200",
  info: "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200",
};

const ICON_COLOR = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-indigo-500",
};

export function ToastStack({
  notifications,
  onDismiss,
}: {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-100 flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]">
      <AnimatePresence>
        {notifications.map((n) => {
          const Icon = ICONS[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex items-start gap-3 rounded-xl border shadow-lg backdrop-blur-sm p-3.5 ${STYLES[n.type]}`}
            >
              <Icon
                className={`w-5 h-5 mt-0.5 shrink-0 ${ICON_COLOR[n.type]}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{n.title}</p>
                <p className="text-xs mt-0.5 opacity-90 leading-snug">
                  {n.message}
                </p>
              </div>
              <button
                onClick={() => onDismiss(n.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
