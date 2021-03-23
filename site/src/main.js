import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import { BootstrapVue } from 'bootstrap-vue'
// .use(BootstrapVue)

createApp(App).use(store).use(router).mount('#app')
