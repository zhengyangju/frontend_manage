import { Layout } from '@/routers/constant';

const rankStoreRouter = {
    sort: 1,
    path: '/ranks',
    component: Layout,
    redirect: '/ranks/index',
    meta: {
        icon: 'p-rejected-order',
        title: 'menu.rank',
    },
    children: [
        {
            path: '/ranks/index',
            name: 'Ranks',
            component: () => import('@/views/ranks/index.vue'),
            meta: {
                activeMenu: '/ranks',
                requiresAuth: false,
            },
        },
    ],
};

export default rankStoreRouter;
