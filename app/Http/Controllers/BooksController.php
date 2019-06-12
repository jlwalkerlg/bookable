<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BooksController extends Controller
{
    private $orderColumnMap = [
        'ratings' => 'books.ratings_count',
        'avgrating' => 'books.ratings_sum/books.ratings_count',
        'price' => 'books.price'
    ];

    private $orderDirections = ['DESC', 'ASC'];

    public function index(Request $request)
    {
        $limit = $request->get('limit');
        $offset = $request->get('offset');
        $orderBy = $request->get('order_by');

        $query = DB::table('books');

        if ($limit) {
            $query->limit($limit);
        }

        if ($offset) {
            $query->offset($offset);
        }

        if ($orderBy) {
            [$column, $direction] = explode('_', $orderBy);
            $column = $this->orderColumnMap[$column] ?? 'books.id';
            $direction = in_array(strtoupper($direction), $this->orderDirections) ? $direction : 'DESC';
            $query->orderBy($column, $direction);
        }

        $books = $query->join('authors', 'books.author_id', '=', 'authors.id')->select('books.*', 'authors.name as author')->orderBy('books.id')->get();

        $count = count($books);

        return compact('books', 'count');
    }
}
