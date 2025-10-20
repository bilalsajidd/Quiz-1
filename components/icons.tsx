import type { SVGProps } from "react";

export function CueMasterLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="hsl(var(--primary))" stroke="none" />
      <circle cx="12" cy="12" r="4" fill="hsl(var(--background))" stroke="none" />
      <text
        x="12"
        y="13.5"
        textAnchor="middle"
        fontSize="5"
        fontWeight="bold"
        fill="hsl(var(--primary))"
        className="font-headline"
      >
        8
      </text>
    </svg>
  );
}
