import {defineStore} from 'pinia'
import router from '../router'
import {gaLogEvent} from "@/utils/event";

export const useAdUtilsStore = defineStore('ads-utils', {
    state: () => ({
        dialogStatus: false,
        gameId: ""
    }),
    actions: {
        setDialogStatus(status) {
            this.dialogStatus = status || false;

            if (!this.dialogStatus) {
                if (this.gameId) {
                    gaLogEvent.logEvent({
                        eventName: "enter_game",
                        eventValue: this.gameId,
                        eventLog: `Enter Game`
                    });
                    router.push(`/game/${this.gameId}`);
                }
            }
        }
    },
})