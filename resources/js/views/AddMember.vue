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
                                    v-model.number="addChatId" :disabled="isStarted">
                                <option v-for="chat in listChats" :value="chat.doc.chat.id">
                                    <p class="text-truncate mb-0">{{ chat.doc.chat.title }}</p>
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="groupExport">Group Export</label>
                            <select class="form-control text-white bg-dark" id="groupExport"
                                    v-model.number="exportGroupId" :disabled="isStarted">
                                <option v-for="chat in listChats" :value="chat.doc.chat.type.supergroup_id">
                                    <p class="text-truncate mb-0">{{ chat.doc.chat.title }}</p>
                                </option>
                            </select>
                        </div>
                        <div class="form-group row align-content-center">
                            <label for="limitMember" class="col-form-label col pr-0">Limit Add</label>
                            <div class="col-4">
                                <input type="number" class="form-control text-white bg-dark"
                                       v-model.number="limitAddPerAcc" :disabled="isStarted"
                                       id="limitMember" value="50" max="200" min="1">
                            </div>
                        </div>
                        <div class="form-group row align-content-center">
                            <label for="delayInput" class="col-form-label col pr-0">Delay Add (seconds)</label>
                            <div class="col-4">
                                <input type="number" class="form-control text-white bg-dark" v-model.number="delayTime"
                                       id="delayInput" value="1" max="60" min="1" :disabled="isStarted">
                            </div>
                        </div>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-primary" :disabled="isStarted" v-on:click="startAddMember">
                                Start
                            </button>
                            <button class="btn btn-info" :disabled="!isStarted" v-on:click="stopAddMember">
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
                        <th scope="col">
                            <input type="checkbox" v-model="allSelected" @input="selectAll" @change="selectAll" :disabled="isStarted">
                        </th>
                        <th scope="col">Phone</th>
                        <th scope="col">Added</th>
                        <th scope="col">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="account in listAccounts">
                        <th>
                            <input type="checkbox" :value="account" v-on:click="select" v-model="selectAccounts" :disabled="isStarted">
                        </th>
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
                    <tr v-for="(user, index) in resultUsersAdded">
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
    import {getUsersAdded, updateUsersAdded} from "../databases/UserAdded"
    import TdClient from '~/js/TdWeb'

    export default {
        name: "AddMember",
        data: function () {
            return {
                tdClient: null,
                listAccounts: [],
                selectAccounts: [],
                listUsers: [],
                resultUsersAdded: [],
                listUsersAdded: [],
                listChats: [],
                addChatId: null,
                exportGroupId: null,
                allSelected: false,
                offsetAccount: 0,
                offsetGetUser: 0,
                offsetAddUser: 0,
                offsetPerAcc: 0,
                limitAddPerAcc: 50,
                delayTime: 5 ,// second
                totalAdded: 0,
                addSuccess: 0,
                addFailed: 0,
                accAdded: 0,
                isStarted: false
            }
        },
        created() {
            const _this = this;
            getAccounts(function (err, docs) {
                if (docs) {
                    _this.listAccounts = docs.rows;
                    _this.selectAccounts = _this.listAccounts;
                }
            });
            getGroupChats(function (err, docs) {
                if (docs) {
                    _this.listChats = docs.rows;
                }
            });
        },
        methods: {
            startAddMember() {
                if (!this.addChatId) {
                    alert('Group add empty');
                    return;
                }
                if (!this.exportGroupId) {
                    alert('Group export empty');
                    return;
                }
                if (!this.selectAccounts.length === 0) {
                    alert('No account list selected!');
                    return;
                }

                console.log('START ADD MEMBER ==============================');
                this.isStarted = true;
                const _this = this;
                getUsersAdded(this.exportGroupId, this.addChatId, function (err, doc) {
                    _this.listUsersAdded = doc;
                    _this.setTdClient(_this.selectAccounts[_this.offsetAccount].doc);
                });
            },
            stopAddMember() {
                console.log('stopAddMember');
                this.isStarted = false;
            },
            setTdClient(account) {
                console.log('STEP 1: setTdClient -------------------------------------', account._id);
                const _this = this;
                this.tdClient = null;
                this.tdClient = new TdClient(account, function (update) {
                    switch (update['@type']) {
                        case 'updateAuthorizationState': {
                            console.log('setTdClient', update.authorization_state['@type']);
                            switch (update.authorization_state['@type']) {
                                case 'authorizationStateReady':
                                    if (_this.isStarted) {
                                        _this.getUsers();
                                    }
                                    break;
                            }
                        }
                    }
                });
            },
            getUsers() {
                console.log('STEP 2: getUsers');
                const _this = this;
                this.listUsers = [];
                this.offsetGetUser = 0;
                // get group info;
                this.tdClient.getSupergroup(this.exportGroupId, function (result, err) {
                    if (result) {
                        _this.getGroupMembers();
                    } else {
                        _this.nextAccount();
                    }
                });
            },
            getGroupMembers() {
                console.log('++++ getGroupMembers offsetGetUser = ' + this.offsetGetUser);
                const _this = this;
                this.tdClient.getGroupMembers(this.exportGroupId, this.offsetGetUser, function (result, err) {
                    if (result) {
                        for (let i = 0; i < result.members.length; i++) {
                            _this.listUsers.push(result.members[i].user_id)
                        }
                        _this.offsetGetUser += 200;
                        if (_this.offsetGetUser < result.total_count) {
                            _this.getGroupMembers();
                        } else {
                            _this.listUsers.sort();
                            if (_this.isStarted) {
                                console.log('STEP 3: addMember');
                                _this.addMember(_this.listUsers[_this.offsetAddUser]);
                            }
                        }
                    }
                })
            },
            addMember(userId) {
                console.log('++++ addMember:: offsetAddUser = ' + this.offsetAddUser);
                const _this = this;
                if (this.isUserAdded(userId)) {
                    _this.offsetAddUser++;
                    if (_this.offsetAddUser < _this.listUsers.length) {
                        _this.addMember(_this.listUsers[_this.offsetAddUser]);
                    }
                } else {
                    _this.tdClient.addChatMember(_this.addChatId, userId, function (result, err) {
                        _this.offsetAddUser++;
                        _this.offsetPerAcc++;
                        _this.totalAdded++;
                        if (result) {
                            _this.addSuccess++;
                            _this.accAdded++;
                        } else {
                            _this.addFailed++;
                        }
                        _this.resultUsersAdded.push({user_id: userId, added: result != null});

                        // Save to database
                        _this.listUsersAdded.userIds.push(userId);

                        if ( !_this.isStarted) return;

                        if (_this.offsetPerAcc > _this.limitAddPerAcc || (err && (err.message === 'PEER_FLOOD' || err.message === 'FLOOD_WAIT'))) {
                            _this.nextAccount();
                            return;
                        }

                        if (_this.offsetAddUser < _this.listUsers.length) {
                            _this.sleep(_this.delayTime);
                            _this.addMember(_this.listUsers[_this.offsetAddUser]);
                        }
                    })
                }
            },
            nextAccount() {
                // Run next account;
                let acc = this.selectAccounts[this.offsetAccount];
                let index = this.listAccounts.indexOf(acc);
                if (index > -1) {
                    acc.added = this.accAdded;
                    acc.status = 'Done';
                    this.listAccounts.splice(index, 1, acc);
                }
                this.offsetPerAcc = 0;
                this.accAdded = 0;
                this.offsetAccount++;
                if (this.offsetAccount < this.selectAccounts.length) {
                    console.log('NEXT ACCOUNT ------------------------------');
                    this.setTdClient(this.selectAccounts[this.offsetAccount].doc);
                } else {
                    console.log('ADD MEMBER DONE =========================================');
                    this.isStarted = false;
                    // update user added to db;
                    updateUsersAdded(this.listUsersAdded);
                }
            },
            selectAll : function ({ type, target }) {
                this.selectAccounts = [];
                if (target.checked) {
                    this.selectAccounts = this.listAccounts;
                }
            },
            select () {
                this.allSelected = false;
            },
            isUserAdded(userId) {
                const result = this.listUsersAdded.userIds.find(element => element === userId);
                return result !== undefined;
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
