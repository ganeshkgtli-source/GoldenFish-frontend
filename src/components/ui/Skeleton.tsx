type Props = {
  className?: string;
};

export default function Skeleton({
  className = "",
}: Props) {
  return (
    <div
      className={`
        animate-pulse
        rounded-md
        bg-white/[0.06]
        ${className}
      `}
    />
  );
}