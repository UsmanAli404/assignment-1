import { useState, useEffect } from "react";

function useIsDesktop(breakpoint = 768) {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkIsDesktop = () => {
            setIsDesktop(window.innerWidth > breakpoint);
        };

        checkIsDesktop();
        window.addEventListener("resize", checkIsDesktop);

        return () => window.removeEventListener("resize", checkIsDesktop);
    }, [breakpoint]);

    return isDesktop;
}

export default useIsDesktop;