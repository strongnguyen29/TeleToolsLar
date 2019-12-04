<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Telegram api</title>
    <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}" media="all">
</head>
<body>
<div id="app">
    <app></app>
</div>
<script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
</body>
</html>
