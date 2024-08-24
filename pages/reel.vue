<script setup lang="ts">
import FilmRepository from "~/repos/FilmRepository";
import ListRepository from "~/repos/ListRepository";

const filmRepo = new FilmRepository();

const listId = ref<number | null>(null);

const items = ref<any[]>([]);

watch(listId, async () => {
    if (!listId.value)
        return [];

    const collection = await filmRepo.indexGet({page: 1, per_page: 100, list_id: listId.value});

    items.value = collection.data.map(item => ({
        label: item.name,
        data : item
    }));
});
</script>

<template>
    <div>
        <UFormGroup label="Список">
            <UiRepoSearchSelectId :repo="new ListRepository()"
                                  placeholder="Выберите список"
                                  v-model="listId"/>
        </UFormGroup>

        <ChartPie v-if="listId && items.length > 0" :items="items"/>
    </div>
</template>

<style scoped>

</style>