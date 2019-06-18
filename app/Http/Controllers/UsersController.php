<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->load('wishlist.items.book.author', 'cart.items.book.author', 'shelves');
    }
}
