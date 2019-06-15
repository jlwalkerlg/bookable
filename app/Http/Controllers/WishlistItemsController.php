<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;
use App\WishlistItem;

class WishlistItemsController extends Controller
{
    public function store(Request $request)
    {
        $book = Book::findOrFail($request->get('book_id'));
        $wishlistItem = $request->user()->addToWishlist($book);
        return $wishlistItem->load('book.author');
    }

    public function delete(WishlistItem $item)
    {
        $item->delete();
        return response(null, 204);
    }
}
