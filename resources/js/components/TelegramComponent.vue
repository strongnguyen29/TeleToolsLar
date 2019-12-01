<template>
    <div class="row mt-5">
        <div class="col-12">
            <input v-model="groupId" type="text" name="group_id" placeholder="Group id..."/>
        </div>
        <div class="col-12 mt-2">
            <input v-model="userId" type="text" name="group_id" placeholder="Group id..."/>
        </div>
        <div class="col-12 mt-2">
            <button v-on:click="addMember()">Thêm</button>
        </div>
        <div class="col-12 mt-4">
            <ul>
                <li v-for="item in results">{{ item }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import TdClient from 'tdweb'

    export default {
        name: "TelegramComponent",
        data: function () {
            return {
                results: [],
                userId: 0,
                groupId: 0
            }
        },
        created() {
            let options = {
                logVerbosityLevel: 1,
                jsLogVerbosityLevel: 3,
                mode: 'asmjs', // 'wasm-streaming'/'wasm'/'asmjs'
                prefix: 'tdlib',
                readOnly: false,
                isBackground: false,
                useDatabase: false
            };
            let tdClient = new TdClient(options);
            tdClient.onUpdate = update => {
                console.log(update);
            };
            console.log(tdClient);
        },
        methods: {
            addMember() {
                ///tdweb.send()
                this.results.push('Group id: ' + this.groupId + ' | User id: ' + this.userId);
            }
        }
    }
</script>

<style scoped>

</style>