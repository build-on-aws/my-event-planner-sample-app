<!-- 
 This component defines the top app bar navigation for the app. 
 It includes the app title and theme toggle, help info dialog, 
 and user authentication handling.
 The main functionality includes:
 - Toggling between light and dark themes
 - Showing an About dialog with app help info
 - Show user sign in/out with auth dialog
-->


<script setup lang="ts">
import { reactive, provide, ref, computed, onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { DialogState } from '@/types/DialogState';
import AboutApp from '@/components/AboutApp.vue';
import SignInOutDialogs from '@/components/SignInOutDialogs.vue';
import { useAuthStore } from '../store/auth';

// Theme switching
const theme = useTheme();
function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'myCustomLightTheme' : 'myCustomDarkTheme';
}

// AboutApp Dialog
const aboutDialogState: DialogState = reactive({ showDialog: false });
provide('aboutDialogState', aboutDialogState);

function toggleAboutApp() {
    aboutDialogState.showDialog = true;
}

const auth = useAuthStore();
const userSignedIn = computed(() => auth.userAuthenticated);

// auth Dialog
const authDialogSignOutState: DialogState = reactive({ showDialog: false });
const authDialogSignInState: DialogState = reactive({ showDialog: false });
provide('authDialogSignOutState', authDialogSignOutState);
provide('authDialogSignInState', authDialogSignInState);

function showSignIn() {
    authDialogSignInState.showDialog = true;
}

function showSignOut() {
    authDialogSignOutState.showDialog = true;
}

</script>

<template>
    <v-app-bar app permanent fixed>
        <v-app-bar-title class="text-h5">
            <strong>MUSSEL</strong>
            <div class="text-subtitle-1">
                <strong>M</strong>y
                <strong>U</strong>niversity's
                <strong>S</strong>ports &
                <strong>S</strong>ocial
                <strong>E</strong>vents
                <strong>L</strong>ist
            </div>
        </v-app-bar-title>
        <v-app-bar-nav-icon>
            <v-icon @click="toggleTheme">mdi-theme-light-dark</v-icon>
        </v-app-bar-nav-icon>
        <v-app-bar-nav-icon>
            <v-icon @click="toggleAboutApp">mdi-help-circle</v-icon>
            <AboutApp />
        </v-app-bar-nav-icon>
        <v-btn prepend-icon="mdi-lock" v-if="userSignedIn" variant="text" @click="showSignOut" key="signOut">Sign
            Out</v-btn>
        <v-btn prepend-icon="mdi-lock" v-else variant="text" @click="showSignIn" key="signIn">Sign In</v-btn>
        <SignInOutDialogs />
    </v-app-bar>
</template>
