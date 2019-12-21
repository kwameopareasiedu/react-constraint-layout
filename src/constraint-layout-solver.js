import { ConstrainedViewHolder } from "./constrained-view-holder";
import { PARENT, Constraint, MeasureSpec, Dimension } from "./utils";
import { ConstraintGuideHolder } from "./constraint-guide-holder";

/**
 * The ConstraintLayoutSolver is used by the ConstraintLayout to solve for the
 * position coordinates [(x1, y1) and (x2, y2)] of its current children.
 */
export function ConstraintLayoutSolver(views, guides, refs, parent) {
    this.parent = parent;

    this.viewHolders = (function(self) {
        const holders = [];

        for (let i = 0; i < views.length; i++) {
            const viewHolder = new ConstrainedViewHolder(views[i], refs[i]);

            if (!self.viewIdIsUnique(viewHolder.id, holders)) {
                throw `Duplicate ID: ${viewHolder.id}`;
            } else holders.push(viewHolder);
        }

        return holders;
    })(this);

    this.guideHolders = (function(self) {
        const holders = [];

        for (let i = 0; i < guides.length; i++) {
            const guideHolder = new ConstraintGuideHolder(guides[i], parent);

            if (!self.viewIdIsUnique(guideHolder.id, holders)) {
                throw `Duplicate ID: ${guideHolder.id}`;
            } else holders.push(guideHolder);
        }

        return holders;
    })(this);
}

/**
 * Invalidates the states of the view holders and guides.
 * This in turn forces a the solver to recompute positions
 * of the views and guides
 */
ConstraintLayoutSolver.prototype.invalidate = function() {
    this.updateGuides();
    this.updateWidth();
    this.updateHeight();

    // After re-computation, apply the positions for each view holder
    for (const viewHolder of this.viewHolders) {
        viewHolder.ref.style.top = `${viewHolder.position.y1}px`;
        viewHolder.ref.style.left = `${viewHolder.position.x1}px`;
        viewHolder.ref.style.width = `${viewHolder.position.x2 - viewHolder.position.x1}px`;
        viewHolder.ref.style.height = `${viewHolder.position.y2 - viewHolder.position.y1}px`;
    }
};

/** Checks if a viewId is unique in the list of views */
ConstraintLayoutSolver.prototype.viewIdIsUnique = function(viewId, holders) {
    return holders.filter(holder => holder.id === viewId).length === 0;
};

/**
 * For an identifier value, this searches the set of view and guide holder objects
 * and returns the holder which first matches the identifier. If the identifier
 * is an array, the first matching entry is returned.
 * If no holder match is found, the parent reference is returned
 */
ConstraintLayoutSolver.prototype.searchViewHolders = function(identifier) {
    const holders = [...this.viewHolders, ...this.guideHolders];

    switch (Object.prototype.toString.call(identifier)) {
        case "[object String]":
            return holders.filter(holder => holder.id === identifier)[0] || PARENT;
        case "[object Array]": {
            for (const id of identifier) {
                const viewHolder = holders.filter(holder => holder.id === id)[0];
                if (viewHolder) return viewHolder;
            }

            return PARENT;
        }
        default:
            throw "Constraint value must either be a string or an array of strings";
    }
};

/** Updates the state of the guide holders */
ConstraintLayoutSolver.prototype.updateGuides = function() {
    // Update the bounds of the constraint guides before recomputing view holder bounds
    for (const holder of this.guideHolders) holder.updateBoundsIfPercent(this.parent);
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

                if (targetHolder === PARENT) {
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
        const { value } = this.measureHorizontalBounds(viewHolder);

        // Compute the final horizontal position of the view holder
        const leftBound = viewHolder.bounds.x1 + viewHolder.marginLeft;
        const rightBound = viewHolder.bounds.x2 - viewHolder.marginRight;

        if (viewHolder.isHorizontallyConstrained) {
            const widthBound = rightBound - leftBound;
            const wiggleRoom = Math.max(widthBound - value, 0);
            viewHolder.position.x1 = leftBound + viewHolder.horizontalBias * wiggleRoom;
            viewHolder.position.x2 = rightBound - viewHolder.horizontalBias * wiggleRoom;
        } else if (viewHolder.isLeftConstrained) {
            viewHolder.position.x1 = leftBound;
            viewHolder.position.x2 = leftBound + value;
        } else if (viewHolder.isRightConstrained) {
            viewHolder.position.x2 = rightBound;
            viewHolder.position.x1 = rightBound - value;
        } else {
            viewHolder.position.x1 = viewHolder.marginLeft;
            viewHolder.position.x2 = viewHolder.marginLeft + value;
        }

        // After positioning, reduce the bounds to fit exactly around the component
        viewHolder.bounds.x1 = viewHolder.position.x1;
        viewHolder.bounds.x2 = viewHolder.position.x2;
    }
};

/**
 * Generates a measure spec for the horizontal bounds of a view holder.
 * When the bounds of a view holder is computed, the measure
 * spec aids in centering or value distribution
 */
ConstraintLayoutSolver.prototype.measureHorizontalBounds = function(viewHolder) {
    const { width: parentWidth } = this.parent.getBoundingClientRect();

    // Use the view holder's props to determine the requested width value
    const { value: requestedWidth, spec: requestedSpec } = (function() {
        const { width: propWidth } = viewHolder.view.props;
        const { width: renderWidth } = viewHolder.ref.getBoundingClientRect();
        const propWidthIsNumeric = Object.prototype.toString.call(propWidth) === "[object Number]";

        if (propWidth === Dimension.MATCH_PARENT) return new MeasureSpec(MeasureSpec.EXACTLY, parentWidth);
        if (propWidth === Dimension.MATCH_CONTENT) return new MeasureSpec(MeasureSpec.EXACTLY, renderWidth);
        if (propWidthIsNumeric && propWidth === 0 && viewHolder.isHorizontallyConstrained) return new MeasureSpec(MeasureSpec.UNSPECIFIED, 0);
        if (propWidthIsNumeric && propWidth === 0 && !viewHolder.isHorizontallyConstrained) return new MeasureSpec(MeasureSpec.EXACTLY, 0);
        if (propWidthIsNumeric && propWidth > 0) return new MeasureSpec(MeasureSpec.EXACTLY, propWidth);
        return new MeasureSpec(MeasureSpec.UNSPECIFIED, 0);
    })();

    const leftBound = (function(self) {
        if (viewHolder.isLeftConstrained) {
            const targetViewHolder = self.searchViewHolders(viewHolder.leftToLeftOf || viewHolder.leftToRightOf);
            if (targetViewHolder === PARENT && viewHolder.leftToLeftOf) return 0;
            if (targetViewHolder === PARENT && viewHolder.leftToRightOf) return parentWidth;
            if (targetViewHolder !== PARENT && viewHolder.leftToLeftOf) return targetViewHolder.bounds.x1;
            if (targetViewHolder !== PARENT && viewHolder.leftToRightOf) return targetViewHolder.bounds.x2;
        } else return 0;
    })(this);

    const rightBound = (function(self) {
        if (viewHolder.isRightConstrained) {
            const targetViewHolder = self.searchViewHolders(viewHolder.rightToRightOf || viewHolder.rightToLeftOf);
            if (targetViewHolder === PARENT && viewHolder.rightToLeftOf) return 0;
            if (targetViewHolder === PARENT && viewHolder.rightToRightOf) return parentWidth;
            if (targetViewHolder !== PARENT && viewHolder.rightToLeftOf) return targetViewHolder.bounds.x1;
            if (targetViewHolder !== PARENT && viewHolder.rightToRightOf) return targetViewHolder.bounds.x2;
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

/** Updates the state of the view holders */
ConstraintLayoutSolver.prototype.updateHeight = function() {
    // Solve the height constraints for each view holder linearly. Because views
    // are related to each other, preceeding views would have most likely been
    // fully positioned prior to views that depend on them via constraints
    const { height: parentHeight } = this.parent.getBoundingClientRect();

    for (const viewHolder of this.viewHolders) {
        // If it is not constrained vertically, use the parent bounds as its bounds...
        if (!viewHolder.isTopConstrained && !viewHolder.isBottomConstrained) {
            viewHolder.bounds.y1 = 0;
            viewHolder.bounds.y2 = parentHeight;
        } else {
            // ...else use the constraints to determine the bounds of the view
            for (const constraint of viewHolder.constraints) {
                const targetHolder = this.searchViewHolders(constraint.target);

                if (targetHolder === PARENT) {
                    // Constrained to parent view
                    if (constraint.type === Constraint.TOP_TO_TOP_OF) viewHolder.bounds.y1 = 0;
                    if (constraint.type === Constraint.TOP_TO_BOTTOM_OF) viewHolder.bounds.y1 = parentHeight;
                    if (constraint.type === Constraint.BOTTOM_TO_BOTTOM_OF) viewHolder.bounds.y2 = parentHeight;
                    if (constraint.type === Constraint.BOTTOM_TO_TOP_OF) viewHolder.bounds.y2 = 0;
                } else {
                    // Constrained to sibling view
                    if (constraint.type === Constraint.TOP_TO_TOP_OF) viewHolder.bounds.y1 = targetHolder.bounds.y1;
                    if (constraint.type === Constraint.TOP_TO_BOTTOM_OF) viewHolder.bounds.y1 = targetHolder.bounds.y2;
                    if (constraint.type === Constraint.BOTTOM_TO_BOTTOM_OF) viewHolder.bounds.y2 = targetHolder.bounds.y2;
                    if (constraint.type === Constraint.BOTTOM_TO_TOP_OF) viewHolder.bounds.y2 = targetHolder.bounds.y1;
                }
            }
        }

        // Compute the final height measure spec from the bounds and constraints
        const { value } = this.measureVerticalBounds(viewHolder);

        // Compute the final vertical position of the view holder
        const topBound = viewHolder.bounds.y1 + viewHolder.marginTop;
        const bottomBound = viewHolder.bounds.y2 - viewHolder.marginBottom;

        if (viewHolder.isVerticallyConstrained) {
            const heightBound = bottomBound - topBound;
            const wiggleRoom = Math.max(heightBound - value, 0);
            viewHolder.position.y1 = topBound + viewHolder.verticalBias * wiggleRoom;
            viewHolder.position.y2 = topBound + viewHolder.verticalBias * wiggleRoom + value;
        } else if (viewHolder.isTopConstrained) {
            viewHolder.position.y1 = topBound;
            viewHolder.position.y2 = topBound + value;
        } else if (viewHolder.isBottomConstrained) {
            viewHolder.position.y2 = bottomBound;
            viewHolder.position.y1 = bottomBound - value;
        } else {
            viewHolder.position.y1 = viewHolder.marginTop;
            viewHolder.position.y2 = viewHolder.marginTop + value;
        }

        // After positioning, reduce the bounds to fit exactly around the component
        viewHolder.bounds.y1 = viewHolder.position.y1;
        viewHolder.bounds.y2 = viewHolder.position.y2;
    }
};

/**
 * Generates a measure spec for the vertical bounds of a view holder.
 * When the bounds of a view holder is computed, the measure
 * spec aids in centering or value distribution
 */
ConstraintLayoutSolver.prototype.measureVerticalBounds = function(viewHolder) {
    const { height: parentHeight } = this.parent.getBoundingClientRect();

    // Use the view holder's props to determine the requested height value
    const { value: requestedHeight, spec: requestedSpec } = (function() {
        const { height: propHeight } = viewHolder.view.props;
        const { height: renderHeight } = viewHolder.ref.getBoundingClientRect();
        const propHeightIsNumeric = Object.prototype.toString.call(propHeight) === "[object Number]";

        if (propHeight === Dimension.MATCH_PARENT) return new MeasureSpec(MeasureSpec.EXACTLY, parentHeight);
        if (propHeight === Dimension.MATCH_CONTENT) return new MeasureSpec(MeasureSpec.EXACTLY, renderHeight);
        if (propHeightIsNumeric && propHeight === 0 && viewHolder.isVerticallyConstrained) return new MeasureSpec(MeasureSpec.UNSPECIFIED, 0);
        if (propHeightIsNumeric && propHeight === 0 && !viewHolder.isVerticallyConstrained) return new MeasureSpec(MeasureSpec.EXACTLY, 0);
        if (propHeightIsNumeric && propHeight > 0) return new MeasureSpec(MeasureSpec.EXACTLY, propHeight);
        return new MeasureSpec(MeasureSpec.UNSPECIFIED, 0);
    })();

    const topBound = (function(self) {
        if (viewHolder.isTopConstrained) {
            const targetViewHolder = self.searchViewHolders(viewHolder.topToTopOf || viewHolder.topToBottomOf);
            if (targetViewHolder === PARENT && viewHolder.topToTopOf) return 0;
            if (targetViewHolder === PARENT && viewHolder.topToBottomOf) return parentHeight;
            if (targetViewHolder !== PARENT && viewHolder.topToTopOf) return targetViewHolder.bounds.y1;
            if (targetViewHolder !== PARENT && viewHolder.topToBottomOf) return targetViewHolder.bounds.y2;
        } else return 0;
    })(this);

    const bottomBound = (function(self) {
        if (viewHolder.isBottomConstrained) {
            const targetViewHolder = self.searchViewHolders(viewHolder.bottomToBottomOf || viewHolder.bottomToTopOf);
            if (targetViewHolder === PARENT && viewHolder.bottomToTopOf) return 0;
            if (targetViewHolder === PARENT && viewHolder.bottomToBottomOf) return parentHeight;
            if (targetViewHolder !== PARENT && viewHolder.bottomToTopOf) return targetViewHolder.bounds.y1;
            if (targetViewHolder !== PARENT && viewHolder.bottomToBottomOf) return targetViewHolder.bounds.y2;
        } else return 0;
    })(this);

    const availableHeight = (function() {
        if (viewHolder.isVerticallyConstrained) {
            return Math.max(0, bottomBound - topBound);
        } else return parentHeight;
    })();

    if (requestedHeight <= availableHeight) {
        if (requestedSpec === MeasureSpec.UNSPECIFIED) {
            return new MeasureSpec(MeasureSpec.EXACTLY, availableHeight);
        } else return new MeasureSpec(MeasureSpec.EXACTLY, requestedHeight);
    } else return new MeasureSpec(MeasureSpec.EXACTLY, availableHeight);
};
