export default function RecipeSkeleton() {
  return (
    <div className="p-4 border-b border-gray-700 animate-pulse flex gap-4">
      <div className="h-20 w-20 bg-gray-600 rounded" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-600 w-1/2 rounded" />
        <div className="h-3 bg-gray-600 w-1/3 rounded" />
      </div>
      <div className="h-6 w-6 bg-gray-600 rounded" />
    </div>
  );
}
