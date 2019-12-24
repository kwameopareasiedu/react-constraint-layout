import React from "react";
import PT from "prop-types";

/** Represents a direct child of the ConstraintLayout */
// eslint-disable-next-line react/prop-types
export const ConstrainedView = ({ _ref, children, id, as: Component = "div", ...rest }) => {
    // Filter out non-HTML attributes to prevent console errors
    const renderProps = Object.keys(rest)
        .filter(k => !ConstrainedView.renderExcludedKeys.includes(k))
        .reduce((acc, k) => ({ ...acc, [k]: rest[k] }), {});

    return (
        <Component ref={_ref} id={id} {...renderProps}>
            {children}
        </Component>
    );
};

ConstrainedView.renderExcludedKeys = [
    "marginTop",
    "marginLeft",
    "marginRight",
    "marginBottom",
    "leftToLeftOf",
    "leftToRightOf",
    "rightToRightOf",
    "rightToLeftOf",
    "topToTopOf",
    "topToBottomOf",
    "bottomToBottomOf",
    "bottomToTopOf",
    "horizontalBias",
    "verticalBias"
];

ConstrainedView.propTypes = {
    as: PT.any,
    id: PT.string,
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
