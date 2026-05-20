import { useEffect, useState } from "react";

type Props = {
  onResend: () => void;
  isPending: boolean;
};

export default function OtpTimer({
  onResend,
  isPending,
}: Props) {
  const [timer, setTimer] = useState(60);

  const canResend = timer <= 0;

  useEffect(() => {
    if (timer <= 0) return;

    const t = setTimeout(() => {
      setTimer((n) => n - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [timer]);

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        {canResend
          ? "Didn't receive it?"
          : `Resend in ${timer}s`}
      </span>

      <button
        onClick={() => {
          onResend();
          setTimer(60);
        }}
        disabled={!canResend || isPending}
        className={`font-medium transition ${
          canResend
            ? "text-red-500 hover:underline"
            : "text-muted-foreground cursor-not-allowed"
        }`}
      >
        {isPending ? "Sending…" : "Resend OTP"}
      </button>
    </div>
  );
}