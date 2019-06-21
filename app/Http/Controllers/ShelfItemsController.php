<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Shelf;
use App\ShelfItem;

class ShelfItemsController extends Controller
{
    public function index(Request $request)
    {
        $query = ShelfItem::query();

        if ($shelfId = $request->input('shelf_id')) {
            $query->where('shelf_id', $shelfId);
        }

        if ($bookId = $request->input('book_id')) {
            $query->where('book_id', $bookId);
        }

        if ($userId = $request->input('user_id')) {
            $query->join('shelves', 'shelf_items.shelf_id', '=', 'shelves.id')->where('shelves.user_id', $userId)->select('shelf_items.*');
        }

        $count = $request->has('count') ? (clone $query)->count() : null;

        if ($limit = $request->input('limit')) {
            $query->limit($limit);
        }

        if ($offset = $request->input('offset')) {
            $query->offset($offset);
        }

        if ($with = $request->input('with')) {
            $query->with(explode(',', $with));
        }

        $items = $query->get();

        return $count ? compact('items', 'count') : compact('items');
    }

    public function store(Request $request, Shelf $shelf)
    {
        $attributes = $request->validate([
            'book_id' => 'required|int'
        ]);

        $item = $shelf->items()->create($attributes);

        if ($with = $request->input('with')) {
            $item->load(explode(',', $with));
        }

        return $item;
    }

    public function delete(Request $request, ShelfItem $item)
    {
        $item->delete();
        return response(null, 204);
    }
}
