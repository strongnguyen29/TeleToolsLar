

import { getBrowser, getOSName } from './helpers/common';
import {API_ID, API_HASH} from "~/js/Constants";
import TdClient from 'tdweb'

/**
 *
 * @param account Account
 * @param closers
 * @constructor
 */
export default function TdWeb(account, closers = null) {

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
        console.log('TdWeb::class receive update', update);
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
        if (closers != null) {
            closers(update)
        }
    };

    /**
     * Send paramters
     */
    this.sendParamters = function() {

        this.client.send({
            '@type': 'setTdlibParameters',
            parameters: this.parameters
        }).then(result => {
            console.log('TdWeb::class sendParamters: success', result);
        }).catch(error => {
            console.error('TdWeb::class sendParamters: error', error);
        });
    };

    this.sendPhone = function (phone) {
        this.client.send({
            '@type': 'setAuthenticationPhoneNumber',
            phone_number: phone
        }).then(result => {
            console.log('TdWeb::class sendPhone: success', result);
        }).catch(error => {
            console.error('TdWeb::class sendPhone: error', error);
        });
    };

    this.sendCode = function (code) {
        this.client.send({
            '@type': 'checkAuthenticationCode',
            code: code
        }).then(result => {
            console.log('TdWeb::class sendCode: success', result);
        }).catch(error => {
            console.error('TdWeb::class sendCode: error', error);
        });
    };

    /**
     * Get current user
     * @param userId
     * @param callback
     */
    this.getUser = function (userId, callback = null) {

        this.client.send({
            '@type': 'getUser',
            user_id: userId
        }).then(user => {
            console.info('TdWeb::class getUser: success', user);
            if (callback) callback(user, null);
        }).catch(error => {
            console.error('TdWeb::class getUser: error', error);
            if (callback) callback(null, error);
        });
    };

    /**
     * get chats of current user
     * @param callback
     */
    this.getChats = function (callback = null) {
        this.client.send({
            '@type': 'getChats',
            offset_order: '9223372036854775807',
            offset_chat_id: '0',
            'limit': 100
        }).then(result => {
            console.log('TdWeb::class getChats: success', result);
            if (callback) callback(result, null);
        }).catch(error => {
            console.error('TdWeb::class getChats: error', error);
            if (callback) callback(null, error);
        });
    };

    this.getChat = function (chatId, callback = null) {
        this.client.send({
            '@type': 'getChat',
            chat_id: chatId
        }).then(result => {
            console.log('TdWeb::class getChat result', result);
            if (callback) callback(result, null);
        }).catch(error => {
            console.error('TdWeb::class getChat error', error);
            if (callback) callback(null, error);
        });
    };

    /**
     * Get group members
     * @param id
     * @param offset
     * @param callback
     */
    this.getGroupMembers = function (id, offset, callback = null) {

        this.client.send({
            '@type': 'getSupergroupMembers',
            supergroup_id: id,
            offset: offset,
            limit:200
        }).then(result => {
            console.log('TdWeb::class getGroupMembers: success', result);
            if (callback) callback(result, null);
        }).catch(error => {
            console.error('TdWeb::class getChatMembers error', error);
            if (callback) callback(null, error);
        });
    };

    return this;
}
