<!-- This component defines a dialog box that displays information about the MUSSEL app.
     It shows the app's full name, purpose, tech stack, and an attribution.
     The dialog is opened and closed based on the injected aboutDialogState. -->

<script setup lang="ts">
import { DialogState } from '@/types/DialogState';
import { inject } from 'vue';

const aboutDialogState = inject<DialogState>('aboutDialogState', { showDialog: false });

function closeDialog() {
    aboutDialogState.showDialog = false;
}
</script>

<template>
    <v-dialog v-model="aboutDialogState.showDialog" width="unset" transition="dialog-top-transition">
        <template v-slot:default="{ isActive }">
            <v-card title="MUSSEL - My University's Sports & Social Events List" color="success">
                <v-card-text>
                    <v-spacer class="ma-5"></v-spacer>
                    This is a sample app developed to teach students how to integrate web apps with AWS Amplify.
                    <v-spacer></v-spacer>
                    App developed with Vue.js, Vuetify, TypeScript, and AWS Amplify.
                    <v-spacer class="ma-5"></v-spacer>
                    Made with ❤️ by the AWS Academic Advocacy Team.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" @click="closeDialog"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<style>
.v-dialog {
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.7);
}
</style>