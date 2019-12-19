import React from "react";
import PT from "prop-types";
import { Constraint, Visibility } from "./utils";

/** Represents a direct child of the ConstraintLayout */
export const ConstrainedView = ({ _ref, children, id }) => {
    const style = { position: "absolute", display: "block", width: "auto", padding: "0", margin: "0", overflow: "hidden", boxSizing: "border-box" };

    return (
        <div ref={_ref} id={id} className="constrained-view" style={style}>
            {children}
        </div>
    );
};

ConstrainedView.propTypes = {
    id: PT.string,
    width: PT.oneOfType([PT.number, PT.string]).isRequired,
    height: PT.oneOfType([PT.number, PT.string]).isRequired,
    marginTop: PT.oneOfType([PT.number, PT.string]),
    marginLeft: PT.oneOfType([PT.number, PT.string]),
    marginRight: PT.oneOfType([PT.number, PT.string]),
    marginBottom: PT.oneOfType([PT.number, PT.string]),
    [Constraint.LEFT_TO_LEFT_OF]: PT.oneOfType([PT.string, PT.array]),
    [Constraint.LEFT_TO_RIGHT_OF]: PT.oneOfType([PT.string, PT.array]),
    [Constraint.RIGHT_TO_LEFT_OF]: PT.oneOfType([PT.string, PT.array]),
    [Constraint.RIGHT_TO_RIGHT_OF]: PT.oneOfType([PT.string, PT.array]),
    [Constraint.TOP_TO_TOP_OF]: PT.oneOfType([PT.string, PT.array]),
    [Constraint.TOP_TO_BOTTOM_OF]: PT.oneOfType([PT.string, PT.array]),
    [Constraint.BOTTOM_TO_TOP_OF]: PT.oneOfType([PT.string, PT.array]),
    [Constraint.BOTTOM_TO_BOTTOM_OF]: PT.oneOfType([PT.string, PT.array]),
    visibility: PT.oneOf([Visibility.VISIBLE, Visibility.HIDDEN]),
    horizontalBias: PT.number,
    children: PT.any,
    _ref: PT.func
};
