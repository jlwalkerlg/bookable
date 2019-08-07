<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Bookable</title>
    <!-- Google Fonts -->
    <link
        href="https://fonts.googleapis.com/css?family=Material+Icons|Lato:300,400,700|Merriweather:300,700&display=swap"
        rel="stylesheet">
    <!-- CSS -->
    <link rel="stylesheet" href="{{ asset('css/app.css', config('app.env') !== 'local') }}">
    {{-- Stripe --}}
    <script src="https://js.stripe.com/v3/"></script>
</head>

<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script src="{{ asset('js/index.js', config('app.env') !== 'local') }}"></script>
</body>

</html>
