<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Review;

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

        return Review::create($attributes)->load('user:id,name');
    }

    public function update(Request $request, Review $review)
    {
        $attributes = $request->validate([
            'review' => 'string|max:20000',
            'rating' => 'required|int|min:1|max:5',
        ]);

        $review->fill($attributes)->save();

        return $review;
    }
}
