

import { getBrowser, getOSName } from './helpers/common';
import {API_ID, API_HASH} from "~/js/Constants";
import TdClient from 'tdweb'

/**
 *
 * @param account Account
 * @param callBack
 * @constructor
 */
export default function TdWeb(account, callBack = null) {

    this.parameters = {
        '@type': 'tdlibParameters',
        use_test_dc: false,
        api_id: account.apiId ? account.apiId : API_ID,
        api_hash: account.apiHash ? account.apiHash : API_HASH,
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
        logVerbosityLevel: 2,
        jsLogVerbosityLevel: 'info',
        mode: 'auto',
        instanceName: 'tdlib_' + account.phone,
        readOnly: false,
        isBackground: false,
        useDatabase: true,
    });

    this.client.onUpdate = update => {
        console.log('TdWeb:: receive update', update);
        switch (update['@type']) {
            case 'updateAuthorizationState': {
                switch (update.authorization_state['@type']) {
                    case 'authorizationStateWaitEncryptionKey':
                        this.client.send({ '@type': 'checkDatabaseEncryptionKey' });
                        break;
                    case 'authorizationStateWaitTdlibParameters':
                        this.sendParamters();
                        break;
                }
            }
        }
        if (callBack != null) {
            callBack(update)
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
