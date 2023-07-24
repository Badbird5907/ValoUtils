import { useEffect, useRef } from "react";

function useIsFirstRender() {
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = false;
  }, []);

  return mountedRef.current;
}
export default useIsFirstRender;