export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie<string>('token');

    if (!token.value && !(to.path.startsWith('/login') || to.path.startsWith('/register')))
        return navigateTo('/login');
    else if (token.value && to.path.startsWith('/login'))
        return navigateTo('/management/films');
});