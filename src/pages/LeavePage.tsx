import { LeaveBalanceChart } from "~/components/dashboard/LeaveBalanceChart";
import { LeaveHistoryTable } from "~/components/leave/LeaveHistoryTable";
import { LeaveRequestForm } from "~/components/leave/LeaveRequestForm";
import { mockApi } from "~/data/mockApi";
import { useAsync } from "~/hooks/useAsync";

const LeavePage = () => {
  const { data: balances, loading: balancesLoading } = useAsync(
    () => mockApi.getLeaveBalances(),
    [],
  );
  const {
    data: requests,
    loading: requestsLoading,
    refetch,
  } = useAsync(() => mockApi.getLeaveRequests(), []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Leave Requests
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Check your leave balance, apply for time off, and track past requests.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-1 space-y-5">
          <LeaveBalanceChart balances={balances} loading={balancesLoading} />
          <LeaveRequestForm onSubmitted={refetch} />
        </div>
        <div className="xl:col-span-2">
          <LeaveHistoryTable requests={requests} loading={requestsLoading} />
        </div>
      </div>
    </div>
  );
};

export default LeavePage;
