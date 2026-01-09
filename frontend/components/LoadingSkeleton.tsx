export function PropertyCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-48 w-full bg-dark-lighter"></div>
      <div className="p-4">
        <div className="h-6 bg-dark-lighter rounded mb-2"></div>
        <div className="h-4 bg-dark-lighter rounded w-2/3 mb-3"></div>
        <div className="flex space-x-4">
          <div className="h-4 bg-dark-lighter rounded w-16"></div>
          <div className="h-4 bg-dark-lighter rounded w-16"></div>
          <div className="h-4 bg-dark-lighter rounded w-16"></div>
        </div>
      </div>
    </div>
  )
}

export function PropertyListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}
