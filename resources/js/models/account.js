
import { stringToBoolean, getBrowser, getOSName } from '~/js/helpers/common';

class Account {

    constructor(phone) {
        this.phone = phone;
        this.user = null;
        this.apiId = null;
        this.apiHash = null;

    }

    get databaseDirectory() {
        return '/' + this.phone + '/db';
    }

    get useFileDatabase() {
        return '/' + this.phone;
    }

    getTdlibParameters() {

        return {
            '@type': 'tdParameters',
            use_test_dc: useTestDC,
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
        }
    }
}
