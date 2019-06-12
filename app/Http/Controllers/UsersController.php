<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $wishlist = DB::table('wishlist_books')->join('books', 'wishlist_books.book_id', '=', 'books.id')->join('authors', 'books.author_id', '=', 'authors.id')->where('wishlist_books.user_id', $user->id)->select('books.*', 'authors.name as author')->get();

        $user->wishlist = $wishlist;

        return $user;
    }
}
