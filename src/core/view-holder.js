import { ConstraintTarget } from "./constraint-target";
import { DimensionConstant } from "./dimension-constant";
import { isDefined } from "../utils";

/**
 * An holder representation of a ConstrainedView. Also contains the coordinate pairs
 * (x1, y1) and (x2, y2) needed to position the view. (x1, y1) represents the top
 * left corner position while (x2, y2) represents the bottom right corner.
 */
export function ViewHolder(data, view) {
    this.data = data;
    this.view = view;

    this.id = data.props.id || this.generateViewId();
    this.marginTop = parseInt(data.props.marginTop || 0);
    this.marginLeft = parseInt(data.props.marginLeft || 0);
    this.marginRight = parseInt(data.props.marginRight || 0);
    this.marginBottom = parseInt(data.props.marginBottom || 0);
    this.leftToLeftOf = data.props[ConstraintTarget.LEFT_TO_LEFT_OF] || null;
    this.leftToRightOf = data.props[ConstraintTarget.LEFT_TO_RIGHT_OF] || null;
    this.rightToLeftOf = data.props[ConstraintTarget.RIGHT_TO_LEFT_OF] || null;
    this.rightToRightOf = data.props[ConstraintTarget.RIGHT_TO_RIGHT_OF] || null;
    this.topToTopOf = data.props[ConstraintTarget.TOP_TO_TOP_OF] || null;
    this.topToBottomOf = data.props[ConstraintTarget.TOP_TO_BOTTOM_OF] || null;
    this.bottomToTopOf = data.props[ConstraintTarget.BOTTOM_TO_TOP_OF] || null;
    this.bottomToBottomOf = data.props[ConstraintTarget.BOTTOM_TO_BOTTOM_OF] || null;
    this.horizontalBias = (function() {
        if (Object.prototype.toString.call(data.props.horizontalBias) === "[object Number]") {
            return Math.max(0, Math.min(1, parseFloat(data.props.horizontalBias)));
        } else return 0.5;
    })();
    this.verticalBias = (function() {
        if (Object.prototype.toString.call(data.props.verticalBias) === "[object Number]") {
            return Math.max(0, Math.min(1, parseFloat(data.props.verticalBias)));
        } else return 0.5;
    })();

    this.validateAttributes();

    this.bounds = { x1: 0, y1: 0, x2: 0, y2: 0 };
    this.position = { x1: 0, y1: 0, x2: 0, y2: 0 };
    this.isTopConstrained = !!this.topToTopOf || !!this.topToBottomOf;
    this.isLeftConstrained = !!this.leftToLeftOf || !!this.leftToRightOf;
    this.isRightConstrained = !!this.rightToRightOf || !!this.rightToLeftOf;
    this.isBottomConstrained = !!this.bottomToBottomOf || !!this.bottomToTopOf;
    this.isHorizontallyConstrained = this.isLeftConstrained && this.isRightConstrained;
    this.isVerticallyConstrained = this.isTopConstrained && this.isBottomConstrained;
    this.constraints = [];

    if (this.leftToLeftOf) this.constraints.push(new ConstraintTarget(this.leftToLeftOf, ConstraintTarget.LEFT_TO_LEFT_OF));
    if (this.leftToRightOf) this.constraints.push(new ConstraintTarget(this.leftToRightOf, ConstraintTarget.LEFT_TO_RIGHT_OF));
    if (this.rightToRightOf) this.constraints.push(new ConstraintTarget(this.rightToRightOf, ConstraintTarget.RIGHT_TO_RIGHT_OF));
    if (this.rightToLeftOf) this.constraints.push(new ConstraintTarget(this.rightToLeftOf, ConstraintTarget.RIGHT_TO_LEFT_OF));
    if (this.topToTopOf) this.constraints.push(new ConstraintTarget(this.topToTopOf, ConstraintTarget.TOP_TO_TOP_OF));
    if (this.topToBottomOf) this.constraints.push(new ConstraintTarget(this.topToBottomOf, ConstraintTarget.TOP_TO_BOTTOM_OF));
    if (this.bottomToBottomOf) this.constraints.push(new ConstraintTarget(this.bottomToBottomOf, ConstraintTarget.BOTTOM_TO_BOTTOM_OF));
    if (this.bottomToTopOf) this.constraints.push(new ConstraintTarget(this.bottomToTopOf, ConstraintTarget.BOTTOM_TO_TOP_OF));
}

/** Generates a unique view id */
ViewHolder.prototype.generateViewId = function() {
    const uniqueId = Math.random().toString();
    return `view-${uniqueId.replace(/\d\./g, "")}`;
};

/** Checks the validity of attributes defined for this view */
ViewHolder.prototype.validateAttributes = function() {
    const stringDimensions = [DimensionConstant.MATCH_PARENT, DimensionConstant.MATCH_CONTENT];

    // Validate width value
    const propWidthValue = this.data.props.width;
    if (isDefined(propWidthValue) && !isNaN(parseFloat(propWidthValue)) && parseFloat(propWidthValue) < 0)
        throw `${this.id}: Width cannot be less than 0`;
    if (isDefined(propWidthValue) && isNaN(parseFloat(propWidthValue)) && !stringDimensions.includes(propWidthValue))
        throw `${this.id}: Width must either be "${DimensionConstant.MATCH_PARENT}" or "${DimensionConstant.MATCH_CONTENT}"`;

    // Validate height value
    const propHeightValue = this.data.props.height;
    if (isDefined(propHeightValue) && !isNaN(parseFloat(propHeightValue)) && parseFloat(propHeightValue) < 0)
        throw `${this.id}: Height is cannot be less than 0`;
    if (isDefined(propHeightValue) && isNaN(parseFloat(propHeightValue)) && !stringDimensions.includes(propHeightValue))
        throw `${this.id}: Height must either be "${DimensionConstant.MATCH_PARENT}" or "${DimensionConstant.MATCH_CONTENT}"`;

    // Check for conflicting constraints
    if (this.leftToLeftOf && this.leftToRightOf) throw `${this.id}: Conflicting constraints "leftToLeftOf" and "leftToRightOf"`;
    if (this.rightToRightOf && this.rightToLeftOf) throw `${this.id}: Conflicting constraints "rightToRightOf" and "rightToLeftOf"`;
    if (this.topToTopOf && this.topToBottomOf) throw `${this.id}: Conflicting constraints "topToTopOf" and "topToBottomOf"`;
    if (this.bottomToBottomOf && this.bottomToTopOf) throw `${this.id}: Conflicting constraints "bottomToBottomOf" and "bottomToTopOf"`;

    // Check constraint references to self
    if (this.leftToLeftOf === this.id) throw `${this.id}: Cannot be constrained to self on "leftToLeftOf"`;
    if (this.leftToRightOf === this.id) throw `${this.id}: Cannot be constrained to self on "leftToRightOf"`;
    if (this.rightToRightOf === this.id) throw `${this.id}: Cannot be constrained to self on "rightToRightOf"`;
    if (this.rightToLeftOf === this.id) throw `${this.id}: Cannot be constrained to self on "rightToLeftOf"`;
    if (this.topToTopOf === this.id) throw `${this.id}: Cannot be constrained to self on "topToTopOf"`;
    if (this.topToBottomOf === this.id) throw `${this.id}: Cannot be constrained to self on "topToBottomOf"`;
    if (this.bottomToBottomOf === this.id) throw `${this.id}: Cannot be constrained to self on "bottomToBottomOf"`;
    if (this.bottomToTopOf === this.id) throw `${this.id}: Cannot be constrained to self on "bottomToTopOf"`;
};
