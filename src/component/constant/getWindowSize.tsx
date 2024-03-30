import { useState, useLayoutEffect } from "react";

export const useWindowSize = () => {
    const [size, setWidth] = useState({
        height: 0,
        width: 0
    });

    const updateSize = () => {
        setWidth({
            height: window.innerHeight,
            width: window.innerWidth
        });
    };

    useLayoutEffect(() => {
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return size;
};
