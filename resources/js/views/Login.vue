<template>
    <div>
        <div class="row">
            <div class="col-12 d-inline-flex">
                <h3>Login</h3>
            </div>
        </div>
        <div v-if="loginState === 'login-phone'" class="row login-phone">
            <div class="col-4">
                <div class="form-group row">
                    <label for="phoneNumber" class="col-sm-3 col-form-label">Phone: </label>
                    <div class="col-sm-9">
                        <input v-model="phoneNumber" type="number" id="phoneNumber" class="input-group" placeholder="Phone number..."/>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="apiId" class="col-sm-3 col-form-label">Api id: </label>
                    <div class="col-sm-9">
                        <input v-model="apiId" type="text" id="apiId" class="input-group" placeholder="Api id..."/>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="apiHash" class="col-sm-3 col-form-label">Api hash: </label>
                    <div class="col-sm-9">
                        <input v-model="apiHash" type="text" id="apiHash" class="input-group" placeholder="Api hash..."/>
                    </div>
                </div>
                <button class="btn btn-primary mt-2" v-on:click="getAccount">Get code</button>
            </div>
            <div class="col-8 pl-5">
                <h6 class="text-uppercase">GET API id & Api hash</h6>
                <p>
                    - Log in to your Telegram core: <a href="https://my.telegram.org" target="_blank">https://my.telegram.org.</a><br/>
                    - Go to ‘API development tools’ and fill out the form.<br/>
                    - You will get basic addresses as well as the api_id and api_hash parameters required for user authorization.
                </p>
            </div>
        </div>

        <div v-else-if="loginState === 'login-code'" class="row login-code">
            <div class="col-6">
                <input v-model="codeActive" type="text" class="input-group" placeholder="Code number..."/>
                <button class="btn btn-primary mt-2" v-on:click="sendCode">Login</button>
            </div>
        </div>

        <div v-else-if="loginState === 'login-done'" class="row login-done">
            <p>Login success !</p>
        </div>
    </div>
</template>

<script>

    import {isValidPhoneNumber} from '~/js/helpers/common'
    import TdClient from '~/js/TdWeb'
    import Account from "../models/account";
    import Db from '~/js/db'

    let tdClient;

    export default {
        name: "Login",
        data: function () {
            return {
                loginState: 'login-phone',
                account: null,
                phoneNumber: '',
                apiId: '',
                apiHash: '',
                codeActive: ''
            }
        },
        created() {

        },
        methods :{
            getAccount() {
                if(!isValidPhoneNumber(this.phoneNumber)) {
                    alert('Wrong phone number!');
                    return;
                }

                const _this = this;

                Db.get(this.phoneNumber)
                    .then(function (doc) {
                        console.log(doc);
                        _this.account = doc;
                        if (!_this.apiId.empty())
                        _this.account.apiId = _this.apiId;
                        _this.account.apiHash = _this.apiHash;
                        _this.tdClientInit();
                    }).catch(function (err) {
                        console.log(err);
                        _this.account = new Account(this.phoneNumber, this.apiId, this.apiHash);
                        _this.tdClientInit();
                    });
            },
            tdClientInit() {
                tdClient = new TdClient(this.account);
                tdClient.client.onUpdate = update => {

                    switch (update['@type']) {

                        case 'updateAuthorizationState': {
                            console.log('receive update', update);
                            switch (update.authorization_state['@type']) {

                                case 'authorizationStateWaitTdlibParameters':
                                    console.log(tdClient.parameters);
                                    tdClient.client.send({
                                        '@type': 'setTdlibParameters',
                                        parameters: tdClient.parameters
                                    }).then(result => {
                                        console.log('send setTdlibParameters result', result);
                                    }).catch(error => {
                                        console.error('send setTdlibParameters error', error);
                                    });
                                    break;

                                case 'authorizationStateWaitEncryptionKey':
                                    tdClient.client.send({ '@type': 'checkDatabaseEncryptionKey' });
                                    break;

                                case 'authorizationStateWaitPhoneNumber':
                                    this.sendPhone();
                                    break;

                                case 'authorizationStateWaitCode':
                                    this.loginState = 'login-code';
                                    break;

                                case 'authorizationStateReady':
                                    this.loginState = 'login-done';

                                    break;
                            }
                            break;
                        }
                        case 'updateOption': {

                            if (update.name === 'my_id') {
                                console.log('receive update', update);
                                this.getUserInfo(update.value.value);
                            }
                        }
                    }
                };
            },
            sendPhone() {
                tdClient.client.send({
                    '@type': 'setAuthenticationPhoneNumber',
                    phone_number: this.phoneNumber
                }).then(result => {
                    console.log('send phone result', result);
                }).catch(error => {
                    console.error('send phone error', error);
                });
            },
            sendCode() {
                tdClient.client.send({
                    '@type': 'checkAuthenticationCode',
                    code: this.codeActive
                }).then(result => {
                    console.log('send code result', result);
                }).catch(error => {
                    console.error('send code error', error);
                });
            },
            getUserInfo(userId) {
                const _this = this;
                tdClient.client.send({
                    '@type': 'getUser',
                    user_id: userId
                }).then(result => {
                    console.log('send getUserInfo result', result);
                    _this.account.user = result;

                    Db.put(this.account)
                        .then(function (response) {
                            // handle response
                            console.log('DB: add new account:: success', response);
                        }).catch(function (err) {
                        console.log('DB: add new account:: error',err);
                    });

                }).catch(error => {
                    console.error('send getUserInfo error', error);
                });
            }
        }
    }
</script>

<style scoped>

</style>
