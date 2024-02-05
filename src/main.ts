/**
* Bootstraps Vue app, registers plugins, creates Pinia store, 
* initializes mock data, and mounts main App component
*/

// Components
import App from './App.vue';
import { createPinia } from 'pinia';
import { useDataStore } from './store/data';

import { Amplify } from 'aws-amplify';
import awsconfig from '@/aws-exports'; // Remember to rename aws-exports.js to aws-exports.ts
Amplify.configure(awsconfig);

// Composables
import { createApp } from 'vue';

// Plugins
import { registerPlugins } from '@/plugins';
const pinia = createPinia();
const app = createApp(App);

registerPlugins(app);

app.use(pinia);

const dataStore = useDataStore();
dataStore.fetchData();

app.mount('#app');