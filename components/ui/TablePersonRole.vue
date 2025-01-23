<script setup lang="ts">
import {PersonRole} from "~/types/enums/PersonRole";

const roleOptions = [
    {label: 'Любая', value: undefined},
    ...Object.keys(PersonRole).map(key => ({label: personRole(PersonRole[key]), value: PersonRole[key]}))
];
</script>

<template>
    <USelectMenu :options="roleOptions"
                 class="w-full md:w-auto"
                 value-attribute="value"/>
</template>

<style scoped>

</style>