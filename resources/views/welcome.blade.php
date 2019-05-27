<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, width=device-width">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Bookable</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script src="{{ asset('js/index.js') }}"></script>
  </body>
</html>
