
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '~/js/views/Home'
import Login from '~/js/views/Login'
import AddMember from '~/js/views/AddMember'
import JoinGroup from '~/js/views/JoinGroup'
import AccountProfile from '~/js/views/AccountProfile'

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/account-login',
            name: 'login',
            component: Login
        },
        {
            path: '/add-member',
            name: 'add-member',
            component: AddMember
        },
        {
            path: '/join-group',
            name: 'join-group',
            component: JoinGroup
        },
        {
            path: '/profile/',
            name: 'profile',
            component: AccountProfile,
            props: (route) => ({ query: route.query.phone })
        }
    ]
});

export default router;
