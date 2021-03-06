import React, { useState, useEffect, SVGPathElementTwo } from "react";
import { FullDatum } from "./Container";
import { pie, arc, DefaultArcObject, PieArcDatum } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { select, Selection } from "d3-selection";
import { interpolate } from "d3-interpolate";
import { schemeSet3 } from "d3-scale-chromatic";
import { legendColor } from "d3-svg-legend";
import "d3-transition";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    .inner{
        
        &:hover {
            transform: scale(1.1);
            transition-duration: 250ms;
        }
    }
`;
type Props = {
    list: FullDatum[];
};

declare module "react" {
    interface SVGPathElementTwo extends SVGPathElement {
        _current: PieArcDatum<FullDatum>;
    }
}

export const PieChart: React.FunctionComponent<Props> = (props: Props) => {
    const arcRef = React.createRef<SVGSVGElement>();
    const legendRef = React.createRef<SVGSVGElement>();

    const dimensions = { height: 300, width: 300, radius: 150 };
    const pieGenerator = pie<FullDatum>()
        .sort(null)
        .value((d: FullDatum) => d.price);
    const arcGenerator = arc()
        .outerRadius(dimensions.radius)
        .innerRadius(dimensions.radius / 2);
    const cent = {
        x: dimensions.width / 2 + 5,
        y: dimensions.height / 2 + 5
    };
    const color = scaleOrdinal(schemeSet3);
    const [mount, setMount] = useState(false);
    const [hover, setHover] = useState("");
    const [selection, setSelection] = useState<Selection<
        SVGSVGElement | null,
        {},
        null,
        undefined
    > | null>(null);

    useEffect(() => {
        if (!mount && !selection) {
            setSelection(select(arcRef.current));
            setMount(true);
        }
        mountChart();
    });

    const mountChart = () => {
        if (selection) {
            const paths = selection
                .attr("transform", `translate(${cent.x}, ${cent.y})`)
                .selectAll("path")
                .data(pieGenerator(props.list));

            paths
                .exit()
                .transition()
                .duration(750)
                .attrTween("d", arcTweenExit as any)
                .remove();

            paths
                .attr("d", arcGenerator as any)
                .transition()
                .duration(750)
                .attrTween("d", arcTweenUpdate as any);

            paths
                .enter()
                .append<SVGPathElementTwo>("path")
                .attr("class", "inner")
                .on("mouseover", d =>
                    handleMouseOver(d.data.name, d.data.price)
                )
                .on("mouseout", () => setHover(""))
                .attr("stroke", "red")
                .attr("stroke-width", 3)
                .attr("fill", d => color(d.data.name))
                .each(function(d) {
                    this._current = d;
                })
                .transition()
                .duration(750)
                .attrTween("d", arcTweenEnter as any);

            const legendGroup = select(legendRef.current).attr(
                "transform",
                `translate(${dimensions.width + 40}, 10)`
            );

            const legend = legendColor()
                .shape("circle")
                .scale(color);

            legendGroup.call(legend as any);
        }
    };

    const handleMouseOver = (name: string, price: number) => {
        setHover(`${name} | ${price}`);
    };

    const arcTweenEnter = (d: DefaultArcObject) => {
        let i = interpolate(d.endAngle, d.startAngle);

        return (t: number) => {
            d.startAngle = i(t);
            return arcGenerator(d);
        };
    };

    const arcTweenExit = (d: DefaultArcObject) => {
        let i = interpolate(d.startAngle, d.endAngle);

        return (t: number) => {
            d.startAngle = i(t);
            return arcGenerator(d);
        };
    };

    function arcTweenUpdate(this: SVGPathElementTwo, d: any) {
        let i = interpolate(this._current, d);
        this._current = i(1);
        return function(t: number) {
            return arcGenerator(i(t));
        };
    }

    return (
        <div>
            <svg
                width={dimensions.width + 150}
                height={dimensions.height + 150}
            >
                <GlobalStyle />
                <g ref={arcRef} />

                <g ref={legendRef} />
            </svg>
            <div>{hover}</div>
        </div>
    );
};
