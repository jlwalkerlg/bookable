<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Cart;
use App\CartItem;

class CartItemsController extends Controller
{
    public function index(Request $request, Cart $cart)
    {
        $query = $cart->items();

        $count = $request->has('count') ? (clone $query)->count() : null;

        if ($with = $request->input('with')) {
            $query->with(explode(',', $with));
        }

        $items = $query->get();

        return $count ? compact('items', 'count') : compact('items');
    }

    public function store(Request $request, Cart $cart)
    {
        $attributes = $request->validate([
            'quantity' => 'required|int',
            'book_id' => 'required|int'
        ]);

        $item = $cart->items()->create($attributes);

        if ($with = $request->input('with')) {
            $item->load(explode(',', $with));
        }

        return $item;
    }

    public function destroy(Cart $cart, CartItem $item)
    {
        $item->delete();
        return response(null, 204);
    }
}
