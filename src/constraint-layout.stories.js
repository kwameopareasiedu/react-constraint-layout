import React from "react";
import { storiesOf } from "@storybook/react";
import { ConstraintLayout } from "././constraint-layout";
import { ConstrainedView } from "./constrained-view";

storiesOf("ConstraintLayout", module).add("default", () => {
    return (
        <ConstraintLayout height="200px">
            <ConstrainedView id="view1" width="match-parent" height="match-content" leftToLeftOf="parent" rightToRightOf="parent">
                <p style={{ backgroundColor: "red" }}>First constrained view</p>
            </ConstrainedView>

            <ConstrainedView id="view2" width="match-content" height="match-content" marginLeft={200} topToBottomOf="view1">
                <p style={{ backgroundColor: "blue" }}>Second constrained view</p>
            </ConstrainedView>

            <ConstrainedView id="view3" width="match-content" height="match-content" rightToRightOf="view1" marginRight={100}>
                <p style={{ backgroundColor: "yellow" }}>Third constrained view</p>
            </ConstrainedView>

            <ConstrainedView id="view4" width={200} height="match-content" leftToLeftOf="view1" rightToRightOf="view1" marginLeft={50}>
                <p style={{ backgroundColor: "green" }}>Fourth constrained view</p>
            </ConstrainedView>
        </ConstraintLayout>
    );
});
