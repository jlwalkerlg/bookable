<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
        'avgrating' => 'books.avg_rating'
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

        $query = DB::table('books')->join('authors', 'books.author_id', '=', 'authors.id')->select('books.*', 'authors.name as author');

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

        $books = $query->get();
        $count = count($books);

        return compact('books', 'count');
    }

    /**
     * Get column appropriate to requested column.
     * @return string
     */
    private function getOrderByColumn($column)
    {
        $column = $this->orderByColumnMap[$column] ?? $column;
        return $column === 'books.avg_rating' ? DB::raw('books.ratings_sum/books.ratings_count') : $column;
    }
}
