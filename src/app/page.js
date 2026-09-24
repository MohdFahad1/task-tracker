import Link from "next/link";
import HomeActions from "../components/home/HomeActions";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Task Tracker
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            Manage your tasks, track your time, and understand your daily
            productivity — all in one place.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <HomeActions />
        </div>

        <div className="mt-16 grid gap-4 text-left sm:grid-cols-3">
          <Feature
            title="Manage Tasks"
            description="Create, update, complete, and organize your tasks."
          />

          <Feature
            title="Track Time"
            description="Start and stop timers and keep detailed time logs."
          />

          <Feature
            title="Daily Summary"
            description="See how much time you tracked and what you accomplished."
          />
        </div>
      </div>
    </main>
  );
}

function Feature({ title, description }) {
  return (
    <div className="rounded-xl border bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="font-semibold">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}