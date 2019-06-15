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

    public function delete(Request $request, Book $book)
    {
        $user = $request->user();

        $wishlistItem = $user->wishlistItems()->where('book_id', $book->id)->firstOrFail();

        $this->authorize('delete', $wishlistItem);

        $wishlistItem->delete();

        return response(null, 204);
    }
}
