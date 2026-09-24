import { cn } from '@/lib/utils' // Assuming you have a class merger, if not, standard template literals work too

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200/80', className)}
      {...props}
    />
  )
}
