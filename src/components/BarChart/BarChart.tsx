import React, { useEffect, useRef } from 'react';
import styles from './BarChart.module.css';
import * as d3 from 'd3';

interface BarChartRequiredProps {
  data: {
    label: string
    value: number
  }[]
}

interface BarChartOptionalProps {
  width: number
  height: number
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
}

interface BarChartProps extends BarChartRequiredProps, BarChartOptionalProps {}

const BarChartDefaultProps: BarChartOptionalProps = {
  width: 1000,
  height: 500,
  marginTop: 20,
  marginBottom: 30,
  marginLeft: 30,
  marginRight: 30
}

const BarChart = (props:BarChartProps) => {
  const {data, width, height, marginTop, marginLeft, marginBottom, marginRight} = props;
  const svg = useRef<SVGSVGElement>(null);
  const margin = { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft };

  const renderChart = (svg:any) => {
    const xscale = d3
      .scaleBand()
      .domain(data.map((d: { label: string; }) => d.label))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.125)

    const yscale = d3
      .scaleLinear()
      .domain([
        d3.min(data, ({ value }:{ value:number }) => (value ? value - 1 : 0)) as number,
        d3.max(data, ({ value }:{ value:number }) => (value ? value + 1 : 0)) as number
      ])
      .range([height - margin.bottom, margin.top])

    const xAxis = d3.axisBottom(xscale)
    const yAxis = d3.axisLeft(yscale)

    svg
      .select('.x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis)

    svg
      .select('.y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis)

    svg
      .select('.plot-area')
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d:any) => xscale(d.label))
      .attr('width', xscale.bandwidth())
      .attr('y', (d:any) => yscale(d.value))
      .attr('height', (d:any) => height - yscale(d.value) - margin.bottom)
      .attr('fill', '#69b3a2')
  }

  useEffect(() => {
    renderChart(d3.select(svg.current));
  })

  return (
    <svg
      ref={svg}
      style={{
        height: height,
        width: width,
        marginRight: marginRight,
        marginLeft: marginLeft,
      }}
    >
      <g className="plot-area" />
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
}

BarChart.defaultProps = BarChartDefaultProps;

export default BarChart;
