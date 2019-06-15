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
        $limit = $request->get('limit');
        $offset = $request->get('offset');
        $orderBy = $request->get('order_by');
        $minPrice = $request->get('min_price');
        $maxPrice = $request->get('max_price');
        $minDate = $request->get('min_date');
        $maxDate = $request->get('max_date');
        $minRating = $request->get('min_rating');
        $maxRating = $request->get('max_rating');
        $publisher = $request->get('publisher');

        $query = Book::select('books.*');

        if ($minPrice) {
            $query->where('books.price', '>=', $minPrice);
        }

        if ($maxPrice) {
            $query->where('books.price', '<=', $maxPrice);
        }

        if ($minDate) {
            $minDate = unixtojd((new \DateTime($minDate))->getTimestamp());
            $query->where('books.publication_date', '>=', $minDate);
        }

        if ($maxDate) {
            $maxDate = unixtojd((new \DateTime($maxDate))->getTimestamp());
            $query->where('books.publication_date', '<=', $maxDate);
        }

        if ($minRating) {
            $col = DB::raw('books.ratings_sum/books.ratings_count');
            $query->where($col, '>=', $minRating);
        }

        if ($maxRating) {
            $col = DB::raw('books.ratings_sum/books.ratings_count');
            $query->where($col, '<=', $maxRating);
        }

        if ($publisher) {
            $query->where('publisher', $publisher);
        }

        $count = (clone $query)->count();

        if ($limit) {
            $query->limit($limit);
        }

        if ($offset) {
            $query->offset($offset);
        }

        if ($orderBy) {
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
            'random' => DB::RAW('RAND()')
        ];

        return $columnMap[$column] ?? $column;
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
