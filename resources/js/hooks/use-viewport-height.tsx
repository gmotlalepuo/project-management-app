import * as React from "react";

const COMPACT_HEIGHT = 500;

export function useViewportHeight() {
  const [isCompact, setIsCompact] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerHeight < COMPACT_HEIGHT);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isCompact;
}
