<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $wishlist = $user->wishlistItems()->with('book.author')->get();

        $cart = Book::join('cart_items', 'books.id', '=', 'cart_items.book_id')->join('carts', 'cart_items.cart_id', '=', 'carts.id')->join('users', 'carts.id', '=', 'users.id')->select('books.*', 'cart_items.quantity as quantity')->where('users.id', $user->id)->with('author')->get();

        return compact('user', 'wishlist', 'cart');
    }
}
