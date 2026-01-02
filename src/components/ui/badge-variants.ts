import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
      shadow: {
        none: "",
        gold: "shadow-elegant drop-shadow-[0_2px_6px_rgba(214,162,98,0.35)]",
        rose: "shadow-elegant drop-shadow-[0_2px_6px_rgba(188,75,81,0.35)]",
        champagne: "shadow-elegant drop-shadow-[0_2px_6px_rgba(233,205,164,0.35)]",
      },
    },
    defaultVariants: {
      variant: "default",
      shadow: "rose",
    },
  },
);
