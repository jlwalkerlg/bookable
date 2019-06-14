<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $wishlist = Book::join('wishlist_items', 'books.id', '=', 'wishlist_items.book_id')->join('authors', 'books.author_id', '=', 'authors.id')->where('wishlist_items.user_id', $user->id)->select('books.*', 'authors.name as author')->get();

        $cart = Book::join('cart_items', 'books.id', '=', 'cart_items.book_id')->join('carts', 'cart_items.cart_id', '=', 'carts.id')->join('users', 'carts.id', '=', 'users.id')->join('authors', 'books.author_id', '=', 'authors.id')->select('books.*', 'authors.name as author', 'cart_items.quantity as quantity')->where('users.id', $user->id)->get();

        return compact('user', 'wishlist', 'cart');
    }
}
