

import { getBrowser, getOSName } from './helpers/common';
import TdClient from 'tdweb'

/**
 *
 * @param account Account
 * @constructor
 */
export default function TdWeb(account) {

    this.client = new TdClient({
        logVerbosityLevel: 1,
        jsLogVerbosityLevel: 3,
        mode: 'asmjs',
        prefix: 'tdlib',
        readOnly: false,
        isBackground: false,
        useDatabase: true
    });

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
        use_message_database: true,
        use_file_database: false,
        database_directory: account.databaseDirectory,
        files_directory: account.filesDirectory
    };
}
