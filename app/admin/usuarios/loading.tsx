import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[200px] mt-2" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="border rounded-md">
        <div className="p-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-[100px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
