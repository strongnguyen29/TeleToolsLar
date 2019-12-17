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

    import {isValidPhoneNumber, isSuperGroupChat, isPublicGroup} from '../helpers/common'
    import {createAccount, getAccount} from '../databases/Account'
    import TdClient from '../TdWeb'
    import Account from "../models/Account";

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
        methods :{
            getAccount() {
                if(!isValidPhoneNumber(this.phoneNumber)) {
                    alert('Wrong phone number!');
                    return;
                }
                const _this = this;

                getAccount(this.phoneNumber, function (err, account) {
                    if (err) {
                        _this.account = new Account(_this.phoneNumber, _this.apiId, _this.apiHash);
                    } else {
                        _this.account = doc;
                        if (_this.apiId.length > 1) {
                            _this.account.apiId = _this.apiId;
                        }
                        if (_this.apiHash.length > 1) {
                            _this.account.apiHash = _this.apiHash;
                        }
                    }
                    _this.tdClientInit();
                });
            },
            tdClientInit() {
                const _this = this;
                tdClient = new TdClient(_this.account, function (update) {
                    switch (update['@type']) {
                        case 'updateAuthorizationState': {
                            switch (update.authorization_state['@type']) {

                                case 'authorizationStateWaitPhoneNumber':
                                    tdClient.sendPhone(_this.phoneNumber);
                                    break;

                                case 'authorizationStateWaitCode':
                                    _this.loginState = 'login-code';
                                    break;

                                case 'authorizationStateReady':
                                    _this.loginState = 'login-done';
                                    break;
                            }
                            break;
                        }
                        case 'updateOption': {

                            if (update.name === 'my_id') {

                                tdClient.getUser(update.value.value, function (user, error) {
                                    if (user) {
                                        _this.account.user = user;
                                        createAccount(_this.account);
                                        _this.gotoProfile(_this.phoneNumber);
                                    }
                                })
                            }
                        }
                    }
                });

            },
            sendCode() {
                tdClient.sendCode(this.codeActive);
            },
            gotoProfile(phone) {
                this.$router.push({ name: 'profile', query: { phone: phone } })
            }
        }
    }
</script>

<style scoped>

</style>
