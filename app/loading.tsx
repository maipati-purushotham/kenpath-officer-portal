import { LuLoader } from "react-icons/lu";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="text-center">
        <LuLoader className="mx-auto h-8 w-8 animate-spin text-primary-600" />
        <p className="mt-3 text-sm text-neutral-500">లోడ్ అవుతోంది…</p>
      </div>
    </div>
  );
}
