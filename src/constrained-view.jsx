import React from "react";
import PT from "prop-types";
import { Visibility } from "./utils";

/** Represents a direct child of the ConstraintLayout */
export const ConstrainedView = ({ _ref, children, id, as: Component = "div", style: _style, ...props }) => {
    const style = { ..._style, position: "absolute", width: "auto", margin: "0", overflow: "hidden", boxSizing: "border-box" };

    return (
        <Component {...props} ref={_ref} id={id} style={style}>
            {children}
        </Component>
    );
};

ConstrainedView.propTypes = {
    as: PT.any,
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
    horizontalBias: PT.number,
    verticalBias: PT.number,
    style: PT.object,
    children: PT.any,
    _ref: PT.func
};
