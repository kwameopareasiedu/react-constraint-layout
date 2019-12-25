import React from "react";
import { action } from "@storybook/addon-actions";
import { ConstraintLayout } from "../../src/constraint-layout";
import { ConstrainedView } from "../../src/constrained-view";
import { ConstraintGuide } from "../../src/constraint-guide";
import Banner from "./beauty-and-the-beast-banner.jpg";
import Cover from "./beauty-and-the-beast-cover.jpeg";

export const Preview2 = () => {
    const onClick = action("OnClick");

    return (
        <ConstraintLayout width={270} height={500}>
            <ConstrainedView id="banner" height={150} width="match-parent" topToTopOf="_parent">
                <img src={Banner} alt="Movie banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </ConstrainedView>

            <ConstrainedView id="cover" width={75} height={110} topToBottomOf="banner" leftToLeftOf="_parent" marginLeft="8px" marginTop={-50}>
                <img src={Cover} alt="Movie Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </ConstrainedView>

            <ConstrainedView
                id="title"
                as="h5"
                height="50px"
                topToBottomOf="banner"
                leftToRightOf="cover"
                rightToRightOf="_parent"
                marginLeft="8px"
                marginTop="15px">
                Beauty and the Beast
            </ConstrainedView>

            <ConstrainedView
                as="p"
                id="details"
                height="20px"
                marginTop="8px"
                topToBottomOf="title"
                leftToLeftOf="title"
                rightToRightOf="_parent"
                style={{ fontSize: "12px", color: "#676767" }}>
                March 2017 PG 129 minutes
            </ConstrainedView>

            <ConstraintGuide id="guide1" orientation="vertical" percent={50} />

            <ConstrainedView
                id="rent-button"
                as="button"
                height="30px"
                marginTop="15px"
                marginRight="8px"
                topToBottomOf="details"
                leftToLeftOf="cover"
                rightToLeftOf="guide1"
                className="btn btn-danger btn-sm"
                onClick={() => onClick("Rent movie")}
                style={{ fontSize: "12px" }}>
                Rent (GHS 15)
            </ConstrainedView>

            <ConstrainedView
                id="buy-button"
                as="button"
                height="30px"
                marginLeft="8px"
                marginRight="8px"
                leftToRightOf="guide1"
                rightToRightOf="_parent"
                topToTopOf="rent-button"
                className="btn btn-danger btn-sm"
                onClick={() => onClick("Buy movie")}
                style={{ fontSize: "12px" }}>
                Buy (GHS 35)
            </ConstrainedView>

            <ConstrainedView
                id="rule1"
                height="1px"
                leftToLeftOf="rent-button"
                rightToRightOf="buy-button"
                topToBottomOf="buy-button"
                marginTop="12px"
                style={{ backgroundColor: "#e3e3e3" }}
            />

            <ConstrainedView
                as="i"
                width="48px"
                height="32px"
                id="pg-ratings"
                marginTop="12px"
                marginRight="12px"
                rightToLeftOf="guide1"
                topToBottomOf="rule1"
                className="fa fa-users text-center"
                style={{ fontSize: "32px", color: "#c34" }}
            />

            <ConstrainedView
                as="i"
                width="32px"
                height="32px"
                id="ratings"
                marginRight="15px"
                topToTopOf="pg-ratings"
                rightToLeftOf="pg-ratings"
                className="fa fa-user text-center"
                style={{ fontSize: "32px", color: "#c34" }}
            />

            <ConstrainedView
                as="i"
                width="48px"
                height="32px"
                id="rotten-tomatoes"
                leftToRightOf="guide1"
                topToTopOf="ratings"
                className="fas fa-apple-alt text-center"
                style={{ fontSize: "32px", color: "#c34" }}
            />

            <ConstrainedView
                as="i"
                width="48px"
                height="32px"
                id="similar"
                marginLeft="12px"
                topToTopOf="ratings"
                leftToRightOf="rotten-tomatoes"
                className="fas fa-layer-group text-center"
                style={{ fontSize: "32px", color: "#c34" }}
            />

            <ConstrainedView
                as="p"
                height="48px"
                marginTop="4px"
                leftToLeftOf="pg-ratings"
                rightToRightOf="pg-ratings"
                topToBottomOf="pg-ratings"
                className="text-center"
                style={{ fontSize: "10px" }}>
                Family
            </ConstrainedView>

            <ConstrainedView
                as="p"
                height="48px"
                marginTop="4px"
                leftToLeftOf="ratings"
                rightToRightOf="ratings"
                topToBottomOf="ratings"
                className="text-center"
                style={{ fontSize: "10px" }}>
                242 ratings
            </ConstrainedView>

            <ConstrainedView
                as="p"
                height="48px"
                marginTop="4px"
                leftToLeftOf="rotten-tomatoes"
                rightToRightOf="rotten-tomatoes"
                topToBottomOf="rotten-tomatoes"
                className="text-center"
                style={{ fontSize: "10px" }}>
                71%
            </ConstrainedView>

            <ConstrainedView
                as="p"
                height="48px"
                marginTop="4px"
                leftToLeftOf="similar"
                rightToRightOf="similar"
                topToBottomOf="similar"
                className="text-center"
                style={{ fontSize: "10px" }}>
                Similar
            </ConstrainedView>

            <ConstrainedView
                id="rule2"
                height="1px"
                leftToLeftOf="rule1"
                rightToRightOf="rule1"
                topToBottomOf="rule1"
                marginTop="90px"
                style={{ backgroundColor: "#e3e3e3" }}
            />

            <ConstrainedView
                as="p"
                height="100px"
                marginTop="12px"
                leftToLeftOf="rule2"
                rightToRightOf="rule2"
                topToBottomOf="rule2"
                className="text-center"
                style={{ fontSize: "14px" }}>
                The story and characters you know and love come to spectacular life in the live-action adaptation of Disney&apos;s animated classic
                Beauty and the Beast.
            </ConstrainedView>
        </ConstraintLayout>
    );
};
