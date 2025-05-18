import { useEffect, useState } from "react";

type Breakpoint = "mobile" | "tablet" | "desktop";

export const useResponsive = (): Breakpoint => {
  const getBreakpoint = (): Breakpoint => {
    const width = window.innerWidth;
    if (width < 600) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  };

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint);

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};
