export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider animate-pulse">Loading Environment Data...</p>
      </div>
    </div>
  );
}
