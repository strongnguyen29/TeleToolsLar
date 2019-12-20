<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Telegram api</title>
    <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}" media="all">
    <style>
        .form-logout {
            z-index: 9999;
            top: 15px;
            right: 20px;
        }
    </style>
</head>
<body>
<div id="app">
    <app></app>
    <div class="form-logout position-absolute d-inline-flex align-content-center">
        <span>{{ \Illuminate\Support\Facades\Auth::user()->email }}</span><span class="px-2">|</span>
        <a class="text-dark" class="" href="{{ route('logout') }}" onclick="event.preventDefault();document.getElementById('logout-form').submit();">
            {{ __('Logout') }}
        </a>

        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
            @csrf
        </form>
    </div>
</div>
<script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
</body>
</html>
