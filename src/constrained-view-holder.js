import { Constraint, Dimension } from "./utils";

/**
 * An holder representation of a ConstrainedView. Also contains the coordinate pairs
 * (x1, y1) and (x2, y2) needed to position the view. (x1, y1) represents the top
 * left corner position while (x2, y2) represents the bottom right corner.
 * When passed a view object and its ref, ConstrainedViewHolder sets up and internal
 * set of variables that are required by a view solver to solve for the positions
 * of its view. It validates the current set of attributes on the view and will
 * stop the rendering pipeline and throw an error if any of the validations fail.
 */
export function ConstrainedViewHolder(view, ref) {
    this.view = view;
    this.ref = ref;

    this.id = view.props.id || this.generateViewId();
    this.marginTop = parseInt(view.props.marginTop || 0);
    this.marginLeft = parseInt(view.props.marginLeft || 0);
    this.marginRight = parseInt(view.props.marginRight || 0);
    this.marginBottom = parseInt(view.props.marginBottom || 0);
    this.leftToLeftOf = view.props[Constraint.LEFT_TO_LEFT_OF] || null;
    this.leftToRightOf = view.props[Constraint.LEFT_TO_RIGHT_OF] || null;
    this.rightToLeftOf = view.props[Constraint.RIGHT_TO_LEFT_OF] || null;
    this.rightToRightOf = view.props[Constraint.RIGHT_TO_RIGHT_OF] || null;
    this.topToTopOf = view.props[Constraint.TOP_TO_TOP_OF] || null;
    this.topToBottomOf = view.props[Constraint.TOP_TO_BOTTOM_OF] || null;
    this.bottomToTopOf = view.props[Constraint.BOTTOM_TO_TOP_OF] || null;
    this.bottomToBottomOf = view.props[Constraint.BOTTOM_TO_BOTTOM_OF] || null;
    this.horizontalBias = (function() {
        if (Object.prototype.toString.call(view.props.horizontalBias) === "[object Number]") {
            return Math.max(0, Math.min(1, parseFloat(view.props.horizontalBias)));
        } else return 0.5;
    })();
    this.verticalBias = (function() {
        if (Object.prototype.toString.call(view.props.verticalBias) === "[object Number]") {
            return Math.max(0, Math.min(1, parseFloat(view.props.verticalBias)));
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

    if (this.leftToLeftOf) this.constraints.push(new Constraint(Constraint.LEFT_TO_LEFT_OF, this.leftToLeftOf));
    if (this.leftToRightOf) this.constraints.push(new Constraint(Constraint.LEFT_TO_RIGHT_OF, this.leftToRightOf));
    if (this.rightToRightOf) this.constraints.push(new Constraint(Constraint.RIGHT_TO_RIGHT_OF, this.rightToRightOf));
    if (this.rightToLeftOf) this.constraints.push(new Constraint(Constraint.RIGHT_TO_LEFT_OF, this.rightToLeftOf));
    if (this.topToTopOf) this.constraints.push(new Constraint(Constraint.TOP_TO_TOP_OF, this.topToTopOf));
    if (this.topToBottomOf) this.constraints.push(new Constraint(Constraint.TOP_TO_BOTTOM_OF, this.topToBottomOf));
    if (this.bottomToBottomOf) this.constraints.push(new Constraint(Constraint.BOTTOM_TO_BOTTOM_OF, this.bottomToBottomOf));
    if (this.bottomToTopOf) this.constraints.push(new Constraint(Constraint.BOTTOM_TO_TOP_OF, this.bottomToTopOf));
}

/** Generates a unique view id */
ConstrainedViewHolder.prototype.generateViewId = function() {
    const uniqueId = Math.random().toString();
    return `view-${uniqueId.replace(/\d\./g, "")}`;
};

/** Checks the validity of attributes defined for this view */
ConstrainedViewHolder.prototype.validateAttributes = function() {
    const stringDimensions = [Dimension.MATCH_PARENT, Dimension.MATCH_CONTENT];

    // Validate width value
    const propWidthValue = this.view.props.width;
    const propWidthType = Object.prototype.toString.call(propWidthValue);
    if (typeof propWidthValue === "undefined") console.warn(`${this.id}: Width not specified. Default to 0px`);
    if (propWidthType === "[object Number]" && propWidthValue < 0) throw `${this.id}: Width cannot be less than 0`;
    if (propWidthType === "[object String]" && !stringDimensions.includes(propWidthValue))
        throw `${this.id}: Width must either be of "${Dimension.MATCH_PARENT}" or "${Dimension.MATCH_CONTENT}"`;

    // Validate height value
    const propHeightValue = this.view.props.height;
    const propHeightType = Object.prototype.toString.call(propHeightValue);
    if (typeof propHeightValue === "undefined") console.warn(`${this.id}: Height not specified. Default to 0px`);
    if (propHeightType === "[object Number]" && propHeightValue < 0) throw `${this.id}: Height is cannot be less than 0`;
    if (propHeightType === "[object String]" && !stringDimensions.includes(propHeightValue))
        throw `${this.id}: Height must either be "${Dimension.MATCH_PARENT}" or "${Dimension.MATCH_CONTENT}"`;

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
