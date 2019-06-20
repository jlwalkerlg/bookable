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
        $query = Book::select('books.*');

        if ($minPrice = $request->get('min_price')) {
            $query->where('books.price', '>=', $minPrice);
        }

        if ($maxPrice = $request->get('max_price')) {
            $query->where('books.price', '<=', $maxPrice);
        }

        if ($minDate = $request->get('min_date')) {
            $minDate = unixtojd((new \DateTime($minDate))->getTimestamp());
            $query->where('books.publication_date', '>=', $minDate);
        }

        if ($maxDate = $request->get('max_date')) {
            $maxDate = unixtojd((new \DateTime($maxDate))->getTimestamp());
            $query->where('books.publication_date', '<=', $maxDate);
        }

        if ($minRating = $request->get('min_rating')) {
            $col = DB::raw('books.ratings_sum/books.ratings_count');
            $query->where($col, '>=', $minRating);
        }

        if ($maxRating = $request->get('max_rating')) {
            $col = DB::raw('books.ratings_sum/books.ratings_count');
            $query->where($col, '<=', $maxRating);
        }

        if ($publisher = $request->get('publisher')) {
            $query->where('publisher', $publisher);
        }

        $count = (clone $query)->count();

        if ($limit = $request->get('limit')) {
            $query->limit($limit);
        }

        if ($offset = $request->get('offset')) {
            $query->offset($offset);
        }

        if ($orderBy = $request->get('order_by')) {
            [$column, $direction] = explode('_', $orderBy);
            $column = $this->getOrderByColumn($column);
            $query->orderBy($column, $direction);
        }

        $books = $query->with('author:id,name')->get();

        return compact('books', 'count');
    }

    /**
     * Get column appropriate to requested column.
     * @return string
     */
    private function getOrderByColumn($column)
    {
        $columnMap = [
            'ratings' => 'books.ratings_count',
            'price' => 'books.price',
            'date' => 'books.publication_date',
            'avgrating' => DB::raw('books.ratings_sum/books.ratings_count'),
            'random' => DB::raw('RAND()')
        ];

        return $columnMap[$column] ?? $column;
    }

    /**
     * Return data about a specific book.
     * @return array
     */
    public function show(Book $book)
    {
        return $book->load('author.books');
    }
}
