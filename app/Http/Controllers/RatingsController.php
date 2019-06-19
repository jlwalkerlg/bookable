<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Rating;
use App\User;

class RatingsController extends Controller
{
    public function index(Request $request, User $user = null)
    {
        $query = $user ? $user->ratings() : Rating::query();

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        if ($bookId = $request->input('book_id')) {
            $query->where('book_id', $bookId);
        }

        if ($bookIds = $request->input('book_ids')) {
            $query->whereIn('book_id', explode(',', $bookIds));
        }

        $count = (clone $query)->count();

        if ($limit = $request->input('limit')) {
            $query->limit($limit);
        }

        if ($offset = $request->input('offset')) {
            $query->offset($offset);
        }

        if ($with = $request->input('with')) {
            $query->with(...explode(',', $with));
        }

        $ratings = $query->get();
        $user = $user ? $user->only('id', 'name') : null;

        return $user ? compact('user', 'ratings', 'count') : compact('ratings', 'count');
    }

    public function store(Request $request, User $user)
    {
        return $user->ratings()->create($request->only('rating', 'book_id'));
    }

    public function update(Request $request, Rating $rating)
    {
        $attributes = $request->validate([
            'rating' => 'required|int|min:1|max:5'
        ]);

        $rating->update($attributes);

        return $rating;
    }

    public function destroy(Rating $rating)
    {
        $rating->delete();
        return response(null, 204);
    }
}
