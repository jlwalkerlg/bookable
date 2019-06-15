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

Route::get('/user', 'UsersController@index')->middleware('auth:api');

Route::get('/books', 'BooksController@index');
Route::get('/books/{id}', 'BooksController@show');

Route::get('/authors/{id}', 'AuthorsController@show');

Route::post('/wishlist', 'WishlistItemsController@store')->middleware('auth:api');
