
export function isMobile() {
    return isAndroid() || isIOS() || isWindowsPhone();
}

export function isIOS() {
    const iDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'];

    if (!!navigator.platform && iDevices.indexOf(navigator.platform) > -1) {
        return true;
    }

    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function isAndroid() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('android') > -1;
}

export function isWindowsPhone() {
    if (navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    }

    if (navigator.userAgent.match(/iemobile/i)) {
        return true;
    }

    if (navigator.userAgent.match(/WPDesktop/i)) {
        return true;
    }

    return false;
}

export function isConnecting(state) {
    if (!state) return false;

    switch (state['@type']) {
        case 'connectionStateConnecting': {
            return true;
        }
        case 'connectionStateConnectingToProxy': {
            return true;
        }
        case 'connectionStateReady': {
            return false;
        }
        case 'connectionStateUpdating': {
            return false;
        }
        case 'connectionStateWaitingForNetwork': {
            return false;
        }
    }

    return false;
}

export function getOSName() {
    let OSName = 'Unknown';
    if (window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1) OSName = 'Windows 10';
    if (window.navigator.userAgent.indexOf('Windows NT 6.2') !== -1) OSName = 'Windows 8';
    if (window.navigator.userAgent.indexOf('Windows NT 6.1') !== -1) OSName = 'Windows 7';
    if (window.navigator.userAgent.indexOf('Windows NT 6.0') !== -1) OSName = 'Windows Vista';
    if (window.navigator.userAgent.indexOf('Windows NT 5.1') !== -1) OSName = 'Windows XP';
    if (window.navigator.userAgent.indexOf('Windows NT 5.0') !== -1) OSName = 'Windows 2000';
    if (window.navigator.userAgent.indexOf('Mac') !== -1) OSName = 'Mac/iOS';
    if (window.navigator.userAgent.indexOf('X11') !== -1) OSName = 'UNIX';
    if (window.navigator.userAgent.indexOf('Linux') !== -1) OSName = 'Linux';

    return OSName;
}

export function getBrowser() {
    let browser_name = '';
    let isIE = /*@cc_on!@*/ false || !!document.documentMode;
    let isEdge = !isIE && !!window.StyleMedia;
    if (navigator.userAgent.indexOf('Chrome') !== -1 && !isEdge) {
        browser_name = 'Chrome';
    } else if (navigator.userAgent.indexOf('Safari') !== -1 && !isEdge) {
        browser_name = 'Safari';
    } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
        browser_name = 'Firefox';
    } else if (navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode === true) {
        //IF IE > 10
        browser_name = 'IE';
    } else if (isEdge) {
        browser_name = 'Edge';
    } else {
        browser_name = 'Unknown';
    }

    return browser_name;
}

/**
 *
 * @param phoneNumber
 * @returns {boolean}
 */
export function isValidPhoneNumber(phoneNumber) {
    if (!phoneNumber) return false;

    let isBad = !phoneNumber.match(/^[\d\-+\s]+$/);
    if (!isBad) {
        phoneNumber = phoneNumber.replace(/\D/g, '');
        if (phoneNumber.length < 7) {
            isBad = true;
        }
    }

    return !isBad;
}

export function stringToBoolean(string) {
    switch (string.toLowerCase().trim()) {
        case 'true':
        case 'yes':
        case '1':
            return true;
        case 'false':
        case 'no':
        case '0':
        case null:
            return false;
        default:
            return Boolean(string);
    }
}

export function isSuperGroupChat(chatId) {
    return chatId < -1000000000;
}

export function isPublicGroup(chat) {

    if (chat && chat.hasOwnProperty('type')
        && chat.type['@type'] === 'chatTypeSupergroup'
        && !chat.type.is_channel) {
        return true;
    }

    return false;
}
