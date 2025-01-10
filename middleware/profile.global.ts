export default defineNuxtRouteMiddleware(async (to, from) => {
    const token            = useToken();
    const {state, refresh} = useProfile();

    if (!state.value && token.value)
        await refresh();
});