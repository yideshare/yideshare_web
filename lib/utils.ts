/* Tailwind / shadcn class‑name joiner  */
export function cn(...inputs: (string | undefined | false | null)[]) {
    return inputs.filter(Boolean).join(" ");
  }
  