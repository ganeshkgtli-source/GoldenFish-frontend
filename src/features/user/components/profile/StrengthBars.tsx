type Props = {
  isStrong: boolean;
  exactMatch: boolean;
  partialMatch: boolean;
  matchPct: number;
  confirmPassword: string;
  newPassword: string;
};

export default function StrengthBars({
  isStrong,
  exactMatch,
  partialMatch,
  matchPct,
  confirmPassword,
  newPassword,
}: Props) {

  const strength = !newPassword.length
    ? 0
    : newPassword.length < 6
      ? 1
      : newPassword.length < 8
        ? 2
        : isStrong
          ? 4
          : 3;

  const bars = [
    strength >= 1
      ? strength === 1
        ? "bg-red-500"
        : strength === 2
          ? "bg-yellow-500"
          : "bg-green-500"
      : "bg-muted",

    strength >= 2
      ? strength === 2
        ? "bg-yellow-500"
        : "bg-green-500"
      : "bg-muted",

    strength >= 3
      ? "bg-green-500"
      : "bg-muted",

    strength >= 4
      ? "bg-green-500"
      : "bg-muted",
  ];

  const strengthLabel = [
    "",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ][strength];

  return (
    <div className="space-y-2">

      <div className="flex gap-1">

        {bars.map((b, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${b}`}
          />
        ))}

      </div>

      <div className="flex justify-between text-xs">

        <span className="text-muted-foreground">

          {strength > 0 ? (
            <span
              className={
                strength <= 1
                  ? "text-red-500"
                  : strength === 2
                    ? "text-yellow-500"
                    : "text-green-500"
              }
            >
              {strengthLabel}
            </span>
          ) : (
            "Password strength"
          )}

        </span>

        {confirmPassword && (
          <span
            className={
              exactMatch
                ? "text-green-500"
                : partialMatch
                  ? "text-yellow-500"
                  : "text-red-500"
            }
          >
            {exactMatch
              ? "Passwords match"
              : partialMatch
                ? `${matchPct}% match`
                : "Passwords do not match"}
          </span>
        )}

      </div>
    </div>
  );
}