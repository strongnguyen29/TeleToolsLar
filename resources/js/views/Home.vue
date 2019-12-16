<template>
    <div>
        <div class="row">
            <div class="col-12 d-inline-flex">
                <h3>List account</h3>
                <button type="button" class="btn btn-sm btn-primary ml-4" v-on:click="gotoLogin">Thêm tài khoản</button>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-8">
                <table class="table table-striped table-dark">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Full Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">#</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(account, index) in listAccounts.rows">
                        <th>{{ index }}</th>
                        <td>+{{ getPhone(account) }}</td>
                        <td>{{ getFullName(account) }}</td>
                        <td>@{{ getUserName(account) }}</td>
                        <td><button class="btn btn-sm btn-primary" v-on:click="gotoProfile(getPhone(account))">Login</button></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import {getAccounts} from '../databases/db_account'

    export default {
        name: "Home",
        data: function () {
            return {
                listAccounts: {}
            }
        },
        created() {
            this.getAccounts();
        },
        methods:{
            gotoLogin() {
                this.$router.push('login')
            },
            gotoProfile(phone) {
                this.$router.push({ name: 'profile', query: { phone: phone } })
            },
            getAccounts() {
                const _this = this;
                getAccounts(function (err, docs) {
                    if (err) {
                        console.log('getAcounts: ', err);
                        return;
                    }
                    _this.listAccounts = docs;
                })
            },
            getPhone: function (account) {
                if (account.hasOwnProperty('doc') && account.doc.hasOwnProperty('phone')) {
                    return account.doc.phone;
                }
                return 'No phone number!'
            },
            getFullName: function(account) {
                if (account.hasOwnProperty('doc') && account.doc.hasOwnProperty('user')) {
                    return account.doc.user.first_name + ' ' + account.doc.user.last_name;
                }
                return 'Empty!'
            },
            getUserName: function(account) {
                if (account.hasOwnProperty('doc') && account.doc.hasOwnProperty('user')
                    && account.doc.user.hasOwnProperty('username')) {
                    return account.doc.user.username;
                }
                return 'Empty!'
            },
        }
    }
</script>

<style scoped>

</style>
