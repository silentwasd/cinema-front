<script setup lang="ts">
import Chart from 'chart.js/auto';

const props = defineProps<{
    items: {
        label: string,
        data: any
    }[]
}>();

let chart      = null;
const chartRef = ref();

function randomColor() {
    const r = getRandomInt(-1, 255);
    const g = getRandomInt(-1, 255);
    const b = getRandomInt(-1, 255);
    return `rgb(${r}, ${g}, ${b})`;
}

function getRandomInt(min: number, max: number) {
    const minCeiled  = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

watch(chartRef, () => {
    console.log(chartRef.value);
    chart = new Chart(
        chartRef.value,
        {
            type: 'pie',
            data: {
                labels  : props.items.map(item => item.label),
                datasets: [{
                    label          : 'Wow',
                    data           : props.items.map(item => 1),
                    backgroundColor: props.items.map(item => randomColor()),
                    hoverOffset    : 4
                }]
            }
        }
    );
});
</script>

<template>
    <canvas ref="chartRef"></canvas>
</template>

<style scoped>

</style>