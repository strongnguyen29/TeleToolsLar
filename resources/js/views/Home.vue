<template>
    <div>
        <div class="row">
            <div class="col-12">
                <h3>List account</h3>
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
                    <tr v-for="i in 20">
                        <th>{{ i }}</th>
                        <td>+845698752</td>
                        <td>Cuong Nguyen</td>
                        <td>@mrcuong</td>
                        <td><button class="btn btn-sm btn-primary">Logout</button></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style scoped>

</style>
