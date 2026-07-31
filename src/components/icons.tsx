import type { SVGProps } from "react";

/**
 * Shared icon set. Every icon inherits `currentColor` and sizes from the
 * `className` the caller passes (e.g. `className="h-4 w-4"`). Decorative by
 * default (`aria-hidden`); pass `aria-hidden={false}` + a title/label when an
 * icon conveys meaning on its own.
 */

type IconProps = SVGProps<SVGSVGElement>;

const strokeDefaults = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.8,
  viewBox: "0 0 24 24",
} as const;

export function ArrowRightIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <path d="M19 12H5" />
      <path d="M11 5l-7 7 7 7" />
    </svg>
  );
}

export function SearchIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function MenuIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function CheckIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function ClockIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function SendIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

export function MapPinIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function GiftIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <rect height="4" rx="1" width="18" x="3" y="8" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 010-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 010 5" />
    </svg>
  );
}

export function SparkleIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} strokeWidth={1.6} {...props}>
      <path d="M12 3l1.9 5.8a2 2 0 001.3 1.3L21 12l-5.8 1.9a2 2 0 00-1.3 1.3L12 21l-1.9-5.8a2 2 0 00-1.3-1.3L3 12l5.8-1.9a2 2 0 001.3-1.3L12 3z" />
    </svg>
  );
}

export function PaletteIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <path d="M12 22a10 10 0 110-20 10 9 0 0110 9 5 5 0 01-5 5h-2.25a1.75 1.75 0 00-1.4 2.8l.3.4a1.75 1.75 0 01-1.4 2.8z" />
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
    </svg>
  );
}

export function HeartIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeDefaults} {...props}>
      <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
