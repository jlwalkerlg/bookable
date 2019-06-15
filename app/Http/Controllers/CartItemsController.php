<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Cart;
use App\CartItem;

class CartItemsController extends Controller
{
    public function store(Request $request, Cart $cart)
    {
        return $cart->addItem($request)->load('book.author');
    }

    public function delete(Cart $cart, CartItem $item)
    {
        $item->delete();
        return response(null, 204);
    }
}
