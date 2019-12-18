<template>
    <div>
        <div class="row">
            <div class="col-12">
                <h3>Add member</h3>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-3">
                <div class="card text-white bg-dark">
                    <div class="card-header">
                        <h5 class="card-title m-0">Setup</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Total Add: </strong>{{ totalAdded }}</p>
                        <p><strong>Added Success: </strong>{{ addSuccess }}</p>
                        <p><strong>Added Failed: </strong>{{ addFailed }}</p>
                        <div class="form-group">
                            <label for="groupAdd">Group Add</label>
                            <select class="form-control text-white bg-dark" id="groupAdd"
                                    v-model.number="addChatId" :disabled="runState === 'running'">
                                <option v-for="chat in listChats" :value="chat.doc.chat.id">
                                    <p class="text-truncate mb-0">{{ chat.doc.chat.title }}</p>
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="groupExport">Group Export</label>
                            <div class="row justify-content-between">
                                <div class="col">
                                    <select class="form-control text-white bg-dark" id="groupExport"
                                            v-model.number="exportGroupId" :disabled="runState === 'getuser'">
                                        <option v-for="chat in listChats" :value="chat.doc.chat.type.supergroup_id">
                                            <p class="text-truncate mb-0">{{ chat.doc.chat.title }}</p>
                                        </option>
                                    </select>
                                </div>
                                <div class="col-4 col-lg-3 pl-0">
                                    <button class="btn btn-primary px-2" v-on:click="getUserMember">Get User</button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row align-content-center">
                            <label for="limitMember" class="col-form-label col pr-0">
                                Limit Add
                            </label>
                            <div class="col-4">
                                <input type="number" class="form-control text-white bg-dark" v-model.number="limitAddPerAcc"
                                       id="limitMember" value="50" max="200" min="1">
                            </div>
                        </div>
                        <div class="form-group row align-content-center">
                            <label for="delayInput" class="col-form-label col pr-0">Delay Add (seconds)</label>
                            <div class="col-4">
                                <input type="number" class="form-control text-white bg-dark" v-model.number="delayTime"
                                       id="delayInput" value="1" max="60" min="1">
                            </div>
                        </div>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-primary" :disabled="runState !== 'ready'" v-on:click="startAddMember">
                                Start
                            </button>
                            <button class="btn btn-secondary" :disabled="runState !== 'running'" v-on:click="stopAddMember">
                                Stop
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-5 tb-list">
                <table class="table table-striped table-dark">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Added</th>
                        <th scope="col">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(account, index) in listAccounts">
                        <th>{{ index }}</th>
                        <td>+{{ account.doc.phone }}</td>
                        <td>{{ account.hasOwnProperty('added') ? account.added : '-' }}</td>
                        <td>{{ account.hasOwnProperty('status') ? account.status : '-' }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-4 tb-list">
                <table class="table table-striped table-dark">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">ID</th>
                        <th scope="col">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(user, index) in listUsers">
                        <th>{{ index }}</th>
                        <td>{{ user.user_id }}</td>
                        <td>{{ user.hasOwnProperty('added') ? user.added : '-' }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import {getAccounts} from "../databases/Account";
    import {getGroupChats} from "../databases/GroupChat";
    import TdClient from '~/js/TdWeb'

    export default {
        name: "AddMember",
        data: function () {
            return {
                tdClient: null,
                listAccounts: [],
                listUsers: [],
                listChats: [],
                addChatId: null,
                exportGroupId: null,
                offsetAccount: 0,
                offsetGetUser: 0,
                offsetAddUser: 0,
                offsetPerAcc: 0,
                limitAddPerAcc: 50,
                delayTime: 5 ,// second
                totalAdded: 0,
                addSuccess: 0,
                addFailed: 0,
                runState: 'pending' // pending, getuser, ready, running
            }
        },
        created() {
            const _this = this;
            getAccounts(function (err, docs) {
                if (docs) {
                    _this.listAccounts = docs.rows;
                    _this.setTdClient(_this.listAccounts[_this.offsetAccount].doc);
                }
            });
            getGroupChats(function (err, docs) {
                if (docs) {
                    _this.listChats = docs.rows;
                }
            });
        },
        methods: {
            setTdClient(account) {
                const _this = this;
                this.tdClient = new TdClient(account, function (update) {
                    switch (update['@type']) {
                        case 'updateAuthorizationState': {

                            console.log('setTdClient', update.authorization_state['@type']);
                            switch (update.authorization_state['@type']) {
                                case 'authorizationStateReady':
                                    if (_this.runState === 'running') {
                                        _this.addMember(_this.listUsers[_this.offsetAddUser].user_id);
                                    }
                                    break;
                            }
                        }
                    }
                });
            },
            getUserMember() {
                const _this = this;
                this.listUsers = [];
                _this.offsetGetUser = 0;
                if (this.tdClient) {
                    this.tdClient.getSupergroup(this.exportGroupId, function (result, err) {
                        if (result) {
                            _this.getGroupMembers();
                        }
                    });
                }
            },
            getGroupMembers() {
                console.log('getGroupMembers offsetGetUser = ' + this.offsetGetUser);
                const _this = this;
                this.tdClient.getGroupMembers(this.exportGroupId, this.offsetGetUser, function (result, err) {
                    if (result) {
                        for (let i = 0; i < result.members.length; i++) {
                            _this.listUsers.push({user_id: result.members[i].user_id})
                        }
                        _this.offsetGetUser += 200;
                        if (_this.offsetGetUser < result.total_count) {
                            _this.getGroupMembers();
                        } else {
                            _this.runState = 'ready';
                        }
                    }
                })
            },
            startAddMember() {
                console.log('startAddMember');
                this.runState = 'running';
                this.addMember(this.listUsers[this.offsetAddUser].user_id);
            },
            stopAddMember() {
                console.log('stopAddMember');
                this.runState = 'ready';
            },
            addMember(userId) {
                console.log('addMember:: offsetAddUser = ' + this.offsetAddUser);
                const _this = this;
                this.tdClient.addChatMember(this.addChatId, userId, function (result, err) {
                    _this.offsetAddUser++;
                    _this.totalAdded++;
                    _this.offsetPerAcc++;

                    if (result) _this.addSuccess++; else _this.addFailed++;

                    if (_this.offsetPerAcc > _this.limitAddPerAcc
                        || (err && (err.message === 'PEER_FLOOD' || err.message === 'FLOOD_WAIT'))) {
                        _this.setTdClient(_this.listAccounts[_this.offsetAccount].doc);
                        return;
                    }

                    if (_this.runState === 'running' && _this.offsetAddUser < _this.listUsers.length) {
                        _this.sleep(_this.delayTime);
                        _this.addMember(_this.listUsers[_this.offsetAddUser].user_id);
                    }
                })
            },
            sleep(s) {
                const date = Date.now();
                let currentDate = null;
                do {
                    currentDate = Date.now();
                } while (currentDate - date < s * 1000);
            }
        }
    }
</script>

<style scoped>
    .tb-list {
        max-height: 80vh;
        overflow: auto
    }
</style>
