<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BooksController extends Controller
{
    private $orderColumnMap = [
        'ratings' => 'books.ratings_count',
        'avgrating' => 'avg_rating'
    ];

    private $orderDirections = ['DESC', 'ASC'];

    private $select = ['books.*', 'authors.name as author'];

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
            if ($column === 'avg_rating') {
                $this->select[] = DB::raw('books.ratings_sum/books.ratings_count as avg_rating');
            }
            $direction = in_array(strtoupper($direction), $this->orderDirections) ? $direction : 'DESC';
            $query->orderBy($column, $direction);
        }

        $books = $query->join('authors', 'books.author_id', '=', 'authors.id')->select(...$this->select)->orderBy('books.id')->get();

        $count = count($books);

        return compact('books', 'count');
    }
}
