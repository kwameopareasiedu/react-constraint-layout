import { isDefined } from "./utils";

/**
 * An holder representation of a ConstraintGuide. Contains the coordinate pairs
 * (x1, y1) and (x2, y2) representing the bounds which other views can use as a
 * positioning guide.
 */
export function ConstraintGuideHolder(view, parent) {
    this.view = view;

    this.id = view.props.id || this.generateViewId();
    this.orientation = view.props.orientation;
    this.percent = isDefined(view.props.percent) ? parseFloat(view.props.percent) : null;
    this.begin = isDefined(view.props.begin) ? parseFloat(view.props.begin) : null;
    this.end = isDefined(view.props.end) ? parseFloat(view.props.end) : null;

    this.validateAttributes();

    this.bounds = { x1: 0, y1: 0, x2: 0, y2: 0 };

    if (this.orientation === ConstraintGuideHolder.ORIENTATION_VERTICAL) {
        const { width: parentWidth } = parent.getBoundingClientRect();
        if (isDefined(this.begin)) this.bounds.x1 = this.bounds.x2 = this.begin;
        if (isDefined(this.end)) this.bounds.x1 = this.bounds.x2 = parentWidth - this.end;
        if (isDefined(this.percent)) this.bounds.x1 = this.bounds.x2 = 0.01 * this.percent * parentWidth;
    } else if (this.orientation === ConstraintGuideHolder.ORIENTATION_HORIZONTAL) {
        const { height: parentHeight } = parent.getBoundingClientRect();
        if (isDefined(this.begin)) this.bounds.y1 = this.bounds.y2 = this.begin;
        if (isDefined(this.end)) this.bounds.y1 = this.bounds.y2 = parentHeight - this.end;
        if (isDefined(this.percent)) this.bounds.y1 = this.bounds.y2 = 0.01 * this.percent * parentHeight;
    }
}

ConstraintGuideHolder.ORIENTATION_HORIZONTAL = "horizontal";
ConstraintGuideHolder.ORIENTATION_VERTICAL = "vertical";
ConstraintGuideHolder.Orientations = [ConstraintGuideHolder.ORIENTATION_HORIZONTAL, ConstraintGuideHolder.ORIENTATION_VERTICAL];

/** Generates a unique view id */
ConstraintGuideHolder.prototype.generateViewId = function() {
    const uniqueId = Math.random().toString();
    return `view-${uniqueId.replace(/\d\./g, "")}`;
};

/** Checks the validity of attributes defined for this view */
ConstraintGuideHolder.prototype.validateAttributes = function() {
    if (!ConstraintGuideHolder.Orientations.includes(this.orientation))
        throw `<ConstraintGuide /> orientation must be one of: ${ConstraintGuideHolder.Orientations.join(", ")}`;

    if (!isDefined(this.begin) && !isDefined(this.end) && !isDefined(this.percent))
        throw "<ConstraintGuide /> requires only one of props 'begin', 'end' or 'percent'";
    if (isDefined(this.begin) && isDefined(this.end)) throw "<ConstraintGuide /> requires only one of props 'begin', 'end' or 'percent'";
    if (isDefined(this.begin) && isDefined(this.percent)) throw "<ConstraintGuide /> requires only one of props 'begin', 'end' or 'percent'";
    if (isDefined(this.end) && isDefined(this.percent)) throw "<ConstraintGuide /> requires only one of props 'begin', 'end' or 'percent'";

    if (isDefined(this.percent)) {
        if (Object.prototype.toString.call(this.percent) !== "[object Number]") throw "<ConstraintGuide /> 'percent' must be a number";
        if (this.percent < 0 || this.percent > 100) throw "<ConstraintGuide /> 'percent' must be between 0 and 100";
    }
    if (isDefined(this.begin) && Object.prototype.toString.call(this.begin) !== "[object Number]")
        throw "<ConstraintGuide /> 'begin' must be a number";
    if (isDefined(this.end) && Object.prototype.toString.call(this.end) !== "[object Number]") throw "<ConstraintGuide /> 'end' must be a number";
};

/** Updates the bounds of this guide if the guide bound depends on the parent */
ConstraintGuideHolder.prototype.updateBounds = function(parent) {
    if (this.orientation === ConstraintGuideHolder.ORIENTATION_VERTICAL) {
        const { width: parentWidth } = parent.getBoundingClientRect();
        if (isDefined(this.end)) this.bounds.x1 = this.bounds.x2 = parentWidth - this.end;
        if (isDefined(this.percent)) this.bounds.x1 = this.bounds.x2 = 0.01 * this.percent * parentWidth;
    } else if (this.orientation === ConstraintGuideHolder.ORIENTATION_HORIZONTAL) {
        const { height: parentHeight } = parent.getBoundingClientRect();
        if (isDefined(this.end)) this.bounds.y1 = this.bounds.y2 = parentHeight - this.end;
        if (isDefined(this.percent)) this.bounds.y1 = this.bounds.y2 = 0.01 * this.percent * parentHeight;
    }
};
