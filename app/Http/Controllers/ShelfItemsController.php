<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Shelf;

class ShelfItemsController extends Controller
{
    public function store(Request $request, Shelf $shelf)
    {
        return $shelf->addItem($request)->load('book.author');
    }
}
