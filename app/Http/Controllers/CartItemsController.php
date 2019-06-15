<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Cart;

class CartItemsController extends Controller
{
    public function store(Request $request, Cart $cart)
    {
        return $cart->addItem($request)->load('book.author');
    }
}
