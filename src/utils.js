import { useState, useEffect } from "react";

/**  A reference to the current parent of a view */
export const PARENT = "_parent";

/** Generates a random unique view id */
export function generateRandomViewId() {
    const uniqueId = Math.random().toString();
    return `view-${uniqueId.replace(/\d\./g, "")}`;
}

/** Determines if a specified value is defined (I.e. not undefined or null) */
export function isDefined(value) {
    return ![undefined, null].includes(value);
}

/**
 * A react hook that returns state variables for specified window breakpoints
 * @param {Array} breakpoints An array of breakpoints sizes. Defaults to [576, 768, 992, 1200]
 * @returns {Array} An array of same size as sizes with boolean state variables corresponding to
 * each specified breakpoints that indicate if the window size has exceeded that breakpoint
 */
export const useWindowBreakpoints = (breakpoints = [576, 768, 992, 1200]) => {
    const [breakpointStates, setBreakpointStates] = useState(Array(breakpoints.length).fill(false));

    const onWindowResize = () => {
        const windowWidth = window.innerWidth;

        setBreakpointStates(
            breakpoints.map((breakpoint, i) => {
                if (i === 0) return windowWidth < breakpoint;
                if (i === breakpoints.length - 1) return windowWidth > breakpoints[i - 1];
                return windowWidth >= breakpoints[i - 1] && windowWidth < breakpoint;
            })
        );
    };

    useEffect(() => {
        onWindowResize();
        window.addEventListener("resize", onWindowResize);
        return () => window.removeEventListener("resize", onWindowResize);
    }, []);

    return breakpointStates;
};
