<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Telegram api</title>
    <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}" media="all">
    <style>

    </style>
</head>
<body>
<div id="app" class="container-fluid">

    <telegram-component></telegram-component>

</div>
<script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
</body>
</html>
