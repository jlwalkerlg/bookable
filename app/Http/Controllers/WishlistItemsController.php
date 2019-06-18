<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;
use App\Wishlist;
use App\WishlistItem;

class WishlistItemsController extends Controller
{
    public function store(Request $request, Wishlist $wishlist)
    {
        $book = Book::findOrFail($request->post('book_id'));
        return $wishlist->addBook($book)->load('book.author');
    }

    public function delete(Wishlist $wishlist, WishlistItem $item)
    {
        $item->delete();
        return response(null, 204);
    }
}
