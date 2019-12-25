import React from "react";
import { action } from "@storybook/addon-actions";
import { ConstraintLayout } from "../../src/constraint-layout";
import { ConstrainedView } from "../../src/constrained-view";
import { ConstraintGuide } from "../../src/constraint-guide";
import ReactLogo from "./react-logo.jpg";

export const Preview1 = () => {
    const onClick = action("OnClick");

    return (
        <ConstraintLayout width={320} height={475}>
            <ConstrainedView
                id="topbar"
                height="56px"
                width="match-parent"
                style={{ color: "white", backgroundColor: "#4e1ebb", padding: "15px 0 0 15px" }}>
                <strong>React Web</strong>
            </ConstrainedView>

            <ConstrainedView id="logo" height={150} width="match-parent" topToBottomOf="topbar" style={{ boxShadow: "2px 2px 8px #d4d4d4" }}>
                <img src={ReactLogo} alt="React logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </ConstrainedView>

            <ConstrainedView
                id="fab"
                as="button"
                width="48px"
                height="48px"
                marginTop="-24px"
                marginRight="24px"
                topToBottomOf="logo"
                rightToRightOf="_parent"
                onClick={() => onClick("FAB clicked")}
                style={{ backgroundColor: "#d9d", borderRadius: "24px", padding: "12px 15px", color: "white", outline: "none", border: "none" }}>
                <i className="fa fa-star" />
            </ConstrainedView>

            <ConstraintLayout
                id="contact-1"
                width="match-parent"
                height="50px"
                topToBottomOf="fab"
                leftToLeftOf="_parent"
                rightToRightOf="_parent"
                marginTop="16px">
                <ConstraintGuide id="left-guide" orientation="vertical" begin={48} />
                <ConstraintGuide id="right-guide" orientation="vertical" end={94} />

                <ConstrainedView
                    id="left-icon"
                    height="match-parent"
                    topToTopOf="_parent"
                    leftToLeftOf="_parent"
                    rightToLeftOf="left-guide"
                    style={{ padding: "0 18px" }}>
                    <i className="fas fa-mobile-alt" style={{ color: "#4e1ebb" }} />
                </ConstrainedView>

                <ConstrainedView
                    id="right-icon"
                    width="16px"
                    height="match-parent"
                    topToTopOf="_parent"
                    leftToRightOf="right-guide"
                    rightToRightOf="_parent">
                    <i className="fas fa-comment-dots" style={{ color: "#1ebbad" }} />
                </ConstrainedView>

                <ConstrainedView
                    id="content"
                    width="match-parent"
                    height="match-parent"
                    leftToRightOf="left-guide"
                    rightToRightOf="_parent"
                    topToTopOf="_parent"
                    marginLeft="24px">
                    (650) 555-1234 <br />
                    <small>Google voice</small>
                </ConstrainedView>
            </ConstraintLayout>

            <ConstraintLayout
                id="contact-2"
                width="match-parent"
                height="50px"
                topToBottomOf="contact-1"
                leftToLeftOf="_parent"
                rightToRightOf="_parent"
                marginTop="16px">
                <ConstraintGuide id="left-guide" orientation="vertical" begin={48} />
                <ConstraintGuide id="right-guide" orientation="vertical" end={94} />

                <ConstrainedView
                    id="right-icon"
                    width="16px"
                    height="match-parent"
                    topToTopOf="_parent"
                    leftToRightOf="right-guide"
                    rightToRightOf="_parent">
                    <i className="fas fa-comment-dots" style={{ color: "#1ebbad" }} />
                </ConstrainedView>

                <ConstrainedView
                    id="content"
                    width="match-parent"
                    height="match-parent"
                    leftToRightOf="left-guide"
                    rightToRightOf="_parent"
                    topToTopOf="_parent"
                    marginLeft="24px">
                    (650) 555-1234 <br />
                    <small>Google voice</small>
                </ConstrainedView>
            </ConstraintLayout>

            <ConstrainedView
                id="rule"
                height="4px"
                leftToLeftOf="_parent"
                rightToRightOf="_parent"
                topToBottomOf="contact-2"
                marginTop="16px"
                marginLeft="72px"
                style={{ backgroundColor: "#aeaeae" }}
            />

            <ConstraintLayout
                id="contact-3"
                width="match-parent"
                height="50px"
                topToBottomOf="rule"
                leftToLeftOf="contact-2"
                rightToRightOf="contact-2"
                marginTop="16px">
                <ConstraintGuide id="left-guide" orientation="vertical" begin={48} />
                <ConstraintGuide id="right-guide" orientation="vertical" end={94} />

                <ConstrainedView
                    id="left-icon"
                    height="match-parent"
                    topToTopOf="_parent"
                    leftToLeftOf="_parent"
                    rightToLeftOf="left-guide"
                    style={{ padding: "0 18px" }}>
                    <i className="fas fa-envelope" style={{ color: "#4e1ebb" }} />
                </ConstrainedView>

                <ConstrainedView
                    id="content"
                    width="match-parent"
                    height="match-parent"
                    leftToRightOf="left-guide"
                    rightToRightOf="_parent"
                    topToTopOf="_parent"
                    marginLeft="24px">
                    react@facebook.com <br />
                    <small>Email</small>
                </ConstrainedView>
            </ConstraintLayout>
        </ConstraintLayout>
    );
};
