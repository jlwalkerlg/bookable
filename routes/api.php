<?php

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
Route::post('/logout', 'ApiAuthController@logout')->middleware('auth');
Route::post('/register', 'ApiAuthController@register');

Route::get('/user', 'UsersController@index')->middleware('auth');

Route::get('/books', 'BooksController@index');
Route::get('/books/{book}', 'BooksController@show');

Route::get('/authors/{author}', 'AuthorsController@show');

Route::post('/wishlist/{wishlist}/items', 'WishlistItemsController@store')->middleware('can:update,wishlist');
Route::delete('/wishlist/{wishlist}/items/{item}', 'WishlistItemsController@delete')->middleware('can:delete,item,wishlist');

Route::post('/carts/{cart}/items', 'CartItemsController@store')->middleware('can:update,cart');
Route::delete('/carts/{cart}/items/{item}', 'CartItemsController@delete')->middleware('can:delete,item,cart');

Route::get('/users/{user}/shelves', 'ShelvesController@index');
Route::get('/users/{user}/shelves/items', 'ShelfItemsController@index');
Route::get('/users/{user}/shelves/{shelf}/items', 'ShelfItemsController@index');
Route::post('/shelves/{shelf}/items', 'ShelfItemsController@store')->middleware('can:update,shelf');
Route::delete('/shelves/{shelf}/items/{item}', 'ShelfItemsController@delete')->middleware('can:delete,item,shelf');
Route::delete('/shelves/{shelf}/items', 'ShelfItemsController@delete')->middleware('can:update,shelf');

Route::get('/users/{user}/ratings', 'RatingsController@index');
Route::get('/ratings', 'RatingsController@index');
Route::post('/users/{user}/ratings', 'RatingsController@store')->middleware('can:update,user');
Route::patch('/ratings/{rating}', 'RatingsController@update')->middleware('can:update,rating');
Route::delete('/ratings/{rating}', 'RatingsController@destroy')->middleware('can:update,rating');
