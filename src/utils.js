/**  A reference to the current parent of a view */
export const PARENT = "_parent";

/** An object to store constraint data */
export function Constraint(type, target) {
    this.type = type;
    this.target = target;
}

/** Indicates that the left of a view is aligned with the left of another view */
Constraint.LEFT_TO_LEFT_OF = "leftToLeftOf";
/** Indicates that the left of a view is aligned with the right of another view */
Constraint.LEFT_TO_RIGHT_OF = "leftToRightOf";
/** Indicates that the right of a view is aligned with the right of another view */
Constraint.RIGHT_TO_RIGHT_OF = "rightToRightOf";
/** Indicates that the right of a view is aligned with the left of another view */
Constraint.RIGHT_TO_LEFT_OF = "rightToLeftOf";
/** Indicates that the top of a view is aligned with the top of another view */
Constraint.TOP_TO_TOP_OF = "topToTopOf";
/** Indicates that the top of a view is aligned with the bottom of another view */
Constraint.TOP_TO_BOTTOM_OF = "topToBottomOf";
/** Indicates that the bottom of a view is aligned with the bottom of another view */
Constraint.BOTTOM_TO_BOTTOM_OF = "bottomToBottomOf";
/** Indicates that the bottom of a view is aligned with the top of another view */
Constraint.BOTTOM_TO_TOP_OF = "bottomToTopOf";

/** Dimension value modes of a view */
export function MeasureSpec(spec, value) {
    this.spec = spec;
    this.value = value;
}

/** Indicates that a view's dimension must be exactly a specified value */
MeasureSpec.EXACTLY = "EXACTLY";
/** Indicates that a view's dimension may take any value */
MeasureSpec.UNSPECIFIED = "UNSPECIFIED";

/** Supported dimension constants of a ConstrainedView */
export const Dimension = {
    /** Indicates that a view's dimension should match it's content */
    MATCH_CONTENT: "match-content",
    /** Indicates that a view's dimension should match it's parent's width */
    MATCH_PARENT: "match-parent"
};

/** Determines if a specified value is defined (I.e. not undefined or null) */
export const isDefined = value => ![undefined, null].includes(value);
