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
                        <h5 class="card-title m-0">Info</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Total Add: </strong>12345</p>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <table class="table table-striped table-dark">
                    <thead>
                    <tr>
                        <th scope="col">Group chat</th>
                        <th scope="col">#</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>

                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import Db from '~/js/db'
    import TdWeb from "~/js/TdWeb";

    export default {
        name: "AccountProfile",
        props: ['phone'],
        data: function () {
            return {
                tdClient: null,
                account: null,
                listChats: [],
                error: null
            }
        },
        beforeRouteEnter (to, from, next) {
            Db.get(to.params.phone, function(err, doc) {
                console.log('beforeRouteEnter::', doc);
                next(vm => vm.setData(err, doc))
            });
        },
        methods: {
            setTdClient() {
                console.log('setTdClient:: ');
                const _this = this;
                this.tdClient = new TdWeb(this.account, function (update) {
                    switch (update['@type']) {
                        case 'updateAuthorizationState': {
                            switch (update.authorization_state['@type']) {
                                case 'authorizationStateReady':
                                    _this.getChats();
                                    break;
                                case 'authorizationStateClosed':
                                    //_this.setTdClient();
                                    break;
                            }
                        }
                    }
                })
            },
            getChats() {
                this.tdClient.client.send({
                    '@type': 'getChats',
                    offset_order: '9223372036854775807',
                    offset_chat_id: '0',
                    'limit': 100
                }).then(result => {
                    console.log('send getChats result', result);
                    for (let i = 0; i < result.chat_ids.length; i++) {
                        if (result.chat_ids[i] < -1000000000) {
                            this.getChat(result.chat_ids[i]);
                        }
                    }
                }).catch(error => {
                    console.error('send getChats error', error);
                });
            },
            getChat(chatId) {
                this.tdClient.client.send({
                    '@type': 'getChat',
                    chat_id: chatId
                }).then(result => {
                    console.log('send getChat result', result);
                    this.listChats.push(result);
                }).catch(error => {
                    console.error('send getChat error', error);
                });
            },
            setData (err, account) {
                console.log('setData:: ', [err, account]);

                if (err) {
                    this.error = err.toString()
                } else {
                    this.account = account
                    this.setTdClient();
                }
            }
        }
    }
</script>

<style scoped>

</style>
