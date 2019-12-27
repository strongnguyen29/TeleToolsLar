

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
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1set_tdlib_parameters.html
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

    /**
     * Send phone login
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1set_authentication_phone_number.html
     *
     * @param phone
     */
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

    /**
     * Send code verify
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1check_authentication_code.html
     *
     * @param code
     */
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
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1get_user.html
     *
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
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1get_chats.html
     *
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

    /**
     * Returns information about a chat by its identifier, this is an offline request if the current user is not a bot.
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1get_chat.html
     *
     * @param chatId
     * @param callback
     */
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
     * Returns information about a supergroup or channel by its identifier.
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1get_supergroup.html
     *
     * @param supergroupId
     * @param callback
     */
    this.getSupergroup = function(supergroupId, callback = null) {

        this.client.send({
            '@type': 'getSupergroup',
            supergroup_id: supergroupId
        }).then(result => {
            console.log('TdWeb::class getSupergroup: success', result);
            if (callback) callback(result, null);
        }).catch(error => {
            console.error('TdWeb::class getSupergroup error', error);
            if (callback) callback(null, error);
        });
    };

    /**
     * Get group members
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1get_supergroup_members.html
     *
     * @param groupId
     * @param offset
     * @param limit
     * @param callback
     */
    this.getGroupMembers = function (groupId, offset, limit = 200, callback = null) {

        this.client.send({
            '@type': 'getSupergroupMembers',
            supergroup_id: groupId,
            offset: offset,
            limit:limit
        }).then(result => {
            console.log('TdWeb::class getGroupMembers: success', result);
            if (callback) callback(result, null);
        }).catch(error => {
            console.error('TdWeb::class getChatMembers error', error);
            if (callback) callback(null, error);
        });
    };

    /**
     * Adds a new member to a chat
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1add_chat_member.html
     *
     * @param chatId
     * @param userId
     * @param callback
     */
    this.addChatMember = function (chatId, userId, callback = null) {
        this.client.send({
            '@type': 'addChatMember',
            chat_id: chatId,
            user_id: userId,
            forward_limit: 1
        }).then(result => {
            console.log('TdWeb::class send addChatMember result', result);
            if (callback) callback(result, null);
        }).catch(error => {
            console.error('TdWeb::class send addChatMember error', error);
            if (callback) callback(null, error);
        });
    };

    /**
     * Adds multiple new members to a chat
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1add_chat_members.html
     *
     * @param chatId
     * @param userIds array
     * @param callback function
     */
    this.addChatMembers = function (chatId, userIds, callback = null) {
        this.client.send({
            '@type': 'addChatMembers',
            chat_id: chatId,
            user_ids: userIds
        }).then(result => {
            console.log('TdWeb::class send addChatMembers result', result);
            if (callback) callback(result, null);
        }).catch(error => {
            console.error('TdWeb::class send addChatMembers error', error);
            if (callback) callback(null, error);
        });
    };

    /**
     * Adds current user as a new member to a chat.
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1join_chat.html
     *
     * @param chatId
     * @param callback
     */
    this.joinChat = function (chatId, callback = null) {

        this.client.send({'@type': 'joinChat', chat_id: chatId})
            .then(result => {
                console.log('TdWeb::class send joinChat result', result);
                if (callback) callback(result, null);
            }).catch(error => {
                console.error('TdWeb::class send joinChat error', error);
                if (callback) callback(null, error);
            });
    };

    /**
     * Uses an invite link to add the current user to the chat if possible
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1join_chat_by_invite_link.html
     *
     * @param inviteLink
     * @param callback
     */
    this.joinChatByInviteLink = function (inviteLink, callback = null) {

        this.client.send({'@type': 'joinChatByInviteLink', invite_link: inviteLink})
            .then(result => {
                console.log('TdWeb::class send joinChatByInviteLink result', result);
                if (callback) callback(result, null);
            }).catch(error => {
            console.error('TdWeb::class send joinChatByInviteLink error', error);
            if (callback) callback(null, error);
        });
    };

    /**
     * Returns information about a single member of a chat.
     * @link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1get_chat_member.html
     *
     * @param chat_id
     * @param user_id
     * @param callback
     */
    this.getChatMember = function (chat_id, user_id, callback = null) {

        this.client.send({
            '@type': 'getChatMember',
            chat_id: chat_id,
            user_id: user_id
        }).then(result => {
            console.log('TdWeb::class send getChatMember result', result);
            if (callback) callback(result, null);
        }).catch(error => {
            console.error('TdWeb::class send getChatMember error', error);
            if (callback) callback(null, error);
        });
    };

    return this;
}
