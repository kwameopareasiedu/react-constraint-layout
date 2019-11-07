/** An object to store constraint data */
export function Constraint(type, target) {
    this.type = type;
    this.target = target;
}

/** Indicates that the left of a viewObj is aligned with the left of another viewObj */
Constraint.LEFT_TO_LEFT_OF = "leftToLeftOf";
/** Indicates that the left of a viewObj is aligned with the right of another viewObj */
Constraint.LEFT_TO_RIGHT_OF = "leftToRightOf";
/** Indicates that the right of a viewObj is aligned with the right of another viewObj */
Constraint.RIGHT_TO_RIGHT_OF = "rightToRightOf";
/** Indicates that the right of a viewObj is aligned with the left of another viewObj */
Constraint.RIGHT_TO_LEFT_OF = "rightToLeftOf";
/** Indicates that the top of a viewObj is aligned with the top of another viewObj */
Constraint.TOP_TO_TOP_OF = "topToTopOf";
/** Indicates that the top of a viewObj is aligned with the bottom of another viewObj */
Constraint.TOP_TO_BOTTOM_OF = "topToBottomOf";
/** Indicates that the bottom of a viewObj is aligned with the bottom of another viewObj */
Constraint.BOTTOM_TO_BOTTOM_OF = "bottomToBottomOf";
/** Indicates that the bottom of a viewObj is aligned with the top of another viewObj */
Constraint.BOTTOM_TO_TOP_OF = "bottomToTopOf";

/** Dimension value modes of a viewObj */
export function MeasureSpec(spec, value) {
    this.spec = spec;
    this.value = value;
}

/** Indicates that a viewObj's dimension must not exceed a specified value */
MeasureSpec.AT_MOST = "AT_MOST";
/** Indicates that a viewObj's dimension must be exactly a specified value */
MeasureSpec.EXACTLY = "EXACTLY";
/** Indicates that a viewObj's dimension may take any value */
MeasureSpec.UNSPECIFIED = "UNSPECIFIED";

/**  A reference to the current parent of a viewObj */
export const PARENT_REF = "parent";

/** Supported dimension constatns of a ConstrainedView */
export const Dimension = {
    /** Indicates that a viewObj's dimension should match it's content */
    MATCH_CONTENT: "match_content",
    /** Indicates that a viewObj's dimension should match it's parent's width */
    MATCH_PARENT: "match_parent"
};

/** Supported visibility constants of a ConstrainedView */
export const Visibility = {
    /** Indicates that a viewObj should take part the in the layout computation */
    VISIBLE: "visible",
    /** Indicates that a viewObj should be ignored the in the layout computation and not rendered */
    HIDDEN: "hidden"
};
