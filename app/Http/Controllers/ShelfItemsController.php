<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Shelf;
use App\ShelfItem;
use App\User;

class ShelfItemsController extends Controller
{
    public function index(Request $request, User $user, $shelfId = null)
    {
        $query = $shelfId ? $user->shelfItems()->where('shelf_id', $shelfId) : $user->shelfItems();

        $count = (clone $query)->count();

        if ($limit = $request->input('limit')) {
            $query->limit($limit);
        }

        if ($offset = $request->input('offset')) {
            $query->offset($offset);
        }

        $shelfItems = $query->with('book.author')->get();

        return compact('shelfItems', 'count');
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
