import PT from "prop-types";
import React, { Children, cloneElement, useEffect, useRef } from "react";
import { ConstraintLayoutSolver } from "./constraint-layout-solver";
import { ConstrainedView } from "./constrained-view";
import { ConstraintGuide } from "./constraint-guide";
import { isDefined } from "./utils";

/**
 * ConstraintLayout which allows for positioning elements relative to each other
 * in a flat hierarchy by using constraints. Since a ConstraintLayout can be a
 * child of itself, we'll need to expose the _ref function.
 */
// eslint-disable-next-line react/prop-types
export const ConstraintLayout = ({ _ref, id, className, width, height, children }) => {
    if (!isDefined(height)) throw "<ConstraintLayout /> height is required";

    const childrenArray = Children.toArray(children);
    const validChildPrototypes = [ConstrainedView.prototype, ConstraintLayout.prototype];
    const views = childrenArray.filter(c => c.type && validChildPrototypes.includes(c.type.prototype));
    const guides = childrenArray.filter(c => c.type && ConstraintGuide.prototype === c.type.prototype);
    const refs = useRef(Array(views.length).fill(null));
    const solverRef = useRef(() => {});
    const rootRef = useRef();

    useEffect(() => {
        const solver = new ConstraintLayoutSolver(views, guides, refs.current, rootRef.current);
        solverRef.current = solver;
        solver.invalidate();
    }, [children]);

    useEffect(() => {
        solverRef.current.invalidate();
    }, [width, height]);

    useEffect(() => {
        // If _ref (a callback ref) was defined, pass the DOM element to it
        // to make it also available to the parent ConstraintLayout
        if (_ref) _ref(rootRef.current);
        const onResize = () => solverRef.current.invalidate();
        rootRef.current.addEventListener("resize", onResize);
        return () => rootRef.current.removeEventListener("resize", onResize);
    }, []);

    const style = { position: "relative", overflow: "hidden", width, height };

    return (
        <div ref={rootRef} id={id} className={`constraint-layout ${className ? className : ""}`} style={style}>
            {views.map((child, index) => {
                const childRef = node => (refs.current[index] = node);
                // noinspection JSCheckFunctionSignatures
                return cloneElement(child, { _ref: childRef });
            })}
        </div>
    );
};

ConstraintLayout.propTypes = {
    width: PT.oneOfType([PT.number, PT.string]),
    height: PT.oneOfType([PT.number, PT.string]),
    marginTop: PT.oneOfType([PT.number, PT.string]),
    marginLeft: PT.oneOfType([PT.number, PT.string]),
    marginRight: PT.oneOfType([PT.number, PT.string]),
    marginBottom: PT.oneOfType([PT.number, PT.string]),
    leftToLeftOf: PT.oneOfType([PT.string, PT.array]),
    leftToRightOf: PT.oneOfType([PT.string, PT.array]),
    rightToRightOf: PT.oneOfType([PT.string, PT.array]),
    rightToLeftOf: PT.oneOfType([PT.string, PT.array]),
    topToTopOf: PT.oneOfType([PT.string, PT.array]),
    topToBottomOf: PT.oneOfType([PT.string, PT.array]),
    bottomToBottomOf: PT.oneOfType([PT.string, PT.array]),
    bottomToTopOf: PT.oneOfType([PT.string, PT.array]),
    horizontalBias: PT.number,
    verticalBias: PT.number,
    children: PT.any
};
