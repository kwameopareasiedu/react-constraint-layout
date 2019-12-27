declare module "react-constraint-layout" {
    // @ts-ignore
    import React from "react";

    interface ConstraintProps {
        /** The view width in pixels */
        width: number | string;
        /** The view height in pixels */
        height: number | string;
        /** Top margin of the view relative to a constrained view on the top */
        marginTop?: number | string;
        /** Left margin of the view relative to a constrained view on the left */
        marginLeft?: number | string;
        /** Right margin of the view relative to a constrained view on the right */
        marginRight?: number | string;
        /** Bottom margin of the view relative to a constrained view on the bottom */
        marginBottom?: number | string;
        /** Indicates that the left of a view is aligned with the left of another view */
        leftToLeftOf?: string | Array<string>;
        /** Indicates that the left of a view is aligned with the right of another view */
        leftToRightOf?: string | Array<string>;
        /** Indicates that the right of a view is aligned with the right of another view */
        rightToRightOf?: string | Array<string>;
        /** Indicates that the right of a view is aligned with the left of another view */
        rightToLeftOf?: string | Array<string>;
        /** Indicates that the top of a view is aligned with the top of another view */
        topToTopOf?: string | Array<string>;
        /** Indicates that the top of a view is aligned with the bottom of another view */
        topToBottomOf?: string | Array<string>;
        /** Indicates that the bottom of a view is aligned with the bottom of another view */
        bottomToBottomOf?: string | Array<string>;
        /** Indicates that the bottom of a view is aligned with the top of another view */
        bottomToTopOf?: string | Array<string>;
        /** The horizontal bias of the component of the view if the width is less than the bound. Valid range is 0 to 100 */
        horizontalBias?: number;
        /** The vertical bias of the component of the view if the height is less than the bound. Valid range is 0 to 100 */
        verticalBias?: number;
    }

    enum ConstraintGuideOrientation {
        vertical,
        horizontal
    }

    interface ConstraintLayoutProps extends ConstraintProps {
        /** ID of the guide. Necessary if other views are constrained to it */
        id?: string;
        /** Class of the layout */
        className?: string;
    }

    interface ConstrainedViewProps extends ConstraintProps, React.HTMLProps {
        /** Component name (or function) of the view. Defaults to "div" */
        as?: string | Function;
    }

    interface ConstraintGuideProps {
        /** ID of the guide. Necessary if other views are constrained to it */
        id: string;
        /** Orientation of the guide. Can either be "horizontal" or "vertical" */
        orientation: ConstraintGuideOrientation;
        /** Percentage of the parent ConstraintLayout's width from the left (or height from the top, if orientation is "vertical") */
        percent?: number | string;
        /** Number of pixels from left of parent ConstraintLayout's (or from top, if orientation is "vertical") */
        begin?: number | string;
        /** Number of pixels from right of parent ConstraintLayout's (or from bottom, if orientation is "vertical") */
        end?: number | string;
    }

    export const ConstraintLayout: React.FunctionComponent<ConstraintLayoutProps>;
    export const ConstrainedView: React.FunctionComponent<ConstrainedViewProps>;
    export const ConstraintGuide: React.FunctionComponent<ConstraintGuideProps>;

    /**  A reference to the current parent of a view. Same as "_parent" */
    export const PARENT: string;

    /**
     * A react hook that returns state variables for specified window breakpoints. This is useful
     * if some components are conditionally rendered at certaint window breakpoints.
     * @param {Array} breakpoints An array of breakpoints sizes. Defaults to [576, 768, 992, 1200]
     * @returns {Array} An array of same size as sizes with boolean state variables corresponding to
     * each specified breakpoints that indicate if the window size has exceeded that breakpoint
     */
    export const useWindowBreakpoints: Function;
}
