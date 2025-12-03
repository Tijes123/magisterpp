importScripts("./browser-polyfill.js")
// Open options page when clicking on thingy
browser.action.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
});


// yoink
let userId,
    userToken,
    userTokenDate

startListenCredentials()
setDefaults()
console.info("Service worker running!")
addEventListener('activate', () => {
    startListenCredentials()
    setDefaults()
    console.info("Service worker running!")
})

browser.runtime.onStartup.addListener(() => {
    startListenCredentials()
    setDefaults()
    console.info("Browser started, service worker revived.")
})

const keepAlive = () => setInterval(browser.runtime.getPlatformInfo, 20e3)
browser.runtime.onStartup.addListener(keepAlive)
keepAlive()

async function startListenCredentials() {
    // Allow any context to use browser.storage.session
    browser.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })

    // Initialise the three variables
    userId = (await browser.storage.sync.get('user-id'))?.['user-id'] || null
    userToken = (await browser.storage.session.get('token'))?.['token'] || null
    userTokenDate = (await browser.storage.session.get('token-date'))?.['token-date'] || new Date(0)

    browser.webRequest.onBeforeSendHeaders.addListener(async e => {
        // Return if the request was made by Study Tools itself
        if (Object.values(e.requestHeaders).find(header => header.name === 'X-Request-Source')?.value === 'study-tools') return

        console.info('Request caught!')

        let userIdWas = userId
        let userTokenWas = userToken
        let userTokenDateWas = userTokenDate

        let urlUserId = e.url.split('/personen/')[1]?.split('/')[0]
        if (urlUserId?.length > 2 && !urlUserId.includes('undefined')) {
            userId = urlUserId || userIdWas
            browser.storage.sync.set({ 'user-id': userId })
            if (userIdWas !== userId) console.info(`User ID changed from ${userIdWas} to ${userId}.`)
        }

        let authObject = Object.values(e.requestHeaders).find(header => header.name === 'Authorization')
        if (authObject) {
            userToken = authObject.value
            userTokenDate = new Date()
            browser.storage.session.set({ 'token': userToken })
            browser.storage.session.set({ 'token-date': userTokenDate.getTime() })
            if (userTokenWas !== userToken && userTokenDateWas.getTime() == 0) console.info(`User token gathered. Length: ${userToken.length}.`)
            else if (userTokenWas !== userToken) console.info(`User token changed since ${userTokenDate - userTokenDateWas} ms ago.`)
        }

    }, { urls: ['*://*.magister.net/*'] }, ['requestHeaders'])

    console.info("Intercepting HTTP request information to extract token and userId...%c\n\nVrees niet, dit is alleen nodig zodat de extensie API-verzoeken kan maken naar Magister. Deze gegevens blijven op je apparaat. Dit wordt momenteel alleen gebruikt voor de volgende onderdelen:\n" + ["cijferexport", "widgets startpagina", "rooster startpagina", "puntensysteem"].join(', ') + "\n\nen in de toekomst eventueel ook voor:\n" + [].join(', '), "font-size: .8em")
}

async function setDefaults() {
    let syncedStorage = await browser.storage.sync.get()
    let diff = {}

    // Check each setting to see if its value has been defined. If not, set it to the default value.
    settings.forEach(category => {
        category.settings.forEach(setting => {
            if (typeof syncedStorage[setting.id] === 'undefined') {
                if (setting.id === 'wallpaper' && syncedStorage['backdrop']?.length > 5) diff[setting.id] = 'custom,' + syncedStorage['backdrop']
                else diff[setting.id] = setting.default
            }
        })
    })

    if (Object.keys(diff).length > 0) {
        setTimeout(() => browser.storage.sync.set(diff), 200)
        console.info("Set the following storage.sync keys to their default values:", diff)
    }

    if (settingsToClear.some(key => Object.keys(syncedStorage).includes(key))) {
        browser.storage.sync.remove(settingsToClear)
        console.info("Redundant storage.sync keys removed to free up space.")
    }
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // tmp download shit
    if (request.action === "download") {
        const text = request.text;
        const filename = request.filename || "data.txt";

        // Convert text to a data URL
        const dataUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(text);

        browser.downloads.download({
          url: dataUrl,
          filename: filename,
          saveAs: true
        });
    }

    switch (request.action) {
        case 'popstateDetected':
            console.info("Popstate detected, service worker revived.")
            return 0

        case 'waitForRequestCompleted':
            console.info(`Request completion notification requested by ${sender.url}.`)
            browser.webRequest.onCompleted.addListener((details) => {
                sendResponse({ status: 'completed', details: details })
                console.info(`Request completion notification sent to ${sender.url}.`)
            }, { urls: ['*://*.magister.net/api/personen/*/aanmeldingen/*/cijfers/extracijferkolominfo/*'] })
            setTimeout(() => {
                sendResponse({ status: 'timeout' })
                console.warn(`Request completion notification requested by ${sender.url} has timed out.`)
            }, 5000)
            return true

        case 'uninstallSelf':
            browser.management.uninstallSelf({ showConfirmDialog: false }, () => { window.location.reload() })
            break

        default:
            return 0
    }
})
