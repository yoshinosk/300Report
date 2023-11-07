import { createApp } from 'vue';
import App from './App.vue';
import mixin from '@/assets/js/mixin';

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
    console.log(err, instance, info)
}

for(let key in mixin){
    app.config.globalProperties[key] = mixin[key];
}

app.mount('#app');

