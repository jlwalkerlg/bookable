<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Shelf;
use App\ShelfItem;

class ShelfItemsController extends Controller
{
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
