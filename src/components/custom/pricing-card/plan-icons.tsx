import * as React from "react";

interface PlanIconProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

const CompactCarIcon = React.forwardRef<SVGSVGElement, PlanIconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 30 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse cx="25.2" cy="14.72" rx="3.33" ry="3.03" fill="white" />
      <path
        d="M25.12 11.21c-1.95 0-3.5 1.56-3.5 3.5 0 1.95 1.55 3.5 3.5 3.5 1.94 0 3.5-1.55 3.5-3.5 0-1.94-1.56-3.5-3.5-3.5zm0 5.45c-1.09 0-2.02-.93-2.02-2.02s.93-2.02 2.02-2.02 2.02.93 2.02 2.02-.93 2.02-2.02 2.02z"
        stroke="#2BBAC8"
        strokeLinejoin="round"
      />
      <ellipse cx="4.09" cy="14.72" rx="3.33" ry="3.03" fill="white" />
      <path
        d="M4.26 11.21c-1.95 0-3.5 1.56-3.5 3.5 0 1.95 1.55 3.5 3.5 3.5 1.94 0 3.5-1.55 3.5-3.5 0-1.94-1.56-3.5-3.5-3.5zm0 5.45c-1.09 0-2.02-.93-2.02-2.02s.93-2.02 2.02-2.02 2.02.93 2.02 2.02-.93 2.02-2.02 2.02z"
        stroke="#2BBAC8"
        strokeLinejoin="round"
      />
      <path
        d="M28.85 12.38c-.08-.16-.31-.31-.39-.47-.16-.39-.16-1.09-.23-1.48-.31-1.17-1.17-2.02-2.02-2.72-1.64-1.25-3.66-2.57-5.45-3.74C18 2.11 15.85.78 12.35.63c-1.79-.08-4.51 0-6.23.23-.15 0-1.4.31-1.24.62 1.25.23.55.93.24 1.63-.31.62-1.09 2.49-1.64 2.8-.15 0-.23.08-.31 0-.23-.31.16-1.4.31-1.71.16-.47.86-1.4.93-1.79 0-.31 0-.7-.39-.62L2.62 4.75c-.62 1.17-.62 2.18-.78 3.42-.15 1.56-1.09 2.88-1.24 4.36 0 .16 0 .39 0 .54.08.31.23.31.47.08.54-1.17 1.71-2.02 3.11-2.02 1.4 0 3.5 1.56 3.5 3.5s-.08 1.86-.23 2.25l.85-.08h11.75c.78-.08 1.4-.47 1.56-1.24 0-1.79 1.56-3.35 3.5-3.35 1.95 0 3.5 1.56 3.5 3.5 0 1.95-.16.93 0 1.09 1.09-.54.86-2.57.23-3.35v-.08z"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M10.02 1.41c3.81-.23 8.56 1.4 11.44 3.89 2.88 2.49 1.79 1.64.16 1.79-3.58-.31-7.16-.62-10.74-.93-.86 0-2.65 0-3.27-.47-.62-.47-.54-1.87-.23-2.72.54-1.25 1.4-1.48 2.64-1.56z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
);
CompactCarIcon.displayName = "CompactCarIcon";

const SedanCarIcon = React.forwardRef<SVGSVGElement, PlanIconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 31 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse cx="24.98" cy="9.51" rx="2.19" ry="2.56" fill="white" />
      <path
        d="M24.8 7.16c-1.33 0-2.38 1.09-2.38 2.45 0 1.37 1.05 2.46 2.38 2.46 1.33 0 2.38-1.09 2.38-2.46 0-1.36-1.05-2.45-2.38-2.45zm0 3.82c-.74 0-1.38-.66-1.38-1.42 0-.76.64-1.42 1.38-1.42.74 0 1.38.66 1.38 1.42 0 .76-.64 1.42-1.38 1.42z"
        stroke="#2BBAC8"
        strokeLinejoin="round"
      />
      <ellipse cx="6.33" cy="9.51" rx="2.19" ry="2.56" fill="white" />
      <path
        d="M6.32 7.16c-1.32 0-2.38 1.09-2.38 2.45 0 1.37 1.06 2.46 2.38 2.46 1.33 0 2.39-1.09 2.39-2.46 0-1.36-1.06-2.45-2.39-2.45zm0 3.82c-.74 0-1.38-.66-1.38-1.42 0-.76.64-1.42 1.38-1.42.74 0 1.38.66 1.38 1.42 0 .76-.64 1.42-1.38 1.42z"
        stroke="#2BBAC8"
        strokeLinejoin="round"
      />
      <path
        d="M29.7 7.79l-.24.81c0 .08-.16.4-.23.49-.24.16-1.97.57-2.05.49.24-1.22-.47-2.6-1.57-3 -2.05-.81-4.09 1.05-3.54 3.24H8.99v-.81c0-.32-.39-1.05-.55-1.3C7.03 5.6 4.27 6.33 3.8 8.6c-.47 2.27 0 .49 0 .49l-2.28-.41C.81 8.27.49 7.14.73 6.33c.23-.81.39-.57.39-.73.08-.49-.16-1.62.16-2.03.31-.4 1.97-.4 2.44-.57 1.42-.4 2.76-1.22 4.17-1.62 2.91-.89 6.61-1.05 9.53 0 2.91 1.05 3.7 1.95 5.51 2.51 1.81.57 4.09.65 5.83 1.62 1.73.97.62 1.05.93 1.78v.57z"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M13.48 1.38l.63 2.6 4.8.16c0-.32 0-.64.32-.89-1.58-1.38-3.78-1.78-5.83-1.87h.08z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M8.99 1.87s-.63.97-.63 1.05c0 .16.16.65.24.81l4.41.16-.39-2.51c-.87 0-1.81 0-2.68.16-.87.16-.87.16-.95.24v.09z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M6.08 3.81h1.18l1.26-1.78c-.47.32-2.2.81-2.36 1.3-.16.49 0 .32 0 .49h-.08z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
);
SedanCarIcon.displayName = "SedanCarIcon";

const SuvCarIcon = React.forwardRef<SVGSVGElement, PlanIconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 32 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse cx="25.57" cy="11.14" rx="2.65" ry="2.78" fill="white" />
      <ellipse cx="9.12" cy="11.14" rx="2.89" ry="2.78" fill="white" />
      <path
        d="M25.32 8.18c-1.61 0-2.9 1.3-2.9 2.94 0 1.63 1.29 2.93 2.9 2.93 1.62 0 2.9-1.3 2.9-2.93 0-1.64-1.28-2.94-2.9-2.94zm0 4.57c-.9 0-1.68-.78-1.68-1.7 0-.91.78-1.69 1.68-1.69.9 0 1.68.78 1.68 1.7 0 .91-.78 1.69-1.68 1.69z"
        stroke="#2BBAC8"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <ellipse cx="9.14" cy="11.09" rx="1.4" ry="1.37" fill="white" />
      <path
        d="M8.96 8.18c-1.61 0-2.9 1.3-2.9 2.94 0 1.63 1.29 2.93 2.9 2.93 1.61 0 2.9-1.3 2.9-2.93 0-1.64-1.29-2.94-2.9-2.94zm0 4.57c-.9 0-1.68-.78-1.68-1.7 0-.91.78-1.69 1.68-1.69.9 0 1.68.78 1.68 1.7 0 .91-.78 1.69-1.68 1.69z"
        stroke="#2BBAC8"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M30.6 10.78l-.26.99c-.3 1-.36.56-1.09.64.48-3.15-2.66-5.79-5.13-3.7-.43.37-1.18 1.52-1.18 2.1v1.5H12.06c.33-2.62-1.84-5.01-4.24-4.06-1.53.61-2.13 2.39-1.98 4.06-1.61-.14-3.18.68-3.39-1.7-.05-.6.07-1.21-.04-1.8-.65-.34-1.63.37-1.75-.77C.57 7.13.59 4.97.67 4.03c.03-.33.06-.79.43-.87.28-.06 1.83-.08 1.83.26v1.49l.29-.06c.67-1.75.59-3.97 2.76-4.15 3.76-.3 7.87.23 11.67.02 1.75.22 4.02 3.02 5.39 4.18 1.24.15 2.5.24 3.73.44.5.09 1.95.3 2.31.56.7.49.57 2.79.67 2.91.02.03.37.04.56.26.19.23.12.47.28.67v1.03z"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M14.32 1.53c.25 1.41.16 2.98.61 4.32h6.22l.1-.21c-.48-1.34-1.41-2.72-2.51-3.53-.15-.11-.86-.59-.98-.59h-3.44z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M9.71 1.53l-.19 4.32h4.33c-.17-1.3-.17-2.78-.38-4.06-.02-.12-.04-.2-.14-.26H9.71z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M8.58 5.84l.29-4.07-.09-.31c-1.1.07-2.89-.32-3.46.95-.23.51-.74 2.67-.74 3.2 0 .12.01.13.1.21h3.91v-.01z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
);
SuvCarIcon.displayName = "SuvCarIcon";

export { CompactCarIcon, SedanCarIcon, SuvCarIcon };
