
import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 768);
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    isDesktop: !isMobile,
    screenWidth,
    isXs: screenWidth < 480,
    isSm: screenWidth >= 480 && screenWidth < 768,
    isMd: screenWidth >= 768 && screenWidth < 1024,
    isLg: screenWidth >= 1024 && screenWidth < 1280,
    isXl: screenWidth >= 1280,
    // Breakpoint helpers
    isMobileOrTablet: screenWidth < 1024,
    isTabletOrDesktop: screenWidth >= 768
  };
};
