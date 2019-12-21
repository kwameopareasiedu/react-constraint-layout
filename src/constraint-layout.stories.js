import React from "react";
import { PARENT } from "./utils";
import { action } from "@storybook/addon-actions";
import { ConstrainedView } from "./constrained-view";
import { ConstraintGuide } from "./constraint-guide";
import { ConstraintLayout } from "././constraint-layout";
import ReactLogo from "../preview-img/react-logo.jpg";

// noinspection JSUnusedGlobalSymbols
export default {
    title: "ConstraintLayout",
    component: ConstraintLayout
};

// noinspection JSUnusedGlobalSymbols
export const preview1 = () => {
    return (
        <ConstraintLayout width="240px" height="450px">
            <ConstrainedView id="anchor" width={1} height={1} leftToLeftOf={PARENT} rightToRightOf={PARENT} />

            <ConstrainedView
                id="view1"
                height={150}
                width="match-parent"
                leftToLeftOf="parent"
                rightToRightOf="parent"
                topToTopOf={PARENT}
                bottomToBottomOf={PARENT}
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
                height={40}
                as="button"
                className="btn btn-primary btn-block"
                leftToLeftOf={PARENT}
                rightToRightOf="anchor"
                topToBottomOf="view3"
                marginLeft="15px"
                marginTop="15px"
                marginRight="7.5px">
                Rent now
            </ConstrainedView>

            <ConstrainedView
                id="view5"
                height={40}
                as="button"
                className="btn btn-warning btn-block"
                rightToRightOf={PARENT}
                leftToLeftOf="anchor"
                topToTopOf="view4"
                marginLeft={15}
                marginRight={7.5}>
                Buy now
            </ConstrainedView>

            <ConstrainedView
                id="view6"
                height={1}
                topToBottomOf="view4"
                leftToLeftOf={PARENT}
                rightToRightOf={PARENT}
                marginLeft="15px"
                marginTop="15px"
                marginRight="15px"
                style={{ backgroundColor: "#e3e3e3" }}
            />

            <ConstrainedView
                as="p"
                id="view7"
                height={0}
                width="match-parent"
                className="text-center"
                bottomToBottomOf={PARENT}
                topToBottomOf="view6"
                marginTop={15}
                verticalBias={0}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis.
                Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.
            </ConstrainedView>
        </ConstraintLayout>
    );
};

export const preview2 = () => {
    return (
        <ConstraintLayout width="320px" height="475px" style={{ backgroundColor: "#f9f9f9" }}>
            <ConstrainedView
                id="topbar"
                height={56}
                width="match-parent"
                style={{ color: "white", backgroundColor: "#4e1ebb", padding: "15px 0 0 15px" }}>
                <strong>React Web</strong>
            </ConstrainedView>

            <ConstrainedView id="logo" height={150} width="match-parent" topToBottomOf="topbar" style={{ boxShadow: "2px 2px 8px #d4d4d4" }}>
                <img src={ReactLogo} alt="React logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </ConstrainedView>

            <ConstrainedView
                id="fab"
                width={48}
                height={48}
                as="button"
                marginTop="-24px"
                marginRight="24px"
                topToBottomOf="logo"
                rightToRightOf={PARENT}
                onClick={() => action("Button click")("Clicked")}
                style={{ backgroundColor: "#d9d", borderRadius: "24px", padding: "12px 15px", color: "white", outline: "none", border: "none" }}>
                <i className="fa fa-star" />
            </ConstrainedView>

            <ConstraintGuide id="guide1" orientation="vertical" begin={48} />

            <ConstraintGuide id="guide2" orientation="vertical" end={48} />

            <ConstrainedView
                id="phone"
                height={48}
                marginTop="15px"
                marginLeft="24px"
                topToBottomOf="fab"
                leftToLeftOf={PARENT}
                rightToLeftOf="guide1">
                <i className="fas fa-mobile-alt" style={{ color: "#4e1ebb" }} />
            </ConstrainedView>

            <ConstrainedView id="message" height={48} topToTopOf="phone" leftToRightOf="guide2" rightToRightOf={PARENT}>
                <i className="fas fa-comment-dots" style={{ color: "#1ebbad" }} />
            </ConstrainedView>

            <ConstrainedView id="phone-number" height={50} leftToRightOf="guide1" rightToLeftOf="guide1" topToTopOf="phone" marginLeft="24px">
                (650) 555-1234 <br />
                <small>Google voice</small>
            </ConstrainedView>

            <ConstrainedView
                id="message2"
                height={48}
                marginTop="15px"
                marginRight="24px"
                leftToRightOf="guide2"
                rightToRightOf={PARENT}
                topToBottomOf="phone-number">
                <i className="fas fa-comment-dots" style={{ color: "#1ebbad" }} />
            </ConstrainedView>

            <ConstrainedView id="phone-number2" height={50} leftToRightOf="guide1" rightToLeftOf="guide2" topToTopOf="message2" marginLeft="24px">
                (650) 555-4321 <br />
                <small>Mobile</small>
            </ConstrainedView>

            <ConstrainedView
                id="rule"
                height={3}
                marginTop="16px"
                marginLeft="24px"
                leftToRightOf="guide1"
                rightToRightOf={PARENT}
                topToBottomOf="phone-number2"
                style={{ backgroundColor: "#aeaeae" }}
            />

            <ConstrainedView
                id="email"
                height={48}
                marginTop="15px"
                marginLeft="24px"
                topToBottomOf="rule"
                leftToLeftOf={PARENT}
                rightToLeftOf="guide1">
                <i className="fas fa-envelope" style={{ color: "#4e1ebb" }} />
            </ConstrainedView>

            <ConstrainedView id="email-address" height={50} marginLeft="24px" topToTopOf="email" leftToRightOf="guide1" rightToRightOf={PARENT}>
                studio@react.com <br />
                <small>Work</small>
            </ConstrainedView>
        </ConstraintLayout>
    );
};
