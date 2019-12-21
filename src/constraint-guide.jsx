import PT from "prop-types";

/**
 * A non-visual component used as anchor points for ConstrainedViews
 * @return {null}
 */
export const ConstraintGuide = function() {
    return null;
};

ConstraintGuide.propTypes = {
    id: PT.string,
    end: PT.oneOfType([PT.number, PT.string]),
    begin: PT.oneOfType([PT.number, PT.string]),
    percent: PT.oneOfType([PT.number, PT.string]),
    orientation: PT.oneOf(["horizontal", "vertical"])
};
