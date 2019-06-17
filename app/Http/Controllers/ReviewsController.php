<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Review;
use Illuminate\Support\Facades\DB;
use App\Book;

class ReviewsController extends Controller
{
    public function store(Request $request)
    {
        $attributes = $request->validate([
            'review' => 'required|string|max:20000',
            'rating' => 'required|int|min:1|max:5',
            'book_id' => 'required|int',
        ]);

        $attributes['user_id'] = $request->user()->id;

        $review = (new Review)->fill($attributes);

        DB::transaction(function () use ($request, $review, $attributes) {
            $book = Book::findOrFail($attributes['book_id']);
            $book->addReview($review);
            $request->user()->shelves()->where('name', 'Read')->first()->addItem($request);
            $review->save();
        });

        return $review->load('user:id,name');
    }

    public function update(Request $request, Review $review)
    {
        $attributes = $request->validate([
            'review' => 'string|max:20000',
            'rating' => 'required|int|min:1|max:5',
        ]);

        DB::transaction(function () use ($review, $attributes) {
            $review->book->updateReview($review, $attributes['rating']);
            $review->fill($attributes)->save();
        });

        return $review->load('user:id,name');
    }
}
