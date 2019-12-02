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
            <p>Login success!</p>
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
                chatList: []
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
                }).catch(error => {
                    console.error('send getChats error', error);
                });
            }
        }
    }
</script>

<style scoped>

</style>
