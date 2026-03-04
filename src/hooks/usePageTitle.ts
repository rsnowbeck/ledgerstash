import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} | LedgerStash` : "LedgerStash";
    document.title = fullTitle;
    return () => {
      document.title = "LedgerStash";
    };
  }, [title]);
}
