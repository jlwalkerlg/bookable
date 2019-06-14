<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;
use Illuminate\Support\Facades\DB;

class BooksController extends Controller
{
    /**
     * Mapping from requested columns to actual columns in database.
     *
     * @var array $orderByColumnMap
     */
    private $orderByColumnMap = [
        'ratings' => 'books.ratings_count',
        'avgrating' => 'avg_rating',
        'price' => 'books.price',
        'date' => 'books.publication_date',
    ];

    /**
     * Fetch books from database according to request.
     * @return array
     */
    public function index(Request $request)
    {
        $limit = $request->get('limit');
        $offset = $request->get('offset');
        $orderBy = $request->get('order_by');
        $minPrice = $request->get('min_price');
        $maxPrice = $request->get('max_price');
        $minDate = $request->get('min_date');
        $maxDate = $request->get('max_date');
        $minRating = $request->get('min_rating');
        $maxRating = $request->get('max_rating');

        $booksQuery = Book::select('books.*', DB::raw('books.ratings_sum/books.ratings_count as avg_rating'));

        if ($minPrice) {
            $booksQuery->where('books.price', '>=', $minPrice);
        }

        if ($maxPrice) {
            $booksQuery->where('books.price', '<=', $maxPrice);
        }

        if ($minDate) {
            $minDate = unixtojd((new \DateTime($minDate))->getTimestamp());
            $booksQuery->where('books.publication_date', '>=', $minDate);
        }

        if ($maxDate) {
            $maxDate = unixtojd((new \DateTime($maxDate))->getTimestamp());
            $booksQuery->where('books.publication_date', '<=', $maxDate);
        }

        $countQuery = (clone $booksQuery);

        if ($minRating) {
            $countQuery->where(DB::raw('books.ratings_sum/books.ratings_count'), '>=', $minRating);
            $booksQuery->having('avg_rating', '>=', $minRating);
        }

        if ($maxRating) {
            $countQuery->where(DB::raw('books.ratings_sum/books.ratings_count'), '<=', $maxRating);
            $booksQuery->having('avg_rating', '<=', $maxRating);
        }

        $count = $countQuery->count();

        if ($limit) {
            $booksQuery->limit($limit);
        }

        if ($offset) {
            $booksQuery->offset($offset);
        }

        if ($orderBy) {
            [$column, $direction] = explode('_', $orderBy);
            $column = $this->getOrderByColumn($column);
            $booksQuery->orderBy($column, $direction);
        }

        $books = $booksQuery->with('author:id,name')->get();

        return compact('books', 'count');
    }

    /**
     * Get column appropriate to requested column.
     * @return string
     */
    private function getOrderByColumn($column)
    {
        return $this->orderByColumnMap[$column] ?? $column;
    }

    /**
     * Return data about a specific book.
     * @return array
     */
    public function show($id)
    {
        return Book::where('id', $id)->with('author.books')->first();
    }
}
