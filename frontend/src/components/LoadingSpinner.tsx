export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
    </div>
  )
}
