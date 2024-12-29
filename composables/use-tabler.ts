export default function (tableName: string) {
    const route  = useRoute();

    const name     = ref((route.query.name ?? '') as string);
    const page     = ref<number>(parseInt((route.query.page ?? '1') as string));
    const selected = ref([]);
    const perPage  = useStatify<number>(`${tableName}_per_page`, () => 10);
    const sort     = useStatify<{ column: string, direction: "desc" | "asc" }>(`${tableName}_sort`, () => ({
        column   : 'id',
        direction: 'desc'
    }));

    watch(() => [name.value, page.value], () => {
        navigateTo(`?name=${name.value}&page=${page.value}`);
    });

    watch(name, () => page.value = 1);

    function clearFilters() {
        name.value = '';
        page.value = 1;
    }

    return {name, page, perPage, sort, selected, clearFilters};
}