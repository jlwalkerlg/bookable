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

        if ($minPrice = $request->input('min_price')) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice = $request->input('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        if ($minDate = $request->input('min_date')) {
            $minDate = unixtojd((new \DateTime($minDate))->getTimestamp());
            $query->where('publication_date', '>=', $minDate);
        }

        if ($maxDate = $request->input('max_date')) {
            $maxDate = unixtojd((new \DateTime($maxDate))->getTimestamp());
            $query->where('publication_date', '<=', $maxDate);
        }

        if ($minRating = $request->input('min_rating')) {
            $col = DB::raw('ratings_sum/ratings_count');
            $query->where($col, '>=', $minRating);
        }

        if ($maxRating = $request->input('max_rating')) {
            $col = DB::raw('ratings_sum/ratings_count');
            $query->where($col, '<=', $maxRating);
        }

        if ($publisher = $request->input('publisher')) {
            $query->where('publisher', $publisher);
        }

        if ($authorId = $request->input('author_id')) {
            $query->where('author_id', $authorId);
        }

        if ($categoryId = $request->input('category_id')) {
            $query->join('category_book', 'books.id', '=', 'category_book.book_id')->where('category_book.category_id', $categoryId);
        }

        if ($categoryIds = $request->input('category_ids')) {
            $query->join('category_book', 'books.id', '=', 'category_book.book_id')->whereIn('category_book.category_id', explode(',', $categoryIds));
        }

        $count = $request->has('count') ? (clone $query)->count() : null;

        if ($limit = $request->input('limit')) {
            $query->limit($limit);
        }

        if ($offset = $request->input('offset')) {
            $query->offset($offset);
        }

        if ($orderBy = $request->input('order_by')) {
            if ($column = $this->getOrderByColumn($orderBy)) {
                $direction = $this->getOrderByDirection($request->input('order_dir'));
                $query->orderBy($column, $direction);
            }
        }

        if ($with = $request->input('with')) {
            $query->with(explode(',', $with));
        }

        $books = $query->get();

        return !is_null($count) ? compact('books', 'count') : compact('books');
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

    /**
     * Get all books from carts in which the book in question was purchased.
     * If less books are returned than requested, include some books from the same category.
     */
    public function similarBooks(Request $request, $bookId)
    {
        $query = Book::select('books.*')
            ->join('cart_items', 'cart_items.book_id', '=', 'books.id')
            ->whereIn('cart_items.cart_id', function ($query) use ($bookId) {
                $query->select('cart_id')->from('cart_items')->where('book_id', $bookId)->groupBy('cart_id');
            })->where('books.id', '!=', $bookId);

        if ($limit = $request->input('limit')) {
            $query->limit($limit);
        }

        if ($offset = $request->input('offset')) {
            $query->offset($offset);
        }

        if ($orderBy = $request->input('order_by')) {
            if ($column = $this->getOrderByColumn($orderBy)) {
                $direction = $this->getOrderByDirection($request->input('order_dir'));
                $query->orderBy($column, $direction);
            }
        }

        if ($with = $request->input('with')) {
            $query->with(explode(',', $with));
        }

        $books = $query->get();

        $remaining = $limit - $books->count();

        if ($remaining > 0) {
            $bookIds = $books->map(function ($book) {
                return $book->id;
            })->push($bookId);

            $remainingBooks = Book::select('books.*')
                ->join('category_book', 'category_book.book_id', '=', 'books.id')
                ->whereIn('category_book.category_id', function ($query) use ($bookId) {
                    $query->select('categories.id')->from('categories')->join('category_book', 'category_book.category_id', '=', 'categories.id')->where('category_book.book_id', $bookId);
                })
                ->whereNotIn('books.id', $bookIds)
                ->limit($remaining)
                ->get();

            $books = $books->merge($remainingBooks);
        }

        return $books;
    }
}
