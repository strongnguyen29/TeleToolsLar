

require('./bootstrap');

import Vue from 'vue'
import Router from '~/js/routes/routes'
import TdClient from './TdWeb'
import Account from './models/account'
import App from './views/App'

const app = new Vue({
    el: '#app',
    components: {App},
    router: Router
});

const tdClient = new TdClient(new Account('845768954'));

console.log(tdClient);

export default app;
