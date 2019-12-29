import React, { forwardRef, Children, useEffect, useRef } from "react";
import PT from "prop-types";

/** Represents a direct child of the ConstraintLayout */
export const ConstrainedView = forwardRef(({ children }, ref) => {
    const child = Children.toArray(children)[0];
    const _ref = useRef();

    useEffect(() => {
        if (child.ref) {
            // If the child had a ref attached to it, assign the DOM element to it
            if (Object.prototype.toString.call(child.ref) !== "[object Function]") {
                child.ref.current = _ref.current;
            } else child.ref(_ref.current);
        }

        // Since ref is forwarded from the ConstraintLayout, it'll be a callback ref
        if (ref) ref(_ref.current);
    }, []);

    // Filter out non-HTML attributes to prevent console errors
    const childRenderProps = Object.keys(child.props)
        .filter(k => !ConstrainedView.renderExcludedKeys.includes(k))
        .reduce((props, k) => ({ ...props, [k]: child.props[k] }), {});

    return (
        <child.type ref={_ref} {...childRenderProps}>
            {child.props.children}
        </child.type>
    );
});

ConstrainedView.renderExcludedKeys = [
    "width",
    "height",
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

ConstrainedView.propTypes = { children: PT.any };
