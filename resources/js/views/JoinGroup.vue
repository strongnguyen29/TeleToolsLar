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
                    <label for="inviteLink">Group Invite Link</label>
                    <input v-model="inviteLink" type="url" class="form-control" id="inviteLink" placeholder="Invite link...">
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
                        <th scope="col">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(account, index) in  listAccounts">
                        <th><input type="checkbox" :value="index" :id="'account_' + index" v-model="selectAccounts"></th>
                        <td><label :for="'account_' + index" class="m-0">{{ account.doc.phone }}</label></td>
                        <td>{{ getFullName(account) }}</td>
                        <td>{{ account.hasOwnProperty('added') ? account.added : isProcessing ? 'processing...' : '--'}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import Db from '~/js/db'
    import TdClient from '~/js/TdWeb'

    export default {
        name: "JoinGroup",
        data: function () {

            return {
                listAccounts: [],
                selectAccounts: [],
                inviteLink: '',
                tdClient: null,
                results: [],
                isProcessing: false
            }
        },
        created() {
            this.getAcounts();
        },
        methods: {
            getFullName: function(account) {
                if (account.hasOwnProperty('doc') && account.doc.hasOwnProperty('user')) {
                    return account.doc.user.first_name + ' ' + account.doc.user.last_name;
                }
                return 'Empty!'
            },
            getAcounts() {
                const _this = this;
                Db.allDocs({include_docs: true})
                    .then(function (docs) {
                        console.log(docs);
                        _this.listAccounts = docs.rows;
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            joinGroup(isAll = false) {

                if (this.inviteLink === null || this.inviteLink.length === 0) {
                    alert('Link error!');
                    return;
                }

                this.isProcessing = true;

                if (isAll) {
                    for (let i = 0; i < this.listAccounts.length; i++) {
                        this.setTdClient(this.listAccounts[i]);
                    }
                } else {
                    for (let i = 0; i < this.selectAccounts.length; i++) {
                        this.setTdClient(this.listAccounts[this.selectAccounts[i]]);
                    }
                }
            },
            setTdClient(account) {
                console.log(account);

                const _this = this;
                _this.tdClient = new TdClient(account, function (update) {
                    switch (update['@type']) {

                        case 'updateAuthorizationState': {

                            switch (update.authorization_state['@type']) {

                                case 'authorizationStateReady':

                                    _this.tdClient.send({
                                        '@type': 'joinChatByInviteLink',
                                        invite_link: _this.inviteLink
                                    }).then(result => {
                                        console.log('send joinChatByInviteLink result', result);
                                    }).catch(error => {
                                        console.error('send joinChatByInviteLink error', error);
                                    });
                                    break;
                            }
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
