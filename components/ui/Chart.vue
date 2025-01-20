<script setup lang="ts">
import * as d3 from 'd3';

const props = defineProps<{
    chartData: any
}>();

const svgRef = ref();
const width = 600;
const height = 400;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };

let xScale, yScale, svg, line, xAxis, yAxis;

watch(() => props.chartData, () => {
    updateChart();
}, {deep: true});

function updateChart() {
    // Обновить шкалы
    xScale.domain([0, d3.max(props.chartData, d => d.x)]);
    yScale.domain([0, d3.max(props.chartData, d => d.y)]);

    // Обновить оси
    svg.select(".x-axis")
        .transition()
        .duration(500)
        .call(xAxis);

    svg.select(".y-axis")
        .transition()
        .duration(500)
        .call(yAxis);

    // Обновить линию
    svg.select(".line")
        .datum(props.chartData)
        .transition()
        .duration(500)
        .attr("d", line);
}

onMounted(() => {
    // Создание SVG
    svg = d3.select(svgRef.value)
        .attr("width", width)
        .attr("height", height);

    // Шкалы
    xScale = d3.scaleLinear()
        .domain([0, d3.max(props.chartData, d => d.x)])
        .range([margin.left, width - margin.right]);

    yScale = d3.scaleLinear()
        .domain([0, d3.max(props.chartData, d => d.y)])
        .range([height - margin.bottom, margin.top]);

    // Оси
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);

    // Линия
    line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

    svg.append("path")
        .datum(props.chartData)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
});
</script>

<template>
    <svg ref="svgRef" width="600" height="400"></svg>
</template>

<style scoped>

</style>