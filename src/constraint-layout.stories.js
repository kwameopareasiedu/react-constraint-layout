import React from "react";
import { PARENT } from "./utils";
import { ConstraintLayout } from "././constraint-layout";
import { ConstrainedView } from "./constrained-view";
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
                width={0}
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
                width={0}
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
        <ConstraintLayout width="320px" height="450px" style={{ backgroundColor: "#f3f3f3" }}>
            <ConstrainedView
                id="topbar"
                width="match-parent"
                height={56}
                leftToLeftOf={PARENT}
                rightToRightOf={PARENT}
                style={{
                    color: "white",
                    backgroundColor: "#4e1ebb",
                    padding: "15px 0 0 15px"
                }}>
                React Web
            </ConstrainedView>

            <ConstrainedView
                id="logo"
                height={150}
                width="match-parent"
                leftToLeftOf="parent"
                rightToRightOf="parent"
                topToBottomOf="topbar"
                style={{ boxShadow: "2px 2px 40px -24px #999" }}>
                <img
                    src={ReactLogo}
                    alt="React logo"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                />
            </ConstrainedView>

            <ConstrainedView
                id="fab"
                width={48}
                height={48}
                topToBottomOf="logo"
                rightToRightOf={PARENT}
                marginRight="24px"
                marginTop="-24px"
                style={{
                    backgroundColor: "#d9d",
                    borderRadius: "24px",
                    padding: "12px 15px",
                    color: "white"
                }}>
                <i className="fa fa-star" />
            </ConstrainedView>

            <ConstrainedView
                id="phone"
                width={48}
                height={48}
                topToBottomOf="fab"
                leftToLeftOf={PARENT}
                marginTop="15px"
                style={{ padding: "0 19px" }}>
                <i className="fas fa-mobile-alt" style={{ color: "#4e1ebb" }} />
            </ConstrainedView>

            <ConstrainedView
                id="message"
                width={48}
                height={48}
                topToTopOf="phone"
                rightToRightOf={PARENT}
                marginRight="24px"
                style={{ padding: "0 15px" }}>
                <i className="fas fa-comment-dots" style={{ color: "#1ebbad" }} />
            </ConstrainedView>

            <ConstrainedView
                id="phone-number"
                width={0}
                height={50}
                leftToRightOf="phone"
                rightToLeftOf="message"
                topToTopOf="phone"
                marginLeft="24px">
                (650) 555-1234 <br />
                <small>Google voice</small>
            </ConstrainedView>

            <ConstrainedView
                id="message2"
                width={48}
                height={48}
                topToBottomOf="phone-number"
                rightToRightOf={PARENT}
                marginTop="16px"
                marginRight="24px"
                style={{ padding: "0 15px" }}>
                <i className="fas fa-comment-dots" style={{ color: "#1ebbad" }} />
            </ConstrainedView>

            <ConstrainedView
                id="phone-number2"
                width={0}
                height={50}
                leftToRightOf="phone"
                rightToLeftOf="message2"
                topToTopOf="message2"
                marginLeft="24px">
                (650) 555-4321 <br />
                <small>Mobile</small>
            </ConstrainedView>

            <ConstrainedView
                id="rule"
                width={0}
                height={3}
                topToBottomOf="phone-number2"
                leftToLeftOf={PARENT}
                rightToRightOf={PARENT}
                marginTop="16px"
                marginLeft="72px"
                marginRight="12px"
                style={{ backgroundColor: "#aeaeae" }}
            />

            <ConstrainedView
                id="email"
                width={48}
                height={48}
                topToBottomOf="rule"
                leftToLeftOf={PARENT}
                marginTop="15px"
                style={{ padding: "0 19px" }}>
                <i className="fas fa-envelope" style={{ color: "#4e1ebb" }} />
            </ConstrainedView>

            <ConstrainedView
                id="email-address"
                width={0}
                height={50}
                leftToRightOf="email"
                rightToRightOf={PARENT}
                topToTopOf="email"
                marginLeft="24px">
                studio@react.com <br />
                <small>Work</small>
            </ConstrainedView>
        </ConstraintLayout>
    );
};
