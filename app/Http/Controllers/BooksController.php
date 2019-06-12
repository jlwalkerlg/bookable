<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BooksController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit');
        $offset = $request->get('offset');

        $books = DB::table('books');

        if ($limit) {
            $books->limit($limit);
        }

        if ($offset) {
            $books->offset($offset);
        }

        $books = $books->join('authors', 'books.author_id', '=', 'authors.id')->select('books.*', 'authors.name as author')->orderBy('books.id')->get();

        $total = DB::table('books')->count();

        return compact('books', 'total');
    }
}
