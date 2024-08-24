export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie<string>('token');

    if (!token.value && !to.path.startsWith('/login'))
        return navigateTo('/login');
});