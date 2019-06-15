<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;

class WishlistItemsController extends Controller
{
    public function store(Request $request)
    {
        $book = Book::findOrFail($request->get('book_id'));
        $wishlistItem = $request->user()->addToWishlist($book);
        return $wishlistItem->load('book.author');
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
