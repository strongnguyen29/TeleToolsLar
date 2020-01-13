<template>
    <div>
        <div class="row">
            <div class="col-12 d-inline-flex">
                <h3>Account profile</h3>
            </div>
        </div>
        <div class="row" v-if="account">
            <div class="col-4">
                <div class="card text-white bg-dark">
                    <div class="card-header">
                        <h5 class="card-title m-0">INFO</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Phone: </strong>{{ account.phone}}</p>
                        <p class="card-text"><strong>Full name: </strong>{{ account.user.first_name }} {{ account.user.last_name }}</p>
                        <p class="card-text"><strong>Username: </strong>{{ account.user.username}}</p>
                        <p class="card-text"><strong>Api id: </strong>{{ account.apiId}}</p>
                        <p class="card-text"><strong>Api hash: </strong>{{ account.apiHash}}</p>
                        <p class="card-text"><strong>databaseDirectory: </strong>{{ account.databaseDirectory}}</p>
                        <p class="card-text"><strong>filesDirectory: </strong>{{ account.filesDirectory}}</p>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="card text-white bg-dark">
                    <div class="card-header">
                        <h5 class="card-title m-0">PUBLIC GROUP</h5>
                    </div>
                    <div class="card-body">
                        <table class="table table-striped table-dark">
                            <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Chat name</th>
                                <th scope="col">Group ID</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(chat, index) in listChats">
                                <td>{{ chat.id}}</td>
                                <td>{{ chat.title}}
                                    <span class="badge" :class="isPublicGroup(chat) ? 'badge-primary' : 'badge-light'">
                                        {{ isPublicGroup(chat) ? 'Public group' : 'Channel' }}
                                    </span>
                                </td>
                                <td>{{ chat.type.supergroup_id}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {isPublicGroup, isSuperGroupChat} from '../helpers/common'
    import {getAccount} from "../databases/Account";
    import {createOrUpdateGroupChat} from '../databases/GroupChat'
    import TdWeb from "../TdWeb";
    import GroupChat from "../models/GroupChat";

    let tdClient;
    
    export default {
        name: "AccountProfile",
        props: ['phone'],
        data: function () {
            return {
                account: null,
                listChats: [],
                error: null
            }
        },
        beforeRouteEnter (to, from, next) {

            getAccount(to.query.phone, function (err, account) {
                next(vm => vm.setData(err, account))
            });
        },
        methods: {
            setTdClient() {
                console.log('setTdClient');
                const _this = this;
                tdClient = new TdWeb(_this.account, function (update) {
                    switch (update['@type']) {
                        case 'updateAuthorizationState': {
                            switch (update.authorization_state['@type']) {
                                case 'authorizationStateReady':
                                    _this.getChats();
                                    break;
                            }
                        }
                    }
                })
            },
            getChats() {
                const _this = this;
                tdClient.getChats(function (result, error) {
                    if (result) {
                        for (let i = 0; i < result.chat_ids.length; i++) {
                            let chatId = result.chat_ids[i];

                            if (isSuperGroupChat(chatId)) {
                                _this.getChat(chatId);
                            }
                        }
                    }
                });
            },
            getChat(chatId) {
                const _this = this;
                tdClient.getChat(chatId, function (result, error) {
                    if (result) {
                        _this.listChats.push(result);
                        createOrUpdateGroupChat(new GroupChat(result));
                        /*
                        if (isPublicGroup(result)) {
                            _this.listChats.push(result);
                            createOrUpdateGroupChat(new GroupChat(result));
                        }
                        */
                    }
                });
            },
            setData (err, account) {
                console.log('setData:: ', [err, account]);

                if (err) {
                    this.error = err.toString()
                } else {
                    this.account = account;
                    this.setTdClient();
                }
            },
            isPublicGroup(chat) {
                return isPublicGroup(chat);
            }
        }
    }
</script>

<style scoped>

</style>
