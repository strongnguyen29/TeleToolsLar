<template>
    <div class="wrap-content mt-5">

        <div v-if="appState === 'login-phone'" class="row login-phone">
            <div class="col-10">
                <input v-model="phoneNumber" type="text" class="input-group" placeholder="Phone number..."/>
                <button class="btn btn-primary mt-2" v-on:click="sendPhone">Login</button>
            </div>
        </div>

        <div v-else-if="appState === 'login-code'" class="row login-code">
            <div class="col-10">
                <input v-model="codeActive" type="text" class="input-group" placeholder="Code number..."/>
                <button class="btn btn-primary mt-2" v-on:click="sendCode">Login</button>
            </div>
        </div>

        <div v-else-if="appState === 'login-done'" class="row send-mes">
            <div class="col-4">
                <h2>List groups</h2>
                <ul class="list-group">
                    <li class="list-group-item chat-item d-flex justify-content-between align-items-center"
                        v-for="chat in listChats"
                        v-on:click="selectGroup(chat.id)"
                        v-bind:class="{active: addGroupId === chat.id}">
                        {{chat.id}} - {{chat.title}}
                        <span class="badge badge-primary badge-pill py-2"
                              v-on:click="getChatMembers(chat.type.supergroup_id)">
                            Get members
                        </span>
                    </li>
                </ul>
            </div>
            <div class="col-4 col-input">
                <h2>Add user to group</h2>
                <div class="form-group">
                    <label for="add-user-id">User ID</label>
                    <input v-model="addUserId" type="number"  class="form-control" id="add-user-id" placeholder="User ID...">
                </div>
                <div class="form-group">
                    <label for="add-user-id">Chat group ID</label>
                    <input v-model="addGroupId" type="number"  class="form-control" id="add-group-id" placeholder="Enter group id...">
                </div>

                <button class="btn btn-primary mt-2" v-on:click="addGroupMember">Add</button>

                <div class="row mt-5">
                    <p v-for="result in addResults">Thêm {{ result }}</p>
                </div>

                <h2 class="pt-5 border-top">Search user by id</h2>
                <div class="form-group">
                    <label for="user-id">User ID</label>
                    <input v-model="userId" type="number"  class="form-control" id="user-id" placeholder="User ID...">
                </div>
                <button class="btn btn-primary mt-2" v-on:click="getUserInfo">Get info</button>

                <div v-if="userInfo.hasOwnProperty('id')" class="row user-info mt-5">
                    <p v-if="userInfo.hasOwnProperty('username')">
                        <b>User name: </b>{{userInfo.username}}
                    </p>
                    <br/>
                    <p v-if="userInfo.hasOwnProperty('first_name')">
                        <b>Full name: </b>{{userInfo.first_name + ' ' + userInfo.last_name}}
                    </p>
                </div>
            </div>
            <div class="col-4">
                <h2>Group users</h2>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-for="member in listMembers" v-on:click="selectUser(member.id)">
                        <p class="text-truncate">
                            {{member.id}} - {{member.first_name}} {{member.last_name}}
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import TdClient from 'tdweb'
    const apiId = '1096535';
    const apiHash = '3580aaad6483792444aa67b026b57416';
    const group = -1001297053658;
    const user = 968902212;

    let options = {
        logVerbosityLevel: 1,
        jsLogVerbosityLevel: 3,
        mode: 'asmjs',
        prefix: 'tdlib',
        readOnly: false,
        isBackground: false,
        useDatabase: false
    };
    let tdClient;

    export default {
        name: "TelegramComponent",
        data: function () {
            return {
                appState: 'init',
                phoneNumber: '',
                codeActive: '',
                listChats: [],
                listMembers: [],
                userId: 968902212,
                userInfo: {},
                addUserId: user,
                addGroupId: group,
                addResults: []
            }
        },
        created() {
            this.TdClientInit();
        },
        methods: {
            TdClientInit() {
                tdClient = new TdClient(options);
                tdClient.onUpdate = update => {
                    console.log('receive update', update);
                    switch (update['@type']) {

                        case 'updateAuthorizationState': {

                            switch (update.authorization_state['@type']) {
                                case 'authorizationStateLoggingOut':

                                    break;
                                case 'authorizationStateWaitTdlibParameters':
                                    this.sendParamters();
                                    break;
                                case 'authorizationStateWaitEncryptionKey':
                                    tdClient.send({ '@type': 'checkDatabaseEncryptionKey' });
                                    break;
                                case 'authorizationStateWaitPhoneNumber': {
                                    this.appState = 'login-phone';
                                    break;
                                }
                                case 'authorizationStateWaitCode':
                                    this.appState = 'login-code';
                                    break;
                                case 'authorizationStateWaitPassword':
                                    break;
                                case 'authorizationStateReady':
                                    this.appState = 'login-done';
                                    this.getChats();
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
            },
            sendPhone() {
                tdClient.send({
                    '@type': 'setAuthenticationPhoneNumber',
                    phone_number: this.phoneNumber
                }).then(result => {
                    console.log('send phone result', result);
                }).catch(error => {
                    console.error('send phone error', error);
                });
            },
            sendCode() {
                tdClient.send({
                    '@type': 'checkAuthenticationCode',
                    code: this.codeActive
                }).then(result => {
                    console.log('send code result', result);
                }).catch(error => {
                    console.error('send code error', error);
                });
            },
            sendMessage() {

            },
            sendParamters() {

                tdClient.send({
                    '@type': 'setTdlibParameters',
                    parameters: {
                        '@type': 'tdParameters',
                        api_id: apiId,
                        api_hash: apiHash,
                        system_language_code: 'en',
                        system_version: 'Windows 10',
                        application_version: '1.0',
                        device_model: 'Chrome',
                    }
                }).then(result => {
                    console.log('send result', result);
                }).catch(error => {
                    console.error('send error', error);
                });
            },
            getChats() {
                tdClient.send({
                    '@type': 'getChats',
                    offset_order: '9223372036854775807',
                    offset_chat_id: '0',
                    'limit': 20
                }).then(result => {
                    console.log('send getChats result', result);
                    
                    for (let i = 0; i < result.chat_ids.length; i++) {

                        if (result.chat_ids[i] < -1000000000) {
                            this.getChat(result.chat_ids[i]);
                        }
                    } 
                }).catch(error => {
                    console.error('send getChats error', error);
                });
            },
            getUserInfo() {
                tdClient.send({
                    '@type': 'getUser',
                    user_id: this.userId
                }).then(result => {
                    console.log('send getUserInfo result', result);
                    this.userInfo = result;
                }).catch(error => {
                    console.error('send getUserInfo error', error);
                });
            },
            addGroupMember() {
                tdClient.send({
                    '@type': 'addChatMember',
                    chat_id: this.addGroupId,
                    user_id: this.addUserId,
                    forward_limit: 5
                }).then(result => {
                    console.log('send getUserInfo result', result);
                    this.addResults.push(result['@type']);
                }).catch(error => {
                    console.error('send getUserInfo error', error);
                });
            },
            getChat(chatId) {
                tdClient.send({
                    '@type': 'getChat',
                    chat_id: chatId
                }).then(result => {
                    console.log('send getChat result', result);
                    this.listChats.push(result);
                }).catch(error => {
                    console.error('send getChat error', error);
                });
            },
            getChatMembers(groupId) {
                this.listMembers = [];
                tdClient.send({
                    '@type': 'getSupergroupMembers',
                    supergroup_id: groupId,
                    offset: 0,
                    limit:200
                }).then(result => {
                    console.log('send getChatMembers result', result);
                    if (result.hasOwnProperty('members')) {

                        for (let j = 0; j < result.members.length; j++) {
                            let mem = result.members[j];
                            tdClient.send({
                                '@type': 'getUser',
                                user_id: mem.user_id
                            }).then(result => {
                                console.log('send getUserInfo result', result);
                                this.listMembers.push(result)
                            }).catch(error => {
                                console.error('send getUserInfo error', error);
                            });
                        }
                    }
                }).catch(error => {
                    console.error('send getChatMembers error', error);
                    this.listMembers = [];
                });
            },
            selectGroup(chatId) {
                this.addGroupId = chatId;
            },
            selectUser(userId) {
                this.addUserId = userId;
            }
        }
    }
</script>

<style scoped>
    .chat-item {
        cursor: pointer;
    }
    .list-group {
        max-height: 80vh;
        overflow: auto;
    }
    .col-input {
        background: #eeeeee;
    }
    .badge {
        font-size: 0.875rem;
        font-weight: normal;
    }
</style>
