<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $wishlist = $user->wishlistItems()->with('book.author')->get();
        $cart = $user->cart()->with('cartItems.book.author')->latest()->first();
        return compact('user', 'wishlist', 'cart');
    }
}
