"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function HomeActions() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return (
      <Link
        href="/dashboard"
        className="flex h-11 items-center justify-center rounded-md bg-black px-6 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Go to Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="flex h-11 items-center justify-center rounded-md bg-black px-6 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Sign In
      </Link>

      <Link
        href="/sign-up"
        className="flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-6 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        Create Account
      </Link>
    </>
  );
}