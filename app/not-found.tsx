import Link from "next/link";
import { LuFileQuestion, LuArrowLeft } from "react-icons/lu";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="card max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
          <LuFileQuestion className="h-7 w-7 text-neutral-500" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-800">404</h1>
        <p className="mt-1 text-sm text-neutral-600">పేజీ కనుగొనబడలేదు</p>
        <Link href="/dashboard" className="btn-primary mt-6">
          <LuArrowLeft className="h-4 w-4" />
          డాష్‌బోర్డ్‌కు తిరిగి వెళ్లు
        </Link>
      </div>
    </div>
  );
}
