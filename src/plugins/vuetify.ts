/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';

// https://vuetifyjs.com/en/styles/colors/
const myCustomLightTheme = {
  dark: false,
  colors: {
    // Vuetify specific
    background: '#C5CAE9',  // indigo-lighten-4
    surface: '#7E57C2',     // deep-purple-lighten-1
    primary: '#3F51B5',     // indigo
    secondary: '#673AB7',   // deep-purple
    // Material
    error: '#E53935',       // red-darken-1
    info: '#1DE9B6',        // teal-accent-3
    success: '#66BB6A',     // green-lighten-1
    warning: '#FF6D00',     // orange-accent-4
  },
};
const myCustomDarkTheme = {
  dark: true,
  colors: {
    // Vuetify specific
    background: '#263238',  // blue-grey-darken-4
    surface: '#424242',     // grey-darken-3
    primary: '#1A237E',     // indigo-darken-4
    secondary: '#01579B',   // light-blue-darken-4
    // Material
    error: '#E53935',
    info: '#1DE9B6',
    success: '#66BB6A',
    warning: '#FF6D00',
  },
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
      myCustomDarkTheme
    },
  },
});
