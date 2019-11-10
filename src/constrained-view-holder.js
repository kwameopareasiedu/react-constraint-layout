import { Constraint, MeasureSpec, Dimension } from "./utils";

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
    this.rightToRightOf = view.props[Constraint.RIGHT_TO_RIGHT_OF] || null;
    this.rightToLeftOf = view.props[Constraint.RIGHT_TO_LEFT_OF] || null;
    this.topToTopOf = view.props[Constraint.TOP_TO_TOP_OF] || null;
    this.topToBottomOf = view.props[Constraint.TOP_TO_BOTTOM_OF] || null;
    this.bottomToBottomOf = view.props[Constraint.BOTTOM_TO_BOTTOM_OF] || null;
    this.bottomToTopOf = view.props[Constraint.BOTTOM_TO_TOP_OF] || null;
    this.horizontalBias = Math.max(0, Math.min(1, parseFloat(view.props.horizontalBias) || 0.5));

    this.validateAttributes();

    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.boundX1 = 0;
    this.boundY1 = 0;
    this.boundX2 = 0;
    this.boundY2 = 0;
    this.constraints = [];
    this.isLeftConstrained = !!this.leftToLeftOf || !!this.leftToRightOf;
    this.isRightConstrained = !!this.rightToRightOf || !!this.rightToLeftOf;
    this.isFullyHorizontallyConstrained = this.isLeftConstrained && this.isRightConstrained;

    if (this.leftToLeftOf) this.constraints.push(new Constraint(Constraint.LEFT_TO_LEFT_OF, this.leftToLeftOf));
    if (this.leftToRightOf) this.constraints.push(new Constraint(Constraint.LEFT_TO_RIGHT_OF, this.leftToRightOf));
    if (this.rightToRightOf) this.constraints.push(new Constraint(Constraint.RIGHT_TO_RIGHT_OF, this.rightToRightOf));
    if (this.rightToLeftOf) this.constraints.push(new Constraint(Constraint.RIGHT_TO_LEFT_OF, this.rightToLeftOf));
    if (this.topToTopOf) this.constraints.push(new Constraint(Constraint.TOP_TO_TOP_OF, this.topToTopOf));
    if (this.topToBottomOf) this.constraints.push(new Constraint(Constraint.TOP_TO_BOTTOM_OF, this.topToBottomOf));
    if (this.bottomToBottomOf) this.constraints.push(new Constraint(Constraint.BOTTOM_TO_BOTTOM_OF, this.bottomToBottomOf));
    if (this.bottomToTopOf) this.constraints.push(new Constraint(Constraint.BOTTOM_TO_TOP_OF, this.bottomToTopOf));
}

ConstrainedViewHolder.prototype.toString = function() {
    return `${this.id} - x1:${this.x1}, x2:${this.x2}, y1:${this.y1}, y2:${this.y2}`;
};

/** Generates a unique view id */
ConstrainedViewHolder.prototype.generateViewId = function() {
    const uniqueId = Math.random().toString();
    return `view-${uniqueId.replace(/\d\./g, "")}`;
};

/** Checks the validity of attributes defined this view */
ConstrainedViewHolder.prototype.validateAttributes = function() {
    const strDimensions = [Dimension.MATCH_PARENT, Dimension.MATCH_CONTENT];

    // Check for valid width string values
    const propWidthValue = this.view.props.width;
    const propWidthType = Object.prototype.toString.call(propWidthValue);
    if (propWidthType === "[object Number]" && propWidthValue < 0) throw `${this.id}: Width is a number and cannot be less than 0`;
    if (propWidthType === "[object String]" && !strDimensions.includes(propWidthValue))
        throw `${this.id}: Width is a string and must either be "${Dimension.MATCH_PARENT}" or "${Dimension.MATCH_CONTENT}"`;

    // Check for valid height string values
    const propHeightValue = this.view.props.height;
    const propHeightType = Object.prototype.toString.call(propHeightValue);
    if (propHeightType === "[object Number]" && propHeightValue < 0) throw `${this.id}: Height is a number and cannot be less than 0`;
    if (propHeightType === "[object String]" && !strDimensions.includes(propHeightValue))
        throw `${this.id}: Height is a string and must either be "${Dimension.MATCH_PARENT}" or "${Dimension.MATCH_CONTENT}"`;

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

/** Returns the measure spec for the view width */
ConstrainedViewHolder.prototype.measureWidth = function(parent) {
    const { width: propWidth } = this.view.props;
    const { width: renderWidth } = this.ref.getBoundingClientRect();
    const { width: parentWidth } = parent.getBoundingClientRect();
    const propWidthIsNumeric = Object.prototype.toString.call(propWidth) === "[object Number]";
    const horizontalMargin = this.marginLeft + this.marginRight;

    if (propWidth === Dimension.MATCH_PARENT) return new MeasureSpec(MeasureSpec.EXACTLY, parentWidth);
    if (propWidth === Dimension.MATCH_CONTENT) return new MeasureSpec(MeasureSpec.EXACTLY, renderWidth);
    if (propWidthIsNumeric && propWidth === 0 && this.isFullyHorizontallyConstrained) return new MeasureSpec(MeasureSpec.UNSPECIFIED, 0);
    if (propWidthIsNumeric && propWidth === 0 && !this.isFullyHorizontallyConstrained) return new MeasureSpec(MeasureSpec.EXACTLY, horizontalMargin);
    if (propWidthIsNumeric && propWidth > 0) return new MeasureSpec(MeasureSpec.EXACTLY, propWidth + horizontalMargin);
};

/** Returns the measure spec for the view height */
// ConstrainedViewHolder.prototype.measureHeight = function(parent) {
// 	const { height: propHeight } = this.view.props;
// 	const { height: renderHeight } = this.ref.getBoundingClientRect();
// 	const { height: parentHeight } = parent.current.getBoundingClientRect();
// 	const propHeightIsNumeric = Object.prototype.toString.call(propHeight) === "[object Number]";
//
// 	if (propHeight === DimensionConstants.MATCH_PARENT) return new MeasureSpec(MeasureSpec.EXACTLY, parentHeight);
// 	if (propHeight === DimensionConstants.MATCH_CONTENT) return new MeasureSpec(MeasureSpec.EXACTLY, renderHeight);
// 	if (propHeightIsNumeric && propHeight === 0) return new MeasureSpec(MeasureSpec.UNSPECIFIED, 0);
// 	if (propHeightIsNumeric && propHeight > 0) return new MeasureSpec(MeasureSpec.EXACTLY, propHeight);
// };
