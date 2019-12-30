import PT from "prop-types";
import React, { Children, cloneElement, forwardRef, useEffect, useRef } from "react";
import { ConstrainedView } from "./constrained-view";
import { ConstraintGuide } from "./constraint-guide";
import { LayoutSolver } from "./core/layout-solver";
import { isDefined } from "./utils";

/** ConstraintLayout which allows for positioning elements relative to each other in a flat hierarchy by using constraints */
// eslint-disable-next-line react/display-name
export const ConstraintLayout = forwardRef(({ id, className, width, height, children, style }, ref) => {
    const childrenArray = Children.toArray(children);
    const views = childrenArray.filter(c => c.type !== ConstraintGuide);
    const guides = childrenArray.filter(c => c.type === ConstraintGuide);
    const childRefs = useRef(Array(views.length).fill(null));
    const solverRef = useRef(new LayoutSolver());
    const parentRef = useRef();

    useEffect(() => {
        // If the constraint layout is a child of itself, populate the ref with the parent element
        if (ref) {
            if (Object.prototype.toString.call(ref) !== "[object Function]") {
                ref.current = parentRef.current;
            } else ref(parentRef.current);
        }

        updateSolver();
        window.addEventListener("resize", updateSolver);
        return () => window.removeEventListener("resize", updateSolver);
    }, []);

    useEffect(() => updateSolver());

    const updateSolver = () => {
        solverRef.current.init(views, childRefs.current, guides, parentRef.current, !isDefined(height));
        solverRef.current.invalidate();
    };

    return (
        <div
            id={id}
            ref={parentRef}
            className={`constraint-layout ${className ? className : ""}`}
            style={{ position: "relative", overflow: "hidden", width, height, ...style }}>
            {views.map((v, i) => {
                const viewCallbackRef = node => (childRefs.current[i] = node);
                // noinspection JSCheckFunctionSignatures
                return (
                    <ConstrainedView key={i} ref={viewCallbackRef}>
                        {cloneElement(v)}
                    </ConstrainedView>
                );
            })}
        </div>
    );
});

ConstraintLayout.propTypes = {
    id: PT.string,
    className: PT.string,
    width: PT.oneOfType([PT.number, PT.string]),
    height: PT.oneOfType([PT.number, PT.string]),
    children: PT.any,
    style: PT.object
};
