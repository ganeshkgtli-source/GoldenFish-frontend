// FIX: was a completely empty file (0 bytes) — any import would crash
export default function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-border border-t-red-500 rounded-full animate-spin" />
        {text}
      </div>
    </div>
  );
}
