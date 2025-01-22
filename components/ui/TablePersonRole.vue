<script setup lang="ts">
import {PersonRole} from "~/types/enums/PersonRole";

const roleOptions = [
    {label: 'Любая', value: undefined},
    {label: 'Режиссёр', value: PersonRole.Director},
    {label: 'Актёр', value: PersonRole.Actor}
];
</script>

<template>
    <USelectMenu :options="roleOptions"
                 class="w-full md:w-auto"
                 value-attribute="value"/>
</template>

<style scoped>

</style>