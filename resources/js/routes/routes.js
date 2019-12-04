
import Vue from 'vue'
import VueRouter from 'vue-router';
import Home from '~/js/views/Home'
import Login from '~/js/views/Login'
import AddMember from '~/js/views/AddMember'

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
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/add-member',
            name: 'add-member',
            component: AddMember
        }
    ]
});

export default router;
