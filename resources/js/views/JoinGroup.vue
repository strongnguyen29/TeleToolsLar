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
                    <label for="inviteLink">Group invite link</label>
                    <input type="url" v-model="inviteLink" class="form-control" id="inviteLink"/>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary" v-on:click="joinGroup" :disabled="processing">
                        {{ processing ? 'processing...' : 'Join group'}}
                    </button>
                </div>
            </div>
            <div class="col-4 offset-1">
                <table class="table table-striped table-dark">
                    <thead>
                    <tr>
                        <th scope="col">
                            <input type="checkbox" v-model="allSelected" @input="selectAll" @change="selectAll">
                        </th>
                        <th scope="col">Phone</th>
                        <th scope="col">Name</th>
                        <th scope="col">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(account, index) in  listAccounts">
                        <th>
                            <input type="checkbox"
                                   :value="index" :id="'account_' + index"
                                   v-on:click="select"
                                   v-model="selectAccounts">
                        </th>
                        <td><label :for="'account_' + index" class="m-0">{{ account.doc.phone }}</label></td>
                        <td>{{ getFullName(account) }}</td>
                        <td>{{ account.hasOwnProperty('added') ? account.added : '-' }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import {getAccounts} from "../databases/db_account";
    import TdClient from '~/js/TdWeb'

    export default {
        name: "JoinGroup",
        data: function () {

            return {
                tdClient: null,
                listAccounts: [],
                selectAccounts: [],
                indexProcess: 0,
                allSelected: false,
                inviteLink: '',
                processing: false
            }
        },
        created() {
            this.getDatas();
        },
        methods: {
            getDatas() {
                const _this = this;

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
            joinGroup() {
                if (this.inviteLink.length < 3) {
                    alert('Link ko đúng.');
                    return;
                }
                if (this.selectAccounts.length === 0) {
                    alert('Chưa chọn account tham gia group.');
                    return;
                }

                this.processing = true;
                this.tdClient = null;
                this.indexProcess = 0;
                this.setTdClient(this.listAccounts[this.selectAccounts[this.indexProcess]].doc);
            },
            setTdClient(account) {
                console.log('setTdClient', account);
                const _this = this;
                this.tdClient = new TdClient(account, function (update) {
                    switch (update['@type']) {
                        case 'updateAuthorizationState': {
                            switch (update.authorization_state['@type']) {
                                case 'authorizationStateReady':
                                    _this.tdClient.joinChatByInviteLink(_this.inviteLink, function (result, err) {

                                        let acc = _this.listAccounts[_this.selectAccounts[_this.indexProcess]];
                                        acc.added = err ? 'Failed' : 'Success';
                                        _this.listAccounts.splice(_this.selectAccounts[_this.indexProcess], 1, acc);

                                        _this.indexProcess++;
                                        if (_this.indexProcess < _this.selectAccounts.length) {
                                            _this.setTdClient(_this.listAccounts[_this.selectAccounts[_this.indexProcess]].doc);
                                        } else {
                                            _this.processing = false;
                                        }
                                    });
                                    break;
                            }
                        }
                    }
                });
            },
            selectAll : function ({ type, target }) {
                console.log('selectAll', target.checked);
                this.selectAccounts = [];
                if (target.checked) {
                    for (let i = 0; i < this.listAccounts.length; i++) {
                        this.selectAccounts.push(i);
                    }
                }
            },
            select () {
                this.allSelected = false;
            },
        }
    }
</script>

<style scoped>

</style>
