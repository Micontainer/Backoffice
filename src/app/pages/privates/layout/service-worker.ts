import { PushService } from "src/app/commons/services/push.service";


const config = { pushKey: "BIMBkG1e5pxJayaY5pvW0FGUB2Nl7SuvRs3E83Zy2Br4yHrCu8ozGEeNAMXuDtgSk8jy7NUbZR2248pYiNaXMLY" };

async function subscribe(topic: any, pushService: PushService) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./assets/js/serviceWorker.js')
            .then(async (swReg: any) => {
                // if (!('showNotification' in swReg?.prototype)) {
                //     console.warn('Notifications aren\'t supported.');
                //     return;
                // }
                // if (Notification.permission === 'denied') {
                //     console.warn('The user has blocked notifications.');
                //     return;
                // }
                const options = {
                    userVisibleOnly: true,
                    applicationServerKey: urlB64ToUint8Array(config.pushKey),
                };
                swReg.pushManager.subscribe(options);
                swReg.pushManager.getSubscription()
                    .then(async (subscription: any) => {
                        if (!subscription) {
                            console.log('No Subscription endpoint present')
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