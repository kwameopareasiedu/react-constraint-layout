import "./constrained-view.scss";
import React from "react";
import PT from "prop-types";
import { Visibility } from "./utils";

/** Represents a direct child of the ConstraintLayout */
export const ConstrainedView = ({ rootRef, children, id }) => {
    return (
        <div ref={rootRef} id={id} className="constrained-view">
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
    leftToLeftOf: PT.oneOfType([PT.string, PT.array]),
    leftToRightOf: PT.oneOfType([PT.string, PT.array]),
    rightToRightOf: PT.oneOfType([PT.string, PT.array]),
    rightToLeftOf: PT.oneOfType([PT.string, PT.array]),
    topToTopOf: PT.oneOfType([PT.string, PT.array]),
    topToBottomOf: PT.oneOfType([PT.string, PT.array]),
    bottomToBottomOf: PT.oneOfType([PT.string, PT.array]),
    bottomToTopOf: PT.oneOfType([PT.string, PT.array]),
    visibility: PT.oneOf([Visibility.VISIBLE, Visibility.HIDDEN]),
    children: PT.any,
    rootRef: PT.func
};
