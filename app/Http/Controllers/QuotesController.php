<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Quote;
use Illuminate\Support\Facades\DB;

class QuotesController extends Controller
{
    public function index(Request $request)
    {
        $query = Quote::query();

        if ($bookId = $request->input('book_id')) {
            $query->where('book_id', $bookId);
        }

        if ($authorId = $request->input('author_id')) {
            $query->where('author_id', $authorId);
        }

        $count = $request->has('count') ? (clone $query)->count() : null;

        if ($limit = $request->input('limit')) {
            $query->limit($limit);
        }

        if ($offset = $request->input('offset')) {
            $query->offset($offset);
        }

        if ($with = $request->input('with')) {
            $query->with(explode(',', $with));
        }

        $quotes = $query->get();

        return $count ? compact('quotes', 'count') : compact('quotes');
    }
}
