import type { ReactElement, ReactNode } from "react";

function Lucide({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}): ReactElement {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const CheckIcon = ({
  className,
}: {
  className: string;
}): ReactElement => (
  <Lucide className={className}>
    <path d="M20 6 9 17l-5-5" />
  </Lucide>
);

export const XIcon = ({ className }: { className: string }): ReactElement => (
  <Lucide className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Lucide>
);

export const ChevronsUpDownIcon = ({
  className,
}: {
  className: string;
}): ReactElement => (
  <Lucide className={className}>
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </Lucide>
);

export const HashIcon = ({
  className,
}: {
  className: string;
}): ReactElement => (
  <Lucide className={className}>
    <line x1="4" x2="20" y1="9" y2="9" />
    <line x1="4" x2="20" y1="15" y2="15" />
    <line x1="10" x2="8" y1="3" y2="21" />
    <line x1="16" x2="14" y1="3" y2="21" />
  </Lucide>
);

export const MessageCircleIcon = ({
  className,
}: {
  className: string;
}): ReactElement => (
  <Lucide className={className}>
    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
  </Lucide>
);

export const PlusIcon = ({
  className,
}: {
  className: string;
}): ReactElement => (
  <Lucide className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Lucide>
);
