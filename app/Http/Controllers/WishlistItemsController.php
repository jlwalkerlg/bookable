<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;

class WishlistItemsController extends Controller
{
    public function store(Request $request)
    {
        $book = Book::findOrFail($request->get('book_id'));
        return $request->user()->addToWishlist($book);
    }
}
