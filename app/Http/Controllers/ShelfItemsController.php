<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Shelf;
use App\ShelfItem;

class ShelfItemsController extends Controller
{
    public function index(Request $request, Shelf $shelf = null)
    {
        $shelfItems = $shelf ? $shelf->shelfItems() : $request->user()->shelfItems();
        $count = (clone $shelfItems)->count();

        if ($limit = $request->input('limit')) {
            $shelfItems->limit($limit);
        }

        if ($offset = $request->input('offset')) {
            $shelfItems->offset($offset);
        }

        $shelfItems = $shelfItems->with('book.author')->get();

        return compact('shelfItems', 'count');
    }

    public function store(Request $request, Shelf $shelf)
    {
        return $shelf->addItem($request)->load('book.author');
    }

    public function delete(Shelf $shelf, ShelfItem $item)
    {
        $item->delete();
        return response(null, 204);
    }
}
