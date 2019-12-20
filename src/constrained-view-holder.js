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
    this.isLeftConstrained = !!this.leftToLeftOf || !!this.leftToRightOf;
    this.isRightConstrained = !!this.rightToRightOf || !!this.rightToLeftOf;
    this.isTopConstrained = !!this.topToTopOf || !!this.topToBottomOf;
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
    if (typeof propWidthValue === "undefined") throw `${this.id}: Width is required`;
    if (propWidthType === "[object Number]" && propWidthValue < 0) throw `${this.id}: Width cannot be less than 0`;
    if (propWidthType === "[object String]" && !stringDimensions.includes(propWidthValue))
        throw `${this.id}: Width must either be of "${Dimension.MATCH_PARENT}" or "${Dimension.MATCH_CONTENT}"`;

    // Validate height value
    const propHeightValue = this.view.props.height;
    const propHeightType = Object.prototype.toString.call(propHeightValue);
    if (typeof propHeightValue === "undefined") throw `${this.id}: Height is required`;
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

/** Returns the measure spec for the view width */
ConstrainedViewHolder.prototype.measureWidth = function(parent) {
    const { width: propWidth } = this.view.props;
    const { width: renderWidth } = this.ref.getBoundingClientRect();
    const { width: parentWidth } = parent.getBoundingClientRect();
    const propWidthIsNumeric = Object.prototype.toString.call(propWidth) === "[object Number]";

    if (propWidth === Dimension.MATCH_PARENT) return new MeasureSpec(MeasureSpec.EXACTLY, parentWidth);
    if (propWidth === Dimension.MATCH_CONTENT) return new MeasureSpec(MeasureSpec.EXACTLY, renderWidth);
    if (propWidthIsNumeric && propWidth === 0 && this.isHorizontallyConstrained) return new MeasureSpec(MeasureSpec.UNSPECIFIED, 0);
    if (propWidthIsNumeric && propWidth === 0 && !this.isHorizontallyConstrained) return new MeasureSpec(MeasureSpec.EXACTLY, 0);
    if (propWidthIsNumeric && propWidth > 0) return new MeasureSpec(MeasureSpec.EXACTLY, propWidth);
};

/** Returns the measure spec for the view height */
ConstrainedViewHolder.prototype.measureHeight = function() {
    const { height: propHeight } = this.view.props;
    const { height: renderHeight } = this.ref.getBoundingClientRect();
    const propHeightIsNumeric = Object.prototype.toString.call(propHeight) === "[object Number]";

    if (propHeight === Dimension.MATCH_PARENT) return new MeasureSpec(MeasureSpec.UNSPECIFIED, 0);
    if (propHeight === Dimension.MATCH_CONTENT) return new MeasureSpec(MeasureSpec.EXACTLY, renderHeight);
    if (propHeightIsNumeric && propHeight === 0 && this.isVerticallyConstrained) return new MeasureSpec(MeasureSpec.UNSPECIFIED, 0);
    if (propHeightIsNumeric && propHeight === 0 && !this.isVerticallyConstrained) return new MeasureSpec(MeasureSpec.EXACTLY, 0);
    if (propHeightIsNumeric && propHeight > 0) return new MeasureSpec(MeasureSpec.EXACTLY, propHeight);
};

/** Computes the final width position coordinates for this view from a given measure spec */
ConstrainedViewHolder.prototype.applyWidthBounds = function(measureSpec) {
    const { value } = measureSpec;
    const leftBound = this.bounds.x1 + this.marginLeft;
    const rightBound = this.bounds.x2 - this.marginRight;

    if (this.isHorizontallyConstrained) {
        const widthBound = rightBound - leftBound;
        const wiggleRoom = Math.max(widthBound - value, 0);
        this.position.x1 = leftBound + this.horizontalBias * wiggleRoom;
        this.position.x2 = rightBound - this.horizontalBias * wiggleRoom;
    } else if (this.isLeftConstrained) {
        this.position.x1 = leftBound;
        this.position.x2 = leftBound + value;
    } else if (this.isRightConstrained) {
        this.position.x2 = rightBound;
        this.position.x1 = rightBound - value;
    } else {
        this.position.x1 = this.marginLeft;
        this.position.x2 = this.marginLeft + value;
    }

    // After positioning, reduce the bounds to fit exactly around the component
    this.bounds.x1 = this.position.x1;
    this.bounds.x2 = this.position.x2;
};

/** Computes the final height position coordinates for this view from a given measure spec */
ConstrainedViewHolder.prototype.applyHeightBounds = function(measureSpec) {
    const { value } = measureSpec;
    const topBound = this.bounds.y1 + this.marginTop;
    const bottomBound = this.bounds.y2 - this.marginBottom;

    if (this.isVerticallyConstrained) {
        const heightBound = bottomBound - topBound;
        const wiggleRoom = Math.max(heightBound - value, 0);
        this.position.y1 = topBound + this.verticalBias * wiggleRoom;
        this.position.y2 = topBound + this.verticalBias * wiggleRoom + value;
    } else if (this.isTopConstrained) {
        this.position.y1 = topBound;
        this.position.y2 = topBound + value;
    } else if (this.isBottomConstrained) {
        this.position.y2 = bottomBound;
        this.position.y1 = bottomBound - value;
    } else {
        this.position.y1 = this.marginTop;
        this.position.y2 = this.marginTop + value;
    }

    // After positioning, reduce the bounds to fit exactly around the component
    this.bounds.y1 = this.position.y1;
    this.bounds.y2 = this.position.y2;
};
