<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;
use Illuminate\Support\Facades\DB;

class BooksController extends Controller
{
    /**
     * Fetch books from database according to request.
     * @return array
     */
    public function index(Request $request)
    {
        $query = Book::query();

        if ($minPrice = $request->get('min_price')) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice = $request->get('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        if ($minDate = $request->get('min_date')) {
            $minDate = unixtojd((new \DateTime($minDate))->getTimestamp());
            $query->where('publication_date', '>=', $minDate);
        }

        if ($maxDate = $request->get('max_date')) {
            $maxDate = unixtojd((new \DateTime($maxDate))->getTimestamp());
            $query->where('publication_date', '<=', $maxDate);
        }

        if ($minRating = $request->get('min_rating')) {
            $col = DB::raw('ratings_sum/ratings_count');
            $query->where($col, '>=', $minRating);
        }

        if ($maxRating = $request->get('max_rating')) {
            $col = DB::raw('ratings_sum/ratings_count');
            $query->where($col, '<=', $maxRating);
        }

        if ($publisher = $request->get('publisher')) {
            $query->where('publisher', $publisher);
        }

        if ($authorId = $request->get('author_id')) {
            $query->where('author_id', $authorId);
        }

        $count = $request->has('count') ? (clone $query)->count() : null;

        if ($limit = $request->get('limit')) {
            $query->limit($limit);
        }

        if ($offset = $request->get('offset')) {
            $query->offset($offset);
        }

        if ($orderBy = $request->get('order_by')) {
            if ($column = $this->getOrderByColumn($orderBy)) {
                $direction = $this->getOrderByDirection($request->input('order_dir'));
                $query->orderBy($column, $direction);
            }
        }

        if ($with = $request->input('with')) {
            $query->with(explode(',', $with));
        }

        $books = $query->get();

        return $count ? compact('books', 'count') : compact('books');
    }

    /**
     * Get column appropriate to requested column.
     * @return string
     */
    private function getOrderByColumn($column)
    {
        $columns = [
            'ratings_count' => 'ratings_count',
            'price' => 'price',
            'publication_date' => 'publication_date',
            'avg_rating' => DB::raw('ratings_sum/ratings_count'),
            'random' => DB::raw('RAND()')
        ];

        return $columns[$column] ?? null;
    }

    private function getOrderByDirection($direction = null)
    {
        $directions = ['asc', 'desc'];
        $direction = strtolower($direction ?? 'desc');
        return in_array($direction, $directions) ? $direction : 'desc';
    }

    /**
     * Return data about a specific book.
     * @return array
     */
    public function show(Request $request, Book $book)
    {
        if ($with = $request->input('with')) {
            $book->load(explode(',', $with));
        }

        return $book;
    }
}
