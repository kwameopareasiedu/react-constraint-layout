import PT from "prop-types";
import React, { Children, cloneElement, useEffect, useRef } from "react";
import { ConstraintLayoutSolver } from "./constraint-layout-solver";
import { ConstrainedView } from "./constrained-view";
import { isDefined } from "./utils";

/**
 * ConstraintLayout which allows for positioning elements in a flat hierarchy
 * in a flexible manner with constraints.
 */
export const ConstraintLayout = ({ width, height, children: _children, style: _style, ...props }) => {
    if (!isDefined(height)) throw "<ConstraintLayout /> height is required";

    const children = Children.toArray(_children).filter(c => {
        const validChildType = (() => {
            if (Object.prototype.toString.call(c.type) === "[object Function]") {
                return c.type.prototype === ConstrainedView.prototype;
            } else return false;
        })();

        if (!validChildType) console.error("Only a <ConstrainedView /> can be a direct child of a <ConstrainedLayout />");
        return validChildType;
    });

    const viewSolver = useRef(function() {});
    const refs = useRef(Array(children.length).fill(null));
    const parentRef = useRef();

    useEffect(() => {
        viewSolver.current = new ConstraintLayoutSolver(children, refs.current, parentRef.current);
        window.addEventListener("resize", onWindowResized);
        onWindowResized();

        return () => window.removeEventListener("resize", onWindowResized);
    }, [_children]);

    const onWindowResized = () => {
        const { x: parentX, y: parentY } = parentRef.current.getBoundingClientRect();
        viewSolver.current.update();

        for (const viewHolder of viewSolver.current.viewHolders) {
            viewHolder.ref.style.left = `${viewHolder.position.x1 - parentX}px`;
            viewHolder.ref.style.width = `${viewHolder.position.x2 - viewHolder.position.x1}px`;
            viewHolder.ref.style.top = `${viewHolder.position.y1 - parentY}px`;
            viewHolder.ref.style.height = `${viewHolder.position.y2 - viewHolder.position.y1}px`;
        }
    };

    return (
        <div ref={parentRef} className="constraint-layout" style={{ ..._style, position: "relative", width, height, overflow: "hidden" }} {...props}>
            {children.map((child, index) => {
                const refFn = node => (refs.current[index] = node);
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
