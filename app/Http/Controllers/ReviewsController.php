<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Review;
use App\User;

class ReviewsController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::query();

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        if ($bookId = $request->input('book_id')) {
            $query->where('book_id', $bookId);
        }

        if ($bookIds = $request->input('book_ids')) {
            $query->whereIn('book_id', explode(',', $bookIds));
        }

        $count = $request->has('count') ? (clone $query)->count() : null;

        if ($limit = $request->input('limit')) {
            $query->limit($limit);
        }

        if ($offset = $request->input('offset')) {
            $query->offset($offset);
        }

        if ($with = $request->input('with')) {
            $query->with(explode(',', $with));
        }

        $reviews = $query->get();

        return !is_null($count) ? compact('reviews', 'count') : compact('reviews');
    }

    public function store(Request $request, User $user)
    {
        $attributes = $request->validate([
            'review' => 'required|string|min:50|max:65535',
            'book_id' => 'required|int'
        ]);

        $review = $user->reviews()->create($attributes);

        if ($with = $request->input('with')) {
            $review->load(explode(',', $with));
        }

        return $review;
    }

    public function update(Request $request, Review $review)
    {
        $attributes = $request->validate([
            'review' => 'required|string|min:50|max:65535'
        ]);

        $review->update($attributes);

        return $review;
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return response(null, 204);
    }

    public function show(Request $request, Review $review)
    {
        if ($with = $request->input('with')) {
            $review->load(explode(',', $with));
        }

        return $review;
    }
}
