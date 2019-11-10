import { ConstrainedViewHolder } from "./constrained-view-holder";
import { Constraint, MeasureSpec, PARENT_REF } from "./utils";

/**
 * The ConstraintLayoutSolver is used by the ConstraintLayout to solve for the
 * position coordinates [(x1, y1) and (x2, y2)] of its current children.
 */
export function ConstraintLayoutSolver(views, refs, parent) {
    this.parent = parent;
    this.viewHolders = [];

    // Initializes the solver by creating the view holders for each view
    for (let i = 0; i < views.length; i++) {
        const viewHolder = new ConstrainedViewHolder(views[i], refs.current[i]);
        if (!this.viewIdIsUnique(viewHolder.id)) throw new Error(`Duplicate ID: ${viewHolder.id}`);
        this.viewHolders.push(viewHolder);
    }
}

/** Checks if a viewId is unique in the list of views */
ConstraintLayoutSolver.prototype.viewIdIsUnique = function(viewId) {
    return this.viewHolders.filter(holder => holder.id === viewId).length === 0;
};

/** Updates the state of the view holders */
ConstraintLayoutSolver.prototype.update = function() {
    // Solve the width constraints for each view holder linearly. Because views
    // are related to each other, preceeding views would have most likely been
    // fully positioned prior to views that depend on them via constraints
    const { width: parentWidth } = this.parent.getBoundingClientRect();

    for (const viewHolder of this.viewHolders) {
        // If it is not constrained horizontally, use the parent bounds as its bounds...
        if (!viewHolder.isLeftConstrained && !viewHolder.isRightConstrained) {
            viewHolder.boundX1 = 0;
            viewHolder.boundX2 = parentWidth;
        } else {
            // ...else use the constraints to determine the bounds of the view
            for (const constraint of viewHolder.constraints) {
                const targetHolder = this.searchViewHolders(constraint.target);

                if (targetHolder === PARENT_REF) {
                    // Constrained to parent view
                    if (constraint.type === Constraint.LEFT_TO_LEFT_OF) viewHolder.boundX1 = 0;
                    if (constraint.type === Constraint.LEFT_TO_RIGHT_OF) viewHolder.boundX1 = parentWidth;
                    if (constraint.type === Constraint.RIGHT_TO_RIGHT_OF) viewHolder.boundX2 = parentWidth;
                    if (constraint.type === Constraint.RIGHT_TO_LEFT_OF) viewHolder.boundX2 = 0;
                } else {
                    // Constrained to sibling view
                    if (constraint.type === Constraint.LEFT_TO_LEFT_OF) viewHolder.boundX1 = targetHolder.boundX1;
                    if (constraint.type === Constraint.LEFT_TO_RIGHT_OF) viewHolder.boundX1 = targetHolder.boundX2;
                    if (constraint.type === Constraint.RIGHT_TO_RIGHT_OF) viewHolder.boundX2 = targetHolder.boundX2;
                    if (constraint.type === Constraint.RIGHT_TO_LEFT_OF) viewHolder.boundX2 = targetHolder.boundX1;
                }
            }
        }

        // After defining the bounds of the view, use the width measure
        // spec to determine the final position within it's bounds
        const measureSpec = this.measureBounds(viewHolder);
        this.finalizePositionCoordinates(viewHolder, measureSpec);
    }

    // console.log(this.viewHolders.map(viewHolder => viewHolder.toString()));
};

/**
 * For a identifier value, this searches the set of view holder objects and returns
 * the first holder which matches the identifier. If the identifier is an array,
 * each entry is used to search the set for a matching holder object.
 */
ConstraintLayoutSolver.prototype.searchViewHolders = function(identifier) {
    switch (Object.prototype.toString.call(identifier)) {
        case "[object String]": {
            // If identifier is a string, return a holder with a matching id else return the parent ref
            return this.viewHolders.filter(holder => holder.id === identifier)[0] || PARENT_REF;
        }
        case "[object Array]": {
            // If identifier is an array, return the holder of the ID which matches first...
            for (const id of identifier) {
                const viewHolder = this.viewHolders.filter(holder => holder.id === id)[0];
                if (viewHolder) return viewHolder;
            }

            // ...else return the parent ref
            return PARENT_REF;
        }
        default:
            throw new Error(`Constraint value must either be a string or an array of strings`);
    }
};

/**
 * Generates a measure spec for the bounds of a view holder.
 * When the bounds of a view holder is computed, the measure
 * spec aids in centering or value distribution
 */
ConstraintLayoutSolver.prototype.measureBounds = function(viewHolder) {
    const { value: requestedWidth } = viewHolder.measureWidth(this.parent);
    const { width: parentWidth } = this.parent.getBoundingClientRect();
    let leftBound = 0;
    let rightBound = 0;

    if (viewHolder.isLeftConstrained) {
        const targetViewHolder = this.searchViewHolders(viewHolder.leftToLeftOf || viewHolder.leftToRightOf);
        if (targetViewHolder === PARENT_REF && viewHolder.leftToLeftOf) leftBound = 0;
        if (targetViewHolder === PARENT_REF && viewHolder.leftToRightOf) leftBound = parentWidth;
        if (targetViewHolder !== PARENT_REF && viewHolder.leftToLeftOf) leftBound = targetViewHolder.x1;
        if (targetViewHolder !== PARENT_REF && viewHolder.leftToRightOf) leftBound = targetViewHolder.x2;
    }

    if (viewHolder.isRightConstrained) {
        const targetViewHolder = this.searchViewHolders(viewHolder.rightToRightOf || viewHolder.rightToLeftOf);
        if (targetViewHolder === PARENT_REF && viewHolder.rightToRightOf) rightBound = parentWidth;
        if (targetViewHolder === PARENT_REF && viewHolder.rightToLeftOf) rightBound = 0;
        if (targetViewHolder !== PARENT_REF && viewHolder.rightToRightOf) rightBound = targetViewHolder.x2;
        if (targetViewHolder !== PARENT_REF && viewHolder.rightToLeftOf) rightBound = targetViewHolder.x1;
    }

    const availableWidth = (() => {
        if (viewHolder.isFullyHorizontallyConstrained) {
            return Math.max(0, rightBound - leftBound);
        } else return parentWidth;
    })();

    if (requestedWidth <= availableWidth) {
        if (requestedWidth === 0 && viewHolder.isFullyHorizontallyConstrained) {
            return new MeasureSpec(MeasureSpec.UNSPECIFIED, requestedWidth);
        } else return new MeasureSpec(MeasureSpec.EXACTLY, requestedWidth);
    } else return new MeasureSpec(MeasureSpec.AT_MOST, availableWidth);
};

/**
 * After bounds have been computed for a view holder, this determines the final values
 * of the coordinate pairs needed to position the view represented by the holder
 */
ConstraintLayoutSolver.prototype.finalizePositionCoordinates = function(viewHolder, measureSpec) {
    const { value, spec } = measureSpec;

    if (viewHolder.isFullyHorizontallyConstrained) {
        if (spec === MeasureSpec.EXACTLY) {
            if (value === 0) {
                // Stretch view, taking margins into consideration
                viewHolder.x1 = viewHolder.boundX1 + viewHolder.marginLeft;
                viewHolder.x2 = viewHolder.boundX2 - viewHolder.marginRight;
            } else {
                // Center view, taking horizontal bias into consideration
                const widthBound = viewHolder.boundX2 - viewHolder.boundX1;
                viewHolder.x1 = 0.5 * widthBound - 0.5 * value;
                viewHolder.x2 = viewHolder.x1 + value;
            }
        } else if (spec === MeasureSpec.AT_MOST) {
            if (viewHolder.boundX2 - viewHolder.boundX1 > value) {
                // Stretch view to value (I.e. limit), taking margins into consideration
                viewHolder.x1 = viewHolder.boundX1 + viewHolder.marginLeft;
                viewHolder.x2 = viewHolder.x1 + value - viewHolder.marginRight;
            } else {
                // Center view with horizontal bias
                const widthBound = viewHolder.boundX2 - viewHolder.boundX1;
                viewHolder.x1 = 0.5 * widthBound - 0.5 * value;
                viewHolder.x2 = viewHolder.x1 + value;
            }
        } else if (spec === MeasureSpec.UNSPECIFIED) {
            // Stretch view, taking margins into consideration
            viewHolder.x1 = viewHolder.boundX1 + viewHolder.marginLeft;
            viewHolder.x2 = viewHolder.boundX2 - viewHolder.marginRight;
        }
    } else if (viewHolder.isLeftConstrained) {
        viewHolder.x1 = viewHolder.boundX1 + viewHolder.marginLeft;
        viewHolder.x2 = viewHolder.x1 + value;
    } else if (viewHolder.isRightConstrained) {
        viewHolder.x2 = viewHolder.boundX2 - viewHolder.marginRight;
        viewHolder.x1 = viewHolder.x2 - value;
    } else {
        viewHolder.x1 = viewHolder.marginLeft;
        viewHolder.x2 = viewHolder.x1 + value;
    }
};
