<template>
    <div class="container-fluid">
        <!-- Nav -->
        <nav class="navbar navbar-expand navbar-light bg-light fixed-top border-bottom">
            <a class="navbar-brand text-uppercase font-weight-bold text-primary" href="/">Telegram Tools</a>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item" :class="[currentPage.includes('/') ? activeClass : '']">
                        <router-link :to="{ name: 'home' }" class="nav-link">Home</router-link>
                    </li>
                    <li class="nav-item" :class="[currentPage.includes('add-member') ? activeClass : '']">
                        <router-link :to="{ name: 'add-member' }" class="nav-link">Add member</router-link>
                    </li>
                </ul>
            </div>
        </nav><!-- End nav -->
        <div class="main-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: "App",
        data: function () {
            return {
                activeClass: 'active'
            }
        },
        computed: {
            currentPage() {
                console.log('$route.path: ', this.$route.path);
                return this.$route.path;
            }
        }
    }
</script>

<style scoped>
    .main-content {
        margin-top: 59px;
    }
</style>
