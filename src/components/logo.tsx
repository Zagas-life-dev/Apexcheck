import Image from "next/image";

export function Logo({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      width={416}
      height={438}
      alt="Apexcheck"
      className={className}
      priority={priority}
    />
  );
}
