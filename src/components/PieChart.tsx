import React, { useState, useEffect } from "react";
import { FullDatum } from "./Container";
import { pie, arc } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { select, Selection } from "d3-selection";

type Props = {
    list: FullDatum[];
};

export const PieChart: React.FunctionComponent<Props> = (props: Props) => {
    const arcRef = React.createRef<SVGSVGElement>();

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

    const [mount, setMount] = useState(false);
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
        renderChart();
    });

    const renderChart = () => {
        if (selection) {
            const paths = selection
                .append("g")
                .attr("transform", `translate(${cent.x}, ${cent.y})`)
                .selectAll("path")
                .data(pieGenerator(props.list));

            paths.attr("d", arcGenerator as any);

            paths
                .enter()
                .append("path")
                .attr("class", "arc")
                .attr("stroke", "red")
                .attr("stroke-width", 3)
                .attr("fill", "blue")
                .attr("d", arcGenerator as any);
        }
    };

    return (
        <div>
            <svg
                ref={arcRef}
                width={dimensions.width + 150}
                height={dimensions.height + 150}
            />
        </div>
    );
};
