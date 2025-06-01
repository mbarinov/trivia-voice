import { useState, useEffect } from "react";

interface ScreenSize {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

export function useResponsive(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024, // Default to desktop
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        width,
      });
    };

    // Set initial size
    updateScreenSize();

    // Listen for resize events
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return screenSize;
}

// Utility function for getting responsive values
export function getResponsiveValue<T>(
  mobileValue: T,
  tabletValue: T,
  desktopValue: T,
  screenSize: ScreenSize
): T {
  if (screenSize.isMobile) return mobileValue;
  if (screenSize.isTablet) return tabletValue;
  return desktopValue;
}
