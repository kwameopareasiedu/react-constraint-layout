import { ViewHolder } from "./view-holder";
import { GuideHolder } from "./guide-holder";
import { DimensionConstant } from "./dimension-constant";
import { ConstraintTarget } from "./constraint-target";
import { MeasureSpec } from "./measure-spec";
import { PARENT } from "../utils";

/**
 * The LayoutSolver is used by the ConstraintLayout to solve for the
 * position coordinates [(x1, y1) and (x2, y2)] of its children
 */
export function LayoutSolver() {}

/** Initializes the layout solver with the view and guide object data and the parent ref */
LayoutSolver.prototype.init = function(viewData, viewRefs, guideData, parent, autoHeight) {
    this.viewHolders = [];
    this.guideHolders = [];
    this.autoHeight = autoHeight;
    this.parent = parent;

    for (let i = 0; i < viewData.length; i++) {
        const viewHolder = new ViewHolder(viewData[i], viewRefs[i]);

        if (!this.viewIdIsUnique(viewHolder.id, this.viewHolders)) {
            throw `Duplicate ID: ${viewHolder.id}`;
        } else this.viewHolders.push(viewHolder);
    }

    for (let i = 0; i < guideData.length; i++) {
        const guideHolder = new GuideHolder(guideData[i], parent);

        if (!this.viewIdIsUnique(guideHolder.id, this.guideHolders)) {
            throw `Duplicate ID: ${guideHolder.id}`;
        } else this.guideHolders.push(guideHolder);
    }
};

/**
 * Invalidates the states of the view holders and guides. This in turn forces a
 * the solver to recompute positions of the views and guides
 */
LayoutSolver.prototype.invalidate = function() {
    this.updateGuides();
    this.updateWidth();
    this.updateHeight();
    this.applyStyles();
    // We'll need a second pass to recompute heights. Initially elements are all
    // full widths, upon applying constraints, most views will reduce in width
    // making their heights increase. The second pass will measure this change
    // in height and apply the corrections. This will only affect views whose
    // heights are defined as "match-content"
    this.updateHeight();
    this.applyStyles();
    // This last pass is to finalize the values as some elements have been
    // observed to shift position after "match-content" adjustments
    this.updateGuides();
    this.updateHeight();
    this.applyStyles();
};

/** Updates the state of the guide holders */
LayoutSolver.prototype.updateGuides = function() {
    // Update the bounds of the constraint guides before recomputing view holder bounds
    for (const holder of this.guideHolders) holder.updateBounds(this.parent);
};

/** Updates the state of the view holders */
LayoutSolver.prototype.updateWidth = function() {
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
                    if (constraint.type === ConstraintTarget.LEFT_TO_LEFT_OF) viewHolder.bounds.x1 = 0;
                    if (constraint.type === ConstraintTarget.LEFT_TO_RIGHT_OF) viewHolder.bounds.x1 = parentWidth;
                    if (constraint.type === ConstraintTarget.RIGHT_TO_RIGHT_OF) viewHolder.bounds.x2 = parentWidth;
                    if (constraint.type === ConstraintTarget.RIGHT_TO_LEFT_OF) viewHolder.bounds.x2 = 0;
                } else {
                    // Constrained to sibling view
                    if (constraint.type === ConstraintTarget.LEFT_TO_LEFT_OF) viewHolder.bounds.x1 = targetHolder.bounds.x1;
                    if (constraint.type === ConstraintTarget.LEFT_TO_RIGHT_OF) viewHolder.bounds.x1 = targetHolder.bounds.x2;
                    if (constraint.type === ConstraintTarget.RIGHT_TO_RIGHT_OF) viewHolder.bounds.x2 = targetHolder.bounds.x2;
                    if (constraint.type === ConstraintTarget.RIGHT_TO_LEFT_OF) viewHolder.bounds.x2 = targetHolder.bounds.x1;
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
LayoutSolver.prototype.measureHorizontalBounds = function(viewHolder) {
    const { width: parentWidth } = this.parent.getBoundingClientRect();

    // Use the view holder's props to determine the requested width value
    const { value: requestedWidth, spec: requestedSpec } = (function() {
        const { width: propWidth } = viewHolder;
        const { width: renderWidth } = viewHolder.view.getBoundingClientRect();
        const _propWidth = parseFloat(propWidth);
        const isNumeric = !isNaN(_propWidth);

        if (!isNumeric && propWidth === DimensionConstant.MATCH_PARENT) return new MeasureSpec(MeasureSpec.EXACTLY, parentWidth);
        if (!isNumeric && propWidth === DimensionConstant.MATCH_CONTENT) return new MeasureSpec(MeasureSpec.EXACTLY, renderWidth);
        if (isNumeric && parseFloat(propWidth) === 0 && viewHolder.isHorizontallyConstrained) return new MeasureSpec(MeasureSpec.UNSPECIFIED, 0);
        if (isNumeric && parseFloat(propWidth) === 0 && !viewHolder.isHorizontallyConstrained) return new MeasureSpec(MeasureSpec.EXACTLY, 0);
        if (isNumeric && parseFloat(propWidth) > 0) return new MeasureSpec(MeasureSpec.EXACTLY, _propWidth);
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
            return new MeasureSpec(MeasureSpec.EXACTLY, viewHolder.isHorizontallyConstrained ? availableWidth : 0);
        } else return new MeasureSpec(MeasureSpec.EXACTLY, requestedWidth);
    } else return new MeasureSpec(MeasureSpec.EXACTLY, availableWidth);
};

/** Updates the state of the view holders */
LayoutSolver.prototype.updateHeight = function() {
    // Solve the height constraints for each view holder linearly. Because views
    // are related to each other, preceeding views would have most likely been
    // fully positioned prior to views that depend on them via constraints
    const parentHeight = this.parent.scrollHeight;

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
                    if (constraint.type === ConstraintTarget.TOP_TO_TOP_OF) viewHolder.bounds.y1 = 0;
                    if (constraint.type === ConstraintTarget.TOP_TO_BOTTOM_OF) viewHolder.bounds.y1 = parentHeight;
                    if (constraint.type === ConstraintTarget.BOTTOM_TO_BOTTOM_OF) viewHolder.bounds.y2 = parentHeight;
                    if (constraint.type === ConstraintTarget.BOTTOM_TO_TOP_OF) viewHolder.bounds.y2 = 0;
                } else {
                    // Constrained to sibling view
                    if (constraint.type === ConstraintTarget.TOP_TO_TOP_OF) viewHolder.bounds.y1 = targetHolder.bounds.y1;
                    if (constraint.type === ConstraintTarget.TOP_TO_BOTTOM_OF) viewHolder.bounds.y1 = targetHolder.bounds.y2;
                    if (constraint.type === ConstraintTarget.BOTTOM_TO_BOTTOM_OF) viewHolder.bounds.y2 = targetHolder.bounds.y2;
                    if (constraint.type === ConstraintTarget.BOTTOM_TO_TOP_OF) viewHolder.bounds.y2 = targetHolder.bounds.y1;
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
LayoutSolver.prototype.measureVerticalBounds = function(viewHolder) {
    const parentHeight = this.parent.scrollHeight;

    // Use the view holder's props to determine the requested height value
    const { value: requestedHeight, spec: requestedSpec } = (function() {
        // To get the true rendered height,
        // 1. Clone the node...
        const clonedNode = viewHolder.view.cloneNode(true);
        // 2. Reset height and opacity on the cloned node
        clonedNode.style.height = "auto";
        clonedNode.style.opacity = "0.01";
        // 3. Append the cloned node to the body
        document.body.appendChild(clonedNode);
        const renderHeight = clonedNode.scrollHeight;
        // 4. Remove the cloned node from the body
        document.body.removeChild(clonedNode);

        const { height: propHeight } = viewHolder;
        const _propHeight = parseFloat(propHeight);
        const isNumeric = !isNaN(_propHeight);

        if (!isNumeric && propHeight === DimensionConstant.MATCH_PARENT) return new MeasureSpec(MeasureSpec.EXACTLY, parentHeight);
        if (!isNumeric && propHeight === DimensionConstant.MATCH_CONTENT) return new MeasureSpec(MeasureSpec.EXACTLY, renderHeight);
        if (isNumeric && _propHeight === 0 && viewHolder.isVerticallyConstrained) return new MeasureSpec(MeasureSpec.UNSPECIFIED, 0);
        if (isNumeric && _propHeight === 0 && !viewHolder.isVerticallyConstrained) return new MeasureSpec(MeasureSpec.EXACTLY, 0);
        if (isNumeric && _propHeight > 0) return new MeasureSpec(MeasureSpec.EXACTLY, _propHeight);
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
            return new MeasureSpec(MeasureSpec.EXACTLY, viewHolder.isVerticallyConstrained ? availableHeight : 0);
        } else return new MeasureSpec(MeasureSpec.EXACTLY, requestedHeight);
    } else return new MeasureSpec(MeasureSpec.EXACTLY, availableHeight);
};

/** Applies the computed positions to the views via the style component */
LayoutSolver.prototype.applyStyles = function() {
    let parentHeight = 0;

    for (const viewHolder of this.viewHolders) {
        viewHolder.view.style.position = "absolute";
        viewHolder.view.style.display = "block";
        viewHolder.view.style.margin = "0";
        viewHolder.view.style.overflow = "hidden";
        viewHolder.view.style.boxSizing = "border-box";
        viewHolder.view.style.top = `${viewHolder.position.y1}px`;
        viewHolder.view.style.left = `${viewHolder.position.x1}px`;
        viewHolder.view.style.width = `${viewHolder.position.x2 - viewHolder.position.x1}px`;
        viewHolder.view.style.height = `${viewHolder.position.y2 - viewHolder.position.y1}px`;

        if (viewHolder.position.y2 > parentHeight) parentHeight = viewHolder.position.y2;
    }

    // If autoParentHeight is true, compute the parent height from the views
    if (this.autoHeight) this.parent.style.height = `${parentHeight}px`;
};

/**
 * For an identifier value, this searches the set of view and guide holder objects
 * and returns the holder which first matches the identifier. If the identifier
 * is an array, the first matching entry is returned.
 * If no holder match is found, the parent reference is returned
 */
LayoutSolver.prototype.searchViewHolders = function(identifier) {
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

/** Checks if a viewId is unique in the list of views */
LayoutSolver.prototype.viewIdIsUnique = function(viewId, holders) {
    return holders.filter(holder => holder.id === viewId).length === 0;
};
