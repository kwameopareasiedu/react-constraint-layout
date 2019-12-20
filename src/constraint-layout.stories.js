import React from "react";
import { storiesOf } from "@storybook/react";
import { ConstraintLayout } from "././constraint-layout";
import { ConstrainedView } from "./constrained-view";
import { PARENT_REF } from "./utils";

storiesOf("ConstraintLayout", module).add("default", () => {
    return (
        <ConstraintLayout width="240px" height="450px">
            <ConstrainedView id="anchor" width={1} height={1} leftToLeftOf={PARENT_REF} rightToRightOf={PARENT_REF} />

            <ConstrainedView
                id="view1"
                height={150}
                width="match-parent"
                leftToLeftOf="parent"
                rightToRightOf="parent"
                topToTopOf={PARENT_REF}
                bottomToBottomOf={PARENT_REF}
                style={{ backgroundColor: "red" }}
                verticalBias={0}
            />

            <ConstrainedView
                id="view2"
                width={75}
                height={75}
                marginTop="-40px"
                marginLeft="15px"
                topToBottomOf="view1"
                style={{ backgroundColor: "yellow" }}
            />

            <ConstrainedView
                as="h5"
                id="view3"
                width={0}
                height={50}
                topToBottomOf="view1"
                leftToRightOf="view2"
                rightToRightOf="view1"
                marginLeft="20px"
                marginTop="15px">
                Beauty and the Beast
            </ConstrainedView>

            <ConstrainedView
                id="view4"
                width={0}
                height={40}
                as="button"
                className="btn btn-primary btn-block"
                leftToLeftOf={PARENT_REF}
                rightToRightOf="anchor"
                topToBottomOf="view3"
                marginLeft="15px"
                marginTop="15px"
                marginRight="7.5px">
                Rent now
            </ConstrainedView>

            <ConstrainedView
                id="view5"
                width={0}
                height={40}
                as="button"
                className="btn btn-warning btn-block"
                rightToRightOf={PARENT_REF}
                leftToLeftOf="anchor"
                topToTopOf="view4"
                marginLeft={15}
                marginRight={7.5}>
                Buy now
            </ConstrainedView>

            <ConstrainedView
                id="view6"
                height={1}
                width="match-parent"
                topToBottomOf="view4"
                marginTop="15px"
                style={{ backgroundColor: "#e3e3e3" }}
            />

            <ConstrainedView
                as="p"
                id="view7"
                height={0}
                width="match-parent"
                className="text-center"
                bottomToBottomOf={PARENT_REF}
                topToBottomOf="view6"
                marginTop={15}
                verticalBias={0}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis.
                Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.
            </ConstrainedView>
        </ConstraintLayout>
    );
});
