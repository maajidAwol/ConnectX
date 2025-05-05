import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Skeleton className="h-10 w-96 mb-4" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="h-[350px] w-full col-span-4" />
        <Skeleton className="h-[350px] w-full col-span-3" />
      </div>
    </div>
  )
}
