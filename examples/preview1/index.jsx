import React from "react";
import { action } from "@storybook/addon-actions";
import { ConstraintLayout } from "../../src/constraint-layout";
import { ConstraintGuide } from "../../src/constraint-guide";
import ReactLogo from "./react-logo.jpg";

export const Preview1 = () => {
    const onClick = action("OnClick");

    // noinspection HtmlUnknownAttribute
    return (
        <ConstraintLayout width={320}>
            <div id="topbar" height="56px" width="match-parent" style={{ color: "white", backgroundColor: "#4e1ebb", padding: "15px 0 0 15px" }}>
                <strong>React Web</strong>
            </div>

            <div id="logo" height={150} width="match-parent" topToBottomOf="topbar" style={{ boxShadow: "2px 2px 8px #d4d4d4" }}>
                <img src={ReactLogo} alt="React logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <button
                id="fab"
                width="48px"
                height="48px"
                marginTop="-24px"
                marginRight="24px"
                topToBottomOf="logo"
                rightToRightOf="_parent"
                onClick={() => onClick("FAB clicked")}
                style={{ backgroundColor: "#d9d", borderRadius: "24px", padding: "12px 15px", color: "white", outline: "none", border: "none" }}>
                <i className="fa fa-star" />
            </button>

            <ConstraintLayout
                id="contact1"
                height="match-content"
                topToBottomOf="fab"
                leftToLeftOf="_parent"
                rightToRightOf="_parent"
                marginTop="16px">
                <ConstraintGuide id="left-guide" orientation="vertical" begin={48} />
                <ConstraintGuide id="right-guide" orientation="vertical" end={94} />

                <i
                    id="left-icon"
                    width="10px"
                    height="16px"
                    topToTopOf="_parent"
                    leftToLeftOf="_parent"
                    rightToLeftOf="left-guide"
                    className="fas fa-mobile-alt"
                    style={{ color: "#4e1ebb" }}
                />

                <i
                    id="right-icon"
                    width="16px"
                    height="16px"
                    topToTopOf="_parent"
                    leftToRightOf="right-guide"
                    rightToRightOf="_parent"
                    className="fas fa-comment-dots"
                    style={{ color: "#1ebbad" }}
                />

                <p id="content" height="match-content" leftToRightOf="left-guide" rightToLeftOf="right-guide" topToTopOf="_parent" marginLeft="24px">
                    (650) 555-1234 <br />
                    <small>Google voice</small>
                </p>
            </ConstraintLayout>

            <ConstraintLayout
                id="contact2"
                height="match-content"
                topToBottomOf="contact1"
                leftToLeftOf="_parent"
                rightToRightOf="_parent"
                marginTop="16px">
                <ConstraintGuide id="left-guide" orientation="vertical" begin={48} />
                <ConstraintGuide id="right-guide" orientation="vertical" end={94} />

                <i
                    id="right-icon"
                    width="16px"
                    height="16px"
                    topToTopOf="_parent"
                    leftToRightOf="right-guide"
                    rightToRightOf="_parent"
                    className="fas fa-comment-dots"
                    style={{ color: "#1ebbad" }}
                />

                <p id="content" height="match-content" leftToRightOf="left-guide" rightToRightOf="_parent" topToTopOf="_parent" marginLeft="24px">
                    (650) 555-1234 <br />
                    <small>Google voice</small>
                </p>
            </ConstraintLayout>

            <hr
                id="rule"
                height="1px"
                leftToLeftOf="_parent"
                rightToRightOf="_parent"
                topToBottomOf="contact2"
                marginTop="16px"
                marginLeft="72px"
                style={{ backgroundColor: "#aeaeae" }}
            />

            <ConstraintLayout
                id="contact3"
                height="match-content"
                topToBottomOf="rule"
                leftToLeftOf="_parent"
                rightToRightOf="_parent"
                marginTop="16px">
                <ConstraintGuide id="left-guide" orientation="vertical" begin={48} />
                <ConstraintGuide id="right-guide" orientation="vertical" end={94} />

                <i
                    id="left-icon"
                    width="16px"
                    height="16px"
                    topToTopOf="_parent"
                    leftToLeftOf="_parent"
                    rightToLeftOf="left-guide"
                    className="fas fa-envelope"
                    style={{ color: "#4e1ebb" }}
                />

                <p id="content" height="match-content" leftToRightOf="left-guide" rightToLeftOf="right-guide" topToTopOf="_parent" marginLeft="24px">
                    react@facebook.com <br />
                    <small>Email</small>
                </p>
            </ConstraintLayout>
        </ConstraintLayout>
    );
};
