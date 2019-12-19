import { ConstrainedViewHolder } from "./constrained-view-holder";
import { Constraint, MeasureSpec, PARENT_REF } from "./utils";

/**
 * The ConstraintLayoutSolver is used by the ConstraintLayout to solve for the
 * position coordinates [(x1, y1) and (x2, y2)] of its current children.
 */
export function ConstraintLayoutSolver(views, refs, parent) {
    this.parent = parent;
    this.viewHolders = [];

    // Initialize the solver by creating the view holders for each view
    for (let i = 0; i < views.length; i++) {
        const viewHolder = new ConstrainedViewHolder(views[i], refs[i]);

        if (!this.viewIdIsUnique(viewHolder.id)) {
            throw `Duplicate ID: ${viewHolder.id}`;
        } else this.viewHolders.push(viewHolder);
    }
}

/** Checks if a viewId is unique in the list of views */
ConstraintLayoutSolver.prototype.viewIdIsUnique = function(viewId) {
    return this.viewHolders.filter(holder => holder.id === viewId).length === 0;
};

/** Updates the state of the view holders */
ConstraintLayoutSolver.prototype.update = function() {
    this.updateWidth();
};

/** Updates the state of the view holders */
ConstraintLayoutSolver.prototype.updateWidth = function() {
    // Solve the width constraints for each view holder linearly. Because views
    // are related to each other, preceeding views would have most likely been
    // fully positioned prior to views that depend on them via constraints
    const { width: parentWidth } = this.parent.getBoundingClientRect();

    for (const viewHolder of this.viewHolders) {
        // If it is not constrained horizontally, use the parent bounds as its bounds...
        if (!viewHolder.isLeftConstrained && !viewHolder.isRightConstrained) {
            viewHolder.bounds.x1 = 0;
            viewHolder.bounds.x2 = parentWidth;
        } else {
            // ...else use the constraints to determine the bounds of the view
            for (const constraint of viewHolder.constraints) {
                const targetHolder = this.searchViewHolders(constraint.target);

                if (targetHolder === PARENT_REF) {
                    // Constrained to parent view
                    if (constraint.type === Constraint.LEFT_TO_LEFT_OF) viewHolder.bounds.x1 = 0;
                    if (constraint.type === Constraint.LEFT_TO_RIGHT_OF) viewHolder.bounds.x1 = parentWidth;
                    if (constraint.type === Constraint.RIGHT_TO_RIGHT_OF) viewHolder.bounds.x2 = parentWidth;
                    if (constraint.type === Constraint.RIGHT_TO_LEFT_OF) viewHolder.bounds.x2 = 0;
                } else {
                    // Constrained to sibling view
                    if (constraint.type === Constraint.LEFT_TO_LEFT_OF) viewHolder.bounds.x1 = targetHolder.bounds.x1;
                    if (constraint.type === Constraint.LEFT_TO_RIGHT_OF) viewHolder.bounds.x1 = targetHolder.bounds.x2;
                    if (constraint.type === Constraint.RIGHT_TO_RIGHT_OF) viewHolder.bounds.x2 = targetHolder.bounds.x2;
                    if (constraint.type === Constraint.RIGHT_TO_LEFT_OF) viewHolder.bounds.x2 = targetHolder.bounds.x1;
                }
            }
        }

        // Compute the final width measure spec from the bounds and constraints
        const widthMeasureSpec = this.measureHorizontalBounds(viewHolder);
        // Compute the final horizontal position of the view holder
        viewHolder.applyWidthBounds(widthMeasureSpec);
    }
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
            // If identifier is an array, loop through all the targets
            // and return the one which first matches the identifier
            for (const id of identifier) {
                const viewHolder = this.viewHolders.filter(holder => holder.id === id)[0];
                if (viewHolder) return viewHolder;
            }

            return PARENT_REF;
        }
        default:
            throw "Constraint value must either be a string or an array of strings";
    }
};

/**
 * Generates a measure spec for the horizontal bounds of a view holder.
 * When the bounds of a view holder is computed, the measure
 * spec aids in centering or value distribution
 */
ConstraintLayoutSolver.prototype.measureHorizontalBounds = function(viewHolder) {
    const { value: requestedWidth, spec: requestedSpec } = viewHolder.measureWidth(this.parent);
    const { width: parentWidth } = this.parent.getBoundingClientRect();

    const leftBound = (function(self) {
        if (viewHolder.isLeftConstrained) {
            const targetViewHolder = self.searchViewHolders(viewHolder.leftToLeftOf || viewHolder.leftToRightOf);
            if (targetViewHolder === PARENT_REF && viewHolder.leftToLeftOf) return 0;
            if (targetViewHolder === PARENT_REF && viewHolder.leftToRightOf) return parentWidth;
            if (targetViewHolder !== PARENT_REF && viewHolder.leftToLeftOf) return targetViewHolder.bounds.x1;
            if (targetViewHolder !== PARENT_REF && viewHolder.leftToRightOf) return targetViewHolder.bounds.x2;
        } else return 0;
    })(this);

    const rightBound = (function(self) {
        if (viewHolder.isRightConstrained) {
            const targetViewHolder = self.searchViewHolders(viewHolder.rightToRightOf || viewHolder.rightToLeftOf);
            if (targetViewHolder === PARENT_REF && viewHolder.rightToLeftOf) return 0;
            if (targetViewHolder === PARENT_REF && viewHolder.rightToRightOf) return parentWidth;
            if (targetViewHolder !== PARENT_REF && viewHolder.rightToLeftOf) return targetViewHolder.bounds.x1;
            if (targetViewHolder !== PARENT_REF && viewHolder.rightToRightOf) return targetViewHolder.bounds.x2;
        } else return 0;
    })(this);

    const availableWidth = (function() {
        if (viewHolder.isHorizontallyConstrained) {
            return Math.max(0, rightBound - leftBound);
        } else return parentWidth;
    })();

    if (requestedWidth <= availableWidth) {
        if (requestedSpec === MeasureSpec.UNSPECIFIED) {
            return new MeasureSpec(MeasureSpec.EXACTLY, availableWidth);
        } else return new MeasureSpec(MeasureSpec.EXACTLY, requestedWidth);
    } else return new MeasureSpec(MeasureSpec.EXACTLY, availableWidth);
};

/**
 * Generates a measure spec for the vertical bounds of a view holder.
 * When the bounds of a view holder is computed, the measure
 * spec aids in centering or value distribution
 */
// ConstraintLayoutSolver.prototype.measureVerticalBounds = function(viewHolder) {
//     const { value: requestedHeight } = viewHolder.measureHeight();
//     let bottomBound = requestedHeight;
//     let topBound = 0;
//
//     if (viewHolder.isTopConstrained) {
//         const targetViewHolder = this.searchViewHolders(viewHolder.topToTopOf || viewHolder.topToBottomOf);
//         if (targetViewHolder === PARENT_REF && viewHolder.topToBottomOf) topBound = this.parentHeightEstimate;
//         if (targetViewHolder !== PARENT_REF && viewHolder.topToTopOf) topBound = targetViewHolder.bounds.y1;
//         if (targetViewHolder !== PARENT_REF && viewHolder.topToBottomOf) topBound = targetViewHolder.bounds.y2;
//     }
//
//     if (viewHolder.isBottomConstrained) {
//         const targetViewHolder = this.searchViewHolders(viewHolder.bottomToBottomOf || viewHolder.bottomToTopOf);
//         if (targetViewHolder === PARENT_REF && viewHolder.bottomToBottomOf) bottomBound = this.parentHeightEstimate;
//         if (targetViewHolder !== PARENT_REF && viewHolder.bottomToBottomOf) bottomBound = targetViewHolder.bounds.y2;
//         if (targetViewHolder !== PARENT_REF && viewHolder.bottomToTopOf) bottomBound = targetViewHolder.bounds.y1;
//     }
//
//     const availableHeight = (() => {
//         if (viewHolder.isFullyVerticallyConstrained) {
//             return Math.max(0, bottomBound - topBound);
//         } else return this.parentHeightEstimate;
//     })();
//
//     if (requestedHeight <= availableHeight) {
//         if (requestedHeight === 0 && viewHolder.isFullyVerticallyConstrained) {
//             return new MeasureSpec(MeasureSpec.UNSPECIFIED, requestedHeight);
//         } else return new MeasureSpec(MeasureSpec.EXACTLY, requestedHeight);
//     } else return new MeasureSpec(MeasureSpec.AT_MOST, availableHeight);
// };
