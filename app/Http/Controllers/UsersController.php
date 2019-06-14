<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $wishlist = Book::join('wishlist_items', 'books.id', '=', 'wishlist_items.book_id')->where('wishlist_items.user_id', $user->id)->select('books.*')->with('author')->get();

        $cart = Book::join('cart_items', 'books.id', '=', 'cart_items.book_id')->join('carts', 'cart_items.cart_id', '=', 'carts.id')->join('users', 'carts.id', '=', 'users.id')->select('books.*', 'cart_items.quantity as quantity')->where('users.id', $user->id)->with('author')->get();

        return compact('user', 'wishlist', 'cart');
    }
}
