import PT from "prop-types";
import React, { Children, cloneElement, useEffect, useRef } from "react";
import { ConstraintLayoutSolver } from "./constraint-layout-solver";
import { ConstrainedView } from "./constrained-view";
import { ConstraintGuide } from "./constraint-guide";
import { isDefined } from "./utils";

/**
 * ConstraintLayout which allows for positioning elements in a flat hierarchy
 * in a flexible manner with constraints.
 */
export const ConstraintLayout = ({ width, height, children: _children, style: _style, ...props }) => {
    if (!isDefined(height)) throw "<ConstraintLayout /> height is required";

    // Ensure only <ConstrainedView /> and <ConstraintGuide /> are direct children
    const children = Children.toArray(_children).filter(c => {
        const validChildType = (function() {
            if (Object.prototype.toString.call(c.type) === "[object Function]") {
                return [ConstrainedView.prototype, ConstraintGuide.prototype].includes(c.type.prototype);
            } else return false;
        })();

        if (!validChildType) console.error("Only <ConstrainedView /> and <ConstraintGuide /> can be direct children of <ConstrainedLayout />");
        return validChildType;
    });

    // Filter out the constrained views
    const views = children.filter(child => child.type.prototype === ConstrainedView.prototype);
    // Filter out the constraint guides
    const guides = children.filter(child => child.type.prototype === ConstraintGuide.prototype);

    const solver = useRef();
    const parentRef = useRef();
    const refs = useRef(Array(views.length).fill(null));

    useEffect(() => {
        // noinspection JSValidateTypes
        solver.current = new ConstraintLayoutSolver(views, guides, refs.current, parentRef.current);
        solver.current.invalidate();
    }, [_children]);

    useEffect(() => {
        const onResize = () => solver.current.invalidate();
        const onUnmount = () => window.removeEventListener("resize", onResize);
        window.addEventListener("resize", onResize);
        return onUnmount;
    }, []);

    return (
        <div ref={parentRef} className="constraint-layout" style={{ ..._style, position: "relative", width, height, overflow: "hidden" }} {...props}>
            {views.map((child, index) => {
                const refFn = node => (refs.current[index] = node);
                // noinspection JSCheckFunctionSignatures
                return cloneElement(child, { _ref: refFn });
            })}
        </div>
    );
};

ConstraintLayout.propTypes = {
    children: PT.any,
    width: PT.oneOfType([PT.string, PT.number]),
    height: PT.oneOfType([PT.string, PT.number]).isRequired,
    style: PT.object
};
