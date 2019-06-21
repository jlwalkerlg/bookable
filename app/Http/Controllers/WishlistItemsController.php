<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;
use App\Wishlist;
use App\WishlistItem;

class WishlistItemsController extends Controller
{
    public function index(Request $request, Wishlist $wishlist)
    {
        $query = $wishlist->items();

        $count = $request->has('count') ? (clone $query)->count() : null;

        if ($with = $request->input('with')) {
            $query->with(explode(',', $with));
        }

        $items = $query->get();

        return $count ? compact('items', 'count') : compact('items');
    }

    public function store(Request $request, Wishlist $wishlist)
    {
        $attributes = $request->validate([
            'book_id' => 'required|int'
        ]);

        $item = $wishlist->items()->create($attributes);

        if ($with = $request->input('with')) {
            $item->load(explode(',', $with));
        }

        return $item;
    }

    public function destroy(Wishlist $wishlist, WishlistItem $item)
    {
        $item->delete();
        return response(null, 204);
    }
}
