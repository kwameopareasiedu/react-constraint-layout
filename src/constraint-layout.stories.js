import React from "react";
import { storiesOf } from "@storybook/react";
import { ConstraintLayout } from "././constraint-layout";
import { ConstrainedView } from "./constrained-view";

storiesOf("ConstraintLayout", module).add("default", () => {
    return (
        <ConstraintLayout>
            <ConstrainedView id="view1" width="match_parent" leftToLeftOf="parent" rightToRightOf="parent">
                <p style={{ backgroundColor: "red" }}>First constrained view</p>
            </ConstrainedView>

            <ConstrainedView id="view2" width="match_content" marginLeft={200}>
                <p style={{ backgroundColor: "blue" }}>Second constrained view</p>
            </ConstrainedView>

            <ConstrainedView id="view3" width="match_content" rightToRightOf="view1" marginRight={100}>
                <p style={{ backgroundColor: "yellow" }}>Third constrained view</p>
            </ConstrainedView>

            <ConstrainedView id="view4" width={200} leftToLeftOf="view1" rightToRightOf="view1">
                <p style={{ backgroundColor: "green" }}>Fourth constrained view</p>
            </ConstrainedView>
        </ConstraintLayout>
    );
});
