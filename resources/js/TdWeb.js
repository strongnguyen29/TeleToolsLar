

import { getBrowser, getOSName } from './helpers/common';
import TdClient from 'tdweb'

/**
 *
 * @param account Account
 * @constructor
 */
export default function TdWeb(account) {

    this.parameters = {
        '@type': 'tdlibParameters',
        use_test_dc: false,
        api_id: account.apiId,
        api_hash: account.apiHash,
        system_language_code: 'en',
        device_model: getBrowser(),
        system_version: getOSName(),
        application_version: '1.0',
        use_secret_chats: false,
        use_message_database: false,
        use_file_database: false,
        database_directory: account.databaseDirectory,
        files_directory: account.filesDirectory
    };

    this.client = new TdClient({
        logVerbosityLevel: 1,
        jsLogVerbosityLevel: 3,
        mode: 'asmjs',
        prefix: 'tdlib',
        readOnly: false,
        isBackground: false,
        useDatabase: true
    });

    this.client.onUpdate = update => {

        console.log('TdWeb :: receive update', update);

        switch (update['@type']) {

            case 'updateAuthorizationState': {

                switch (update.authorization_state['@type']) {
                    case 'authorizationStateLoggingOut':

                        break;
                    case 'authorizationStateWaitTdlibParameters':
                        //this.sendParamters();
                        break;
                    case 'authorizationStateWaitEncryptionKey':
                        //tdClient.send({ '@type': 'checkDatabaseEncryptionKey' });
                        break;
                    case 'authorizationStateWaitPhoneNumber': {
                        //this.appState = 'login-phone';
                        break;
                    }
                    case 'authorizationStateWaitCode':
                        //this.appState = 'login-code';
                        break;
                    case 'authorizationStateWaitPassword':
                        break;
                    case 'authorizationStateReady':
                        //this.appState = 'login-done';
                        //this.getChats();
                        break;
                    case 'authorizationStateClosing':
                        break;
                    case 'authorizationStateClosed':

                        break;
                    default:
                        break;
                }
            }
        }
    };

    this.sendParamters = function() {

        this.client.send({
            '@type': 'setTdlibParameters',
            parameters: this.parameters
        }).then(result => {
            console.log('send result', result);
        }).catch(error => {
            console.error('send error', error);
        });
    };

    return this;
}
