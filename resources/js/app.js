

require('./bootstrap');

import Vue from 'vue'
import Router from '~/js/routes/routes'
import App from '~/js/views/App'

const app = new Vue({
    el: '#app',
    components: {App},
    router: Router,
});

export default app;
