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
                        <form>
                            <div class="form-group">
                                <label for="groupAdd">Group Add</label>
                                <select class="form-control text-white bg-dark" id="groupAdd" v-model="addChatId">
                                    <option v-for="chat in listChats" :value="chat.doc.chat.id">
                                        <p class="text-truncate mb-0">{{ chat.doc.chat.title }}</p>
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="groupExport">Group Export</label>
                                <div class="row">
                                    <div class="col">
                                        <select class="form-control text-white bg-dark" id="groupExport" v-model="exportChatId">
                                            <option v-for="chat in listChats" :value="chat.doc.chat.id">
                                                <p class="text-truncate mb-0">{{ chat.doc.chat.title }}</p>
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-4 pl-0">
                                        <button class="btn btn-primary px-2" v-on:click="getUserMember">Get User</button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row align-content-center">
                                <label for="limitMember" class="col-form-label col pr-0">
                                    Limit Add
                                </label>
                                <div class="col-4">
                                    <input type="number" class="form-control text-white bg-dark" v-model="limitAddPerAcc"
                                           id="limitMember" value="50" max="200" min="1">
                                </div>
                            </div>
                            <div class="form-group row align-content-center">
                                <label for="delayInput" class="col-form-label col pr-0">Delay Add (seconds)</label>
                                <div class="col-4">
                                    <input type="number" class="form-control text-white bg-dark" v-model="delayTime"
                                           id="delayInput" value="1" max="60" min="1">
                                </div>
                            </div>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-primary" :disabled="runState === 'ready'">
                                    Start
                                </button>
                                <button class="btn btn-secondary" :disabled="runState === 'running'">
                                    Stop
                                </button>
                            </div>
                        </form>
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
                        <td>{{ user.hasOwnProperty('status') ? user.status : '-' }}</td>
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

    export default {
        name: "AddMember",
        data: function () {
            return {
                listAccounts: [],
                listUsers: [],
                listChats: [],
                addChatId: null,
                exportChatId: null,
                limitAddPerAcc: 50,
                delayTime: 1 ,// second
                totalAdded: 0,
                addSuccess: 0,
                addFailed: 0,
                runState: 'pending' // pending, ready, running
            }
        },
        created() {
            const _this = this;
            getAccounts(function (err, docs) {
                if (docs) {
                    _this.listAccounts = docs.rows;
                }
            });
            getGroupChats(function (err, docs) {
                if (docs) {
                    _this.listChats = docs.rows;
                }
            })
        },
        methods: {
            getUserMember() {

            },
            startAddMember() {

            },
            stopAddMember() {

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
