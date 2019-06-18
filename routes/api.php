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

Route::post('/wishlist-items', 'WishlistItemsController@store')->middleware('auth');
Route::delete('/wishlist-items/{item}', 'WishlistItemsController@delete')->middleware('can:delete,item');

Route::post('/carts/{cart}/cart-items', 'CartItemsController@store')->middleware('can:update,cart');
Route::delete('/carts/{cart}/cart-items/{item}', 'CartItemsController@delete')->middleware('can:delete,item,cart');

Route::get('/shelves', 'ShelvesController@index');
Route::get('/shelves/shelf-items', 'ShelfItemsController@index');
Route::get('/shelves/book/{bookId}', 'ShelvesController@book');
Route::get('/shelves/{shelf}/shelf-items', 'ShelfItemsController@index');
Route::post('/shelves/{shelf}/shelf-items', 'ShelfItemsController@store')->middleware('can:update,shelf');
Route::delete('/shelves/{shelf}/shelf-items/{item}', 'ShelfItemsController@delete')->middleware('can:delete,item,shelf');
Route::get('/shelf-items', 'ShelfItemsController@index');
