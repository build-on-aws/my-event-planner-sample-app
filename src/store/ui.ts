// This file defines a Pinia store that manages UI state.
// The store tracks the currentView value, which represents the active view or page.
// It also provides an action to update the currentView value.
// Components can import and use this store to get and set the current view.

import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
    state: () => ({
        currentView: 'upcoming-events'
    }),
    actions: {
        setCurrentView(view: string) {
            this.currentView = view;
        }
    }
});
