declare module "react-constraint-layout" {
    // @ts-ignore
    import React from "react";

    enum ConstraintGuideOrientation {
        vertical,
        horizontal
    }

    interface ConstraintLayoutProps {
        /** ID of the guide. Necessary if other views are constrained to it */
        id?: string;
        /** Class of the layout */
        className?: string;
        /** The view width in pixels */
        width?: number | string;
        /** The view height in pixels */
        height?: number | string;
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
        /** Same as width but for small screens (576px to 768px) */
        sm_width?: number | string;
        /** Same as width but for small screens (576px to 768px) */
        sm_height?: number | string;
        /** Same as width but for small screens (576px to 768px) */
        sm_marginTop?: number | string;
        /** Same as width but for small screens (576px to 768px) */
        sm_marginLeft?: number | string;
        /** Same as width but for small screens (576px to 768px) */
        sm_marginRight?: number | string;
        /** Same as width but for small screens (576px to 768px) */
        sm_marginBottom?: number | string;
        /** Same as width but for small screens (576px to 768px) */
        sm_leftToLeftOf?: string | Array<string>;
        /** Same as width but for small screens (576px to 768px) */
        sm_leftToRightOf?: string | Array<string>;
        /** Same as width but for small screens (576px to 768px) */
        sm_rightToRightOf?: string | Array<string>;
        /** Same as width but for small screens (576px to 768px) */
        sm_rightToLeftOf?: string | Array<string>;
        /** Same as width but for small screens (576px to 768px) */
        sm_topToTopOf?: string | Array<string>;
        /** Same as width but for small screens (576px to 768px) */
        sm_topToBottomOf?: string | Array<string>;
        /** Same as width but for small screens (576px to 768px) */
        sm_bottomToBottomOf?: string | Array<string>;
        /** Same as width but for small screens (576px to 768px) */
        sm_bottomToTopOf?: string | Array<string>;
        /** Same as width but for small screens (576px to 768px) */
        sm_horizontalBias?: number;
        /** Same as width but for small screens (576px to 768px) */
        sm_verticalBias?: number;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_width?: number | string;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_height?: number | string;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_marginTop?: number | string;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_marginLeft?: number | string;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_marginRight?: number | string;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_marginBottom?: number | string;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_leftToLeftOf?: string | Array<string>;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_leftToRightOf?: string | Array<string>;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_rightToRightOf?: string | Array<string>;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_rightToLeftOf?: string | Array<string>;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_topToTopOf?: string | Array<string>;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_topToBottomOf?: string | Array<string>;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_bottomToBottomOf?: string | Array<string>;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_bottomToTopOf?: string | Array<string>;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_horizontalBias?: number;
        /** Same as width but for medium-size screens (768px to 992px) */
        md_verticalBias?: number;
        /** Same as width but for large screens (992px to 1200px) */
        lg_width?: number | string;
        /** Same as width but for large screens (992px to 1200px) */
        lg_height?: number | string;
        /** Same as width but for large screens (992px to 1200px) */
        lg_marginTop?: number | string;
        /** Same as width but for large screens (992px to 1200px) */
        lg_marginLeft?: number | string;
        /** Same as width but for large screens (992px to 1200px) */
        lg_marginRight?: number | string;
        /** Same as width but for large screens (992px to 1200px) */
        lg_marginBottom?: number | string;
        /** Same as width but for large screens (992px to 1200px) */
        lg_leftToLeftOf?: string | Array<string>;
        /** Same as width but for large screens (992px to 1200px) */
        lg_leftToRightOf?: string | Array<string>;
        /** Same as width but for large screens (992px to 1200px) */
        lg_rightToRightOf?: string | Array<string>;
        /** Same as width but for large screens (992px to 1200px) */
        lg_rightToLeftOf?: string | Array<string>;
        /** Same as width but for large screens (992px to 1200px) */
        lg_topToTopOf?: string | Array<string>;
        /** Same as width but for large screens (992px to 1200px) */
        lg_topToBottomOf?: string | Array<string>;
        /** Same as width but for large screens (992px to 1200px) */
        lg_bottomToBottomOf?: string | Array<string>;
        /** Same as width but for large screens (992px to 1200px) */
        lg_bottomToTopOf?: string | Array<string>;
        /** Same as width but for large screens (992px to 1200px) */
        lg_horizontalBias?: number;
        /** Same as width but for large screens (992px to 1200px) */
        lg_verticalBias?: number;
        /** Same as width but for extra large screens (1200px+) */
        xl_width?: number | string;
        /** Same as width but for extra large screens (1200px+) */
        xl_height?: number | string;
        /** Same as width but for extra large screens (1200px+) */
        xl_marginTop?: number | string;
        /** Same as width but for extra large screens (1200px+) */
        xl_marginLeft?: number | string;
        /** Same as width but for extra large screens (1200px+) */
        xl_marginRight?: number | string;
        /** Same as width but for extra large screens (1200px+) */
        xl_marginBottom?: number | string;
        /** Same as width but for extra large screens (1200px+) */
        xl_leftToLeftOf?: string | Array<string>;
        /** Same as width but for extra large screens (1200px+) */
        xl_leftToRightOf?: string | Array<string>;
        /** Same as width but for extra large screens (1200px+) */
        xl_rightToRightOf?: string | Array<string>;
        /** Same as width but for extra large screens (1200px+) */
        xl_rightToLeftOf?: string | Array<string>;
        /** Same as width but for extra large screens (1200px+) */
        xl_topToTopOf?: string | Array<string>;
        /** Same as width but for extra large screens (1200px+) */
        xl_topToBottomOf?: string | Array<string>;
        /** Same as width but for extra large screens (1200px+) */
        xl_bottomToBottomOf?: string | Array<string>;
        /** Same as width but for extra large screens (1200px+) */
        xl_bottomToTopOf?: string | Array<string>;
        /** Same as width but for extra large screens (1200px+) */
        xl_horizontalBias?: number;
        /** Same as width but for extra large screens (1200px+) */
        xl_verticalBias?: number;
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
    export const ConstraintGuide: React.FunctionComponent<ConstraintGuideProps>;

    /**  A reference to the current parent of a view. Same as "_parent" */
    export const PARENT: string;
}
