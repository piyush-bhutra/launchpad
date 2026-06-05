export default function LoadingSpinner({ label = "Loading", fullscreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <span className="relative grid h-10 w-10 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </span>
      <span className="text-sm font-medium">{label}…</span>
    </div>
  );

  if (fullscreen) {
    return <div className="grid min-h-[60vh] place-items-center">{content}</div>;
  }
  return <div className="flex w-full items-center justify-center py-12">{content}</div>;
}
