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
Route::post('/logout', 'ApiAuthController@logout');
Route::post('/register', 'ApiAuthController@register');

Route::get('/user', 'UsersController@auth')->middleware('auth');
Route::delete('/users/{user}', 'UsersController@destroy')->middleware('can:delete,user');
Route::patch('/users/{user}', 'UsersController@update')->middleware('can:update,user');

Route::get('/books', 'BooksController@index');
Route::get('/books/{book}', 'BooksController@show');

Route::get('/authors/{author}', 'AuthorsController@show');

Route::get('/wishlists/{wishlist}/items', 'WishlistItemsController@index')->middleware('can:view,wishlist');
Route::post('/wishlists/{wishlist}/items', 'WishlistItemsController@store')->middleware('can:update,wishlist');
Route::delete('/wishlists/{wishlist}/items/{item}', 'WishlistItemsController@destroy')->middleware('can:delete,item,wishlist');

Route::get('/shelves', 'ShelvesController@index');

Route::get('/carts/{cart}/items', 'CartItemsController@index')->middleware('can:view,cart');
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

Route::get('/quotes', 'QuotesController@index');

Route::get('/users/{user}/quotes', 'UsersController@quotes');
Route::delete('/user-quotes/{userQuote}', 'UserQuotesController@delete')->middleware('can:delete,userQuote');
Route::post('/users/{user}/quotes', 'UserQuotesController@store')->middleware('can:update,user');

Route::get('/users/{user}', 'UsersController@show');

Route::get('/reviews', 'ReviewsController@index');
Route::get('/reviews/{review}', 'ReviewsController@show');
Route::get('/users/{user}/reviews', 'UsersController@reviews');
Route::post('/users/{user}/reviews', 'ReviewsController@store')->middleware('can:update,user');
Route::delete('/reviews/{review}', 'ReviewsController@destroy')->middleware('can:update,review');
Route::patch('/reviews/{review}', 'ReviewsController@update')->middleware('can:update,review');

Route::post('/checkout/confirm', 'CheckoutController@confirm')->middleware('auth');

Route::post('/users/{user}/avatar', 'UsersController@updateAvatar')->middleware('can:update,user');
Route::delete('/users/{user}/avatar', 'UsersController@deleteAvatar')->middleware('can:update,user');

Route::get('/users/{user}/transactions', 'UsersController@transactions')->middleware('can:update,user');

Route::post('/passwords/reset', 'UsersController@emailPasswordReset');
Route::post('/passwords/reset/{token}', 'UsersController@resetPassword');
