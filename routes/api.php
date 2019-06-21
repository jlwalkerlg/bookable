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

Route::get('/user', 'UsersController@auth')->middleware('auth');

Route::get('/books', 'BooksController@index');
Route::get('/books/{book}', 'BooksController@show');

Route::get('/authors/{author}', 'AuthorsController@show');

Route::get('/wishlists/{wishlist}/items', 'WishlistItemsController@index');
Route::post('/wishlists/{wishlist}/items', 'WishlistItemsController@store')->middleware('can:update,wishlist');
Route::delete('/wishlists/{wishlist}/items/{item}', 'WishlistItemsController@destroy')->middleware('can:delete,item,wishlist');

Route::get('/shelves', 'ShelvesController@index');

Route::get('/carts/{cart}/items', 'CartItemsController@index');
Route::post('/carts/{cart}/items', 'CartItemsController@store')->middleware('can:update,cart');
Route::delete('/carts/{cart}/items/{item}', 'CartItemsController@destroy')->middleware('can:delete,item,cart');

Route::get('/users/{user}/ratings', 'UsersController@ratings');
Route::get('/ratings', 'RatingsController@index');
Route::post('/users/{user}/ratings', 'RatingsController@store')->middleware('can:update,user');
Route::delete('/ratings/{rating}', 'RatingsController@destroy')->middleware('can:update,rating');
Route::patch('/ratings/{rating}', 'RatingsController@update')->middleware('can:update,rating');

Route::get('/users/{user}/shelves', 'UsersController@shelves');
Route::get('/users/{user}/shelves/items', 'UsersController@shelfItems');
Route::get('/users/{user}/shelves/{shelf}/items', 'UsersController@shelfItems');

Route::get('/shelves/items', 'ShelfItemsController@index');
Route::post('/shelves/{shelf}/items', 'ShelfItemsController@store')->middleware('can:update,shelf');
Route::delete('/shelves/items/{item}', 'ShelfItemsController@delete')->middleware('can:delete,item');

Route::get('/categories', 'CategoryController@index');
Route::get('/categories/{category}', 'CategoryController@show');
