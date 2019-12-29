/** An object to store constraint target information */
export function ConstraintTarget(target, type) {
  this.target = target;
  this.type = type;
}

/** Indicates that the left of a view is aligned with the left of another view */
ConstraintTarget.LEFT_TO_LEFT_OF = "leftToLeftOf";
/** Indicates that the left of a view is aligned with the right of another view */
ConstraintTarget.LEFT_TO_RIGHT_OF = "leftToRightOf";
/** Indicates that the right of a view is aligned with the right of another view */
ConstraintTarget.RIGHT_TO_RIGHT_OF = "rightToRightOf";
/** Indicates that the right of a view is aligned with the left of another view */
ConstraintTarget.RIGHT_TO_LEFT_OF = "rightToLeftOf";
/** Indicates that the top of a view is aligned with the top of another view */
ConstraintTarget.TOP_TO_TOP_OF = "topToTopOf";
/** Indicates that the top of a view is aligned with the bottom of another view */
ConstraintTarget.TOP_TO_BOTTOM_OF = "topToBottomOf";
/** Indicates that the bottom of a view is aligned with the bottom of another view */
ConstraintTarget.BOTTOM_TO_BOTTOM_OF = "bottomToBottomOf";
/** Indicates that the bottom of a view is aligned with the top of another view */
ConstraintTarget.BOTTOM_TO_TOP_OF = "bottomToTopOf";
