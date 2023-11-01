import { PushService } from "src/app/commons/services/push.service";


const config = { pushKey: "BOrYxQzjc8u5e4fbgotvaEp28K1vn8jLSWzqM2q-OZjYxPF68AXhaeanfQ76cTsotoUB1FrET147UIM90xQyDqQ" };

async function subscribe(topic: any, pushService: PushService) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./assets/js/serviceWorker.js')
            .then(async (swReg: any) => {
                const options = {
                    userVisibleOnly: true,
                    applicationServerKey: urlB64ToUint8Array(config.pushKey),
                };
                swReg.pushManager.subscribe(options);
                swReg.pushManager.getSubscription()
                    .then(async (subscription: any) => {
                        if (!subscription) {
                            console.log('No Subscription endpoint present')
                            return;
                        }
                        await pushService.subscribe(subscription);
                    }).catch((subErr: any) => console.log("EE", subErr));

            }).catch((regErr: any) => console.log("E", regErr));

        // Do we already have a push message subscription?
    } else {
        console.warn('Service workers aren\'t supported in this browser.');
    }
}

function urlB64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default subscribe;