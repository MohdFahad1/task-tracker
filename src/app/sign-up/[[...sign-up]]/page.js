import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-[100vh] items-center justify-center p-4">
      <SignUp fallbackRedirectUrl="/dashboard" />
    </div>
  );
}