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
                        <p class="card-text"><strong>Total Add: </strong>12345</p>
                        <p><strong>Added Success: </strong>564</p>
                        <p><strong>Added Failed: </strong>569</p>
                        <form>
                            <div class="form-group">
                                <label for="groupAdd">Group Add</label>
                                <select class="form-control text-white bg-dark" id="groupAdd">
                                    <option v-for="i in 10">
                                        <p class="text-truncate mb-0">
                                            SuperGroup {{i}}
                                        </p>
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="groupExport">Group Export</label>
                                <select class="form-control text-white bg-dark" id="groupExport">
                                    <option v-for="i in 10">
                                        <p class="text-truncate mb-0">SuperGroup {{i}}</p>
                                    </option>
                                </select>
                            </div>
                            <div class="form-group row align-content-center">
                                <label for="limitMember" class="col-form-label col pr-0">
                                    Limit Add
                                </label>
                                <div class="col-4">
                                    <input type="number" class="form-control text-white bg-dark"
                                           id="limitMember" value="50" max="200" min="1">
                                </div>
                            </div>
                            <div class="form-group row align-content-center">
                                <label for="delayInput" class="col-form-label col pr-0">Delay Add (seconds)</label>
                                <div class="col-4">
                                    <input type="number" class="form-control text-white bg-dark"
                                           id="delayInput" value="1" max="60" min="1">
                                </div>
                            </div>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-primary">Start</button>
                                <button class="btn btn-secondary">Stop</button>
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
                    <tr v-for="i in 200">
                        <th>{{ i }}</th>
                        <td>+84396905875</td>
                        <td>1254</td>
                        <td>Done</td>
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
                        <th scope="col">Name</th>
                        <th scope="col">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="j in 100">
                        <th>{{ j }}</th>
                        <td>4568753</td>
                        <td>Vũ kiếm</td>
                        <td>Failed</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AddMember"
    }
</script>

<style scoped>
    .tb-list {
        max-height: 80vh;
        overflow: auto
    }
</style>
