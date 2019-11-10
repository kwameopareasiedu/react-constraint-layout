import "./constraint-layout.scss";
import PT from "prop-types";
import React, { Children, cloneElement, useEffect, useRef } from "react";
import { ConstraintLayoutSolver } from "./constraint-layout-solver";
import { ConstrainedView } from "./constrained-view";

/**
 * ConstraintLayout which allows for positioning elements in a flat hierarchy
 * in a flexible manner with constraints.
 */
export const ConstraintLayout = ({ children: originalChildren }) => {
    const children = Children.toArray(originalChildren).filter(c => {
        let childType;

        if (Object.prototype.toString.call(c.type) === "[object Function]") {
            if (c.type.prototype === ConstrainedView.prototype) return true;
            childType = c.type.name;
        } else childType = c.type;

        console.error(`<${childType} /> cannot be a direct child of ConstraintLayout. Expected type of <ConstrainedView />`);
        return false;
    });

    const viewSolver = useRef(function() {});
    const refs = useRef(Array(children.length).fill(null));
    const parentRef = useRef();

    useEffect(() => {
        viewSolver.current = new ConstraintLayoutSolver(children, refs, parentRef.current);
        window.addEventListener("resize", onWindowResized);
        onWindowResized();

        return () => window.removeEventListener("resize", onWindowResized);
    }, []);

    const onWindowResized = () => {
        const { x: parentX } = parentRef.current.getBoundingClientRect();
        viewSolver.current.update();

        for (const viewHolder of viewSolver.current.viewHolders) {
            viewHolder.ref.style.left = `${viewHolder.x1 - parentX}px`;
            viewHolder.ref.style.width = `${viewHolder.x2 - viewHolder.x1}px`;
            // viewHolder.viewRef.style.top = `${viewHolder.y1 - parentY}px`;
            // viewHolder.viewRef.style.height = `${viewHolder.y2 - viewHolder.y1}px`;
        }
    };

    return (
        <div ref={parentRef} className="constraint-layout">
            {children.map((child, index) =>
                cloneElement(child, {
                    rootRef: node => (refs.current[index] = node)
                })
            )}
        </div>
    );
};

ConstraintLayout.propTypes = {
    children: PT.any
};
