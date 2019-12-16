<template>
    <div>
        <div class="row">
            <div class="col-12 d-inline-flex">
                <h3>Join group</h3>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-4">
                <div class="form-group">
                    <label for="groupChat">Group chat</label>
                    <select class="form-control" id="groupChat" v-model="chat_id">
                        <option v-for="chat in  listChats" :value="chat.doc.chat.id">
                            {{ chat.doc.chat.title }} ({{ chat.doc.chat.id }})
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary" v-on:click="joinGroup">Join</button>
                    <button type="submit" class="btn btn-primary" v-on:click="joinGroup(true)">Join All</button>
                </div>
            </div>
            <div class="col-4 offset-1">
                <table class="table table-striped table-dark">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(account, index) in  listAccounts">
                        <th><input type="checkbox" :value="index" :id="'account_' + index" v-model="selectAccounts"></th>
                        <td><label :for="'account_' + index" class="m-0">{{ account.doc.phone }}</label></td>
                        <td>{{ getFullName(account) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-if="toast_show" aria-live="polite" aria-atomic="true" style="position: relative; min-height: 200px;">
            <div class="toast" style="position: absolute; top: 0; right: 0;">
                <div class="toast-body">
                    {{ toast_msg }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getAccounts} from "../databases/db_account";
    import {getGroupChats} from "../databases/db_groupchat";
    import TdClient from '~/js/TdWeb'

    export default {
        name: "JoinGroup",
        data: function () {

            return {
                tdClient: null,
                listAccounts: [],
                selectAccounts: [],
                allSelected: false,
                listChats: [],
                chat_id: null,
                isProcessing: false,
                toast_show: false,
                toast_msg: ''
            }
        },
        created() {
            this.getDatas();
        },
        methods: {
            getDatas() {
                const _this = this;
                getGroupChats(function (err, docs) {
                    if (docs) {
                        _this.listChats = docs.rows;
                    }
                });

                getAccounts(function (err, docs) {
                    if (docs) {
                        _this.listAccounts = docs.rows;
                    }
                })
            },
            getFullName: function(account) {
                if (account.hasOwnProperty('doc') && account.doc.hasOwnProperty('user')) {
                    return account.doc.user.first_name + ' ' + account.doc.user.last_name;
                }
                return 'Empty!'
            },
            joinGroup(isAll = false) {

                this.isProcessing = true;

                if (isAll) {
                    for (let i = 0; i < this.listAccounts.length; i++) {
                        this.setTdClient(this.listAccounts[i].doc);
                    }
                } else {
                    for (let i = 0; i < this.selectAccounts.length; i++) {
                        this.setTdClient(this.listAccounts[this.selectAccounts[i]].doc);
                    }
                }
            },
            setTdClient(account) {
                console.log('setTdClient', account);

                const _this = this;
                this.tdClient = new TdClient(account, function (update) {
                    switch (update['@type']) {

                        case 'updateAuthorizationState': {

                            switch (update.authorization_state['@type']) {

                                case 'authorizationStateReady':

                                    _this.tdClient.getChat(_this.chat_id, function (result, err) {

                                    });

                                    _this.tdClient.joinChat(_this.chat_id, function (result, err) {
                                        _this.toast_show = true;
                                        if (err != null) {
                                            _this.toast_msg = _this.getFullName(account) + ' join group FAILED';
                                        } else {
                                            _this.toast_msg = _this.getFullName(account) + ' join group SUCCESS';
                                        }
                                    });
                                    break;
                            }
                        }
                    }
                });
            },
            selectAll: function() {
                this.selectAccounts = [];

                if (this.allSelected) {
                    for (account in this.listAccounts) {
                        this.selectAccounts.push(this.users[user].id.toString());
                    }
                }
            },
            select: function() {
                this.allSelected = false;
            }
        }
    }
</script>

<style scoped>

</style>
