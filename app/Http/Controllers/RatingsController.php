<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Rating;
use App\User;

class RatingsController extends Controller
{
    public function index(Request $request)
    {
        $query = Rating::query();

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        if ($userIds = $request->input('user_ids')) {
            $query->whereIn('user_id', explode(',', $userIds));
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

        $ratings = $query->get();

        return $count ? compact('ratings', 'count') : compact('ratings');
    }

    public function store(Request $request, User $user)
    {
        $attributes = $request->validate([
            'rating' => 'required|int|min:1|max:5',
            'book_id' => 'required|int'
        ]);

        $rating = $user->ratings()->create($attributes);

        if ($with = $request->input('with')) {
            $rating->load(explode(',', $with));
        }

        return $rating;
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
