import { loadScript } from "./index.js";

export const registerPwa = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
        })
    }
}