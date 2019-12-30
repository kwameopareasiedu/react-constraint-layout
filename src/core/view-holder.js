import { ConstraintTarget } from "./constraint-target";
import { DimensionConstant } from "./dimension-constant";
import { isDefined, firstDefinedOf } from "../utils";

/**
 * An holder representation of a ConstrainedView. Also contains the coordinate pairs
 * (x1, y1) and (x2, y2) needed to position the view. (x1, y1) represents the top
 * left corner position while (x2, y2) represents the bottom right corner.
 */
export function ViewHolder(data, view) {
    const stringDimensions = [DimensionConstant.MATCH_PARENT, DimensionConstant.MATCH_CONTENT];
    this.data = data;
    this.view = view;

    this.id = data.props.id || this.generateViewId();

    this.width = (function(value) {
        if (stringDimensions.includes(value)) return value;
        return parseInt(value || 0);
    })(this.resolveBreakpointProp("width"));

    this.height = (function(value) {
        if (stringDimensions.includes(value)) return value;
        return parseInt(value || 0);
    })(this.resolveBreakpointProp("height"));

    this.marginTop = parseInt(this.resolveBreakpointProp("marginTop") || 0);
    this.marginLeft = parseInt(this.resolveBreakpointProp("marginLeft") || 0);
    this.marginRight = parseInt(this.resolveBreakpointProp("marginRight") || 0);
    this.marginBottom = parseInt(this.resolveBreakpointProp("marginBottom") || 0);
    this.leftToLeftOf = this.resolveBreakpointProp(ConstraintTarget.LEFT_TO_LEFT_OF);
    this.leftToRightOf = this.resolveBreakpointProp(ConstraintTarget.LEFT_TO_RIGHT_OF);
    this.rightToLeftOf = this.resolveBreakpointProp(ConstraintTarget.RIGHT_TO_LEFT_OF);
    this.rightToRightOf = this.resolveBreakpointProp(ConstraintTarget.RIGHT_TO_RIGHT_OF);
    this.topToTopOf = this.resolveBreakpointProp(ConstraintTarget.TOP_TO_TOP_OF);
    this.topToBottomOf = this.resolveBreakpointProp(ConstraintTarget.TOP_TO_BOTTOM_OF);
    this.bottomToTopOf = this.resolveBreakpointProp(ConstraintTarget.BOTTOM_TO_TOP_OF);
    this.bottomToBottomOf = this.resolveBreakpointProp(ConstraintTarget.BOTTOM_TO_BOTTOM_OF);
    this.horizontalBias = (function(self) {
        if (Object.prototype.toString.call(self.resolveBreakpointProp("horizontalBias")) === "[object Number]") {
            return Math.max(0, Math.min(1, parseFloat(data.props.horizontalBias)));
        } else return 0.5;
    })(this);
    this.verticalBias = (function(self) {
        if (Object.prototype.toString.call(self.resolveBreakpointProp("verticalBias")) === "[object Number]") {
            return Math.max(0, Math.min(1, parseFloat(data.props.verticalBias)));
        } else return 0.5;
    })(this);

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
    const propWidthValue = this.width;
    if (isDefined(propWidthValue) && !isNaN(parseFloat(propWidthValue)) && parseFloat(propWidthValue) < 0)
        throw `${this.id}: Width cannot be less than 0`;
    if (isDefined(propWidthValue) && isNaN(parseFloat(propWidthValue)) && !stringDimensions.includes(propWidthValue))
        throw `${this.id}: Width must either be "${DimensionConstant.MATCH_PARENT}" or "${DimensionConstant.MATCH_CONTENT}"`;

    // Validate height value
    const propHeightValue = this.height;
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

/**
 * For a given constraint prop name, and the window size, selects the appropriate
 * prefixed constraint prop name and returns the value of that props from data.props
 * E.g. If the window size is 800px and "leftToLeftOf" "md_leftToLeftOf" is defined,
 * return the value of prop "md_leftToLeftOf", but if the window size is 600px,
 * return the value of prop "leftToLeftOf"
 * @returns {string | null | number} The value of the prop for the breakpoint
 * */
ViewHolder.prototype.resolveBreakpointProp = function(propName) {
    const windowWidth = window.innerWidth;
    const breakpointPropValues = [
        this.data.props["xl_" + propName],
        this.data.props["lg_" + propName],
        this.data.props["md_" + propName],
        this.data.props["sm_" + propName],
        this.data.props[propName]
    ];

    if (windowWidth > 1200) return firstDefinedOf.apply(null, breakpointPropValues);
    if (windowWidth > 992) return firstDefinedOf.apply(null, breakpointPropValues.slice(1));
    if (windowWidth > 768) return firstDefinedOf.apply(null, breakpointPropValues.slice(2));
    if (windowWidth > 576) return firstDefinedOf.apply(null, breakpointPropValues.slice(3));
    return firstDefinedOf.apply(null, breakpointPropValues.slice(4));
};
