<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', 'ApiAuthController@login')->name('login');
Route::post('/logout', 'ApiAuthController@logout')->middleware('auth:api');
Route::post('/register', 'ApiAuthController@register');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::get('/books', function () {
    return [
        [
            'title' => 'Bloodborne'
        ],
        [
            'title' => 'Sekiro'
        ],
        [
            'title' => 'Dark Souls 3'
        ],
        [
            'title' => 'Biomutant'
        ],
        [
            'title' => 'God of War 3'
        ],
    ];
});
