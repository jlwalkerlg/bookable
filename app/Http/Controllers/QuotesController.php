<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Quote;

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

        if ($userId = $request->input('user_id')) {
            $query->join('user_quote', 'user_quote.quote_id', '=', 'quotes.id')->select('quotes.*')->where('user_quote.user_id', $userId);
        }

        if ($quoteIds = $request->input('quote_ids')) {
            $query->whereIn('quotes.id', explode(',', $quoteIds));
        }

        if ($categoryId = $request->input('category_id')) {
            $query->join('category_quote', 'quotes.id', '=', 'category_quote.quote_id')->where('category_id', $categoryId);
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

        return !is_null($count) ? compact('quotes', 'count') : compact('quotes');
    }
}
