<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $wishlist = $user->wishlistItems()->with('book.author')->get();
        $cart = $user->cartItems()->with('book.author')->get();
        return compact('user', 'wishlist', 'cart');
    }
}
