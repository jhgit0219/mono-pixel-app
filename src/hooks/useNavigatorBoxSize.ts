import { useEffect, useState } from "react";

export function useNavigatorBoxSize(canvasWidth: number, canvasHeight: number) {
  const [navBoxSize, setNavBoxSize] = useState({ width: 300, height: 300 });

  useEffect(() => {
    function handleResize() {
      const maxNavBoxWidth = window.innerWidth / 2;
      const maxNavBoxHeight = window.innerHeight / 2;
      const aspect = canvasWidth / canvasHeight || 1;

      let navigatorWidth = maxNavBoxWidth;
      let navigatorHeight = navigatorWidth / aspect;

      if (navigatorHeight > maxNavBoxHeight) {
        navigatorHeight = maxNavBoxHeight;
        navigatorWidth = navigatorHeight * aspect;
      }

      setNavBoxSize({
        width: navigatorWidth,
        height: navigatorHeight,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasWidth, canvasHeight]);

  return navBoxSize;
}
