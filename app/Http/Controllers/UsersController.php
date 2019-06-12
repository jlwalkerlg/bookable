<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $wishlist = DB::table('wishlist_items')->join('books', 'wishlist_items.book_id', '=', 'books.id')->join('authors', 'books.author_id', '=', 'authors.id')->where('wishlist_items.user_id', $user->id)->select('books.*', 'authors.name as author')->get();

        $cart = DB::table('cart_items')->join('carts', 'cart_items.cart_id', '=', 'carts.id')->join('users', 'carts.id', '=', 'users.id')->join('books', 'cart_items.book_id', '=', 'books.id')->join('authors', 'books.author_id', '=', 'authors.id')->select('books.*', 'authors.name as author', 'cart_items.quantity as quantity')->where('users.id', $user->id)->get();

        $user->wishlist = $wishlist;
        $user->cart = $cart;

        return $user;
    }
}
