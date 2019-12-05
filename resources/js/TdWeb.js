

import Account from '~/js/models/account'

const options = {
    logVerbosityLevel: 1,
    jsLogVerbosityLevel: 3,
    mode: 'asmjs',
    prefix: 'tdlib',
    readOnly: false,
    isBackground: false,
    useDatabase: true
};

const parameters = {
    '@type': 'tdlibParameters',
    use_test_dc: false,
    api_id: apiId,
    api_hash: apiHash,
    system_language_code: 'en',
    device_model: getBrowser(),
    system_version: getOSName(),
    application_version: version,
    use_secret_chats: false,
    use_message_database: true,
    use_file_database: false,
    database_directory: '/db',
    files_directory: '/'
};

class TdWeb {

    /**
     *
     * @param account Acc
     */
    constructor(account) {

        this.parameters = {
            '@type': 'tdlibParameters',
            use_test_dc: false,
            api_id: account.appId,
            api_hash: apiHash,
            system_language_code: 'en',
            device_model: getBrowser(),
            system_version: getOSName(),
            application_version: version,
            use_secret_chats: false,
            use_message_database: true,
            use_file_database: false,
            database_directory: '/db',
            files_directory: '/'
        }
    }
}
