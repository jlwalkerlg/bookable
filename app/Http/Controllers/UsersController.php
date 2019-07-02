<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Shelf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class UsersController extends Controller
{
    public function updateAvatar(Request $request, User $user)
    {
        $request->validate(['avatar' => 'required|image|mimes:jpeg,jpg,png,gif,svg|max:2048']);

        $user = $request->user();

        try {
            DB::beginTransaction();

            // Get old avatar name.
            $oldAvatar = $user->avatar;

            // Get avatar name.
            $avatarName = $user->id . '_avatar' . time() . '.' . $request->avatar->getClientOriginalExtension();

            // Update user in database.
            $user->avatar = $avatarName;
            $user->save();

            // Delete old avatar.
            if ($oldAvatar && Storage::disk('public')->exists('avatars/' . $oldAvatar)) {
                Storage::disk('public')->delete('avatars/' . $oldAvatar);
            }

            // Store avatar image.
            $request->file('avatar')->storeAs('avatars', $avatarName, 'public');

            DB::commit();

            return response($user->avatar, 201);
        } catch (\Throwable $th) {
            DB::rollback();
            throw $th;
        }
    }

    public function deleteAvatar(Request $request, User $user)
    {
        $user = $request->user();

        $original = $user->getOriginal('avatar');

        if (!$original) return response(null, 404);

        try {
            DB::beginTransaction();

            // Update user in database.
            $user->avatar = null;
            $user->save();

            // Delete old avatar.
            if (Storage::disk('public')->exists('avatars/' . $original)) {
                Storage::disk('public')->delete('avatars/' . $original);
            }

            DB::commit();

            return response(null, 204);
        } catch (\Throwable $th) {
            DB::rollback();
            throw $th;
        }
    }

    public function transactions(Request $request, User $user)
    {
        $query = $user->transactions();

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

        $transactions = $query->get();

        return !is_null($count) ? compact('transactions', 'count') : compact('transactions');
    }

    public function auth(Request $request)
    {
        $user = $request->user();

        if ($with = $request->input('with')) {
            $user->load(explode(',', $with));
        }

        return $user;
    }

    public function show(User $user)
    {
        $totalRatings = $user->ratings()->count();
        $totalReviews = $user->reviews()->count();
        return compact('user', 'totalRatings', 'totalReviews');
    }

    public function ratings(Request $request, User $user)
    {
        $query = $user->ratings();

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

        return !is_null($count) ? compact('user', 'ratings', 'count') : compact('user', 'ratings');
    }

    public function reviews(Request $request, User $user)
    {
        $query = $user->reviews();

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

        return !is_null($count) ? compact('user', 'reviews', 'count') : compact('user', 'reviews');
    }

    public function shelves(Request $request, User $user)
    {
        $shelves = $user->shelves;
        return compact('user', 'shelves');
    }

    public function shelfItems(Request $request, User $user, Shelf $shelf = null)
    {
        $query = $user->shelfItems();

        if ($shelf || $shelfId = $request->input('shelf_id')) {
            $shelfId = $shelfId ?? $shelf->id;
            $query->where('shelf_id', $shelfId);
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

        $items = $query->get();

        return !is_null($count) ? compact('user', 'items', 'count') : compact('user', 'items');
    }

    public function quotes(Request $request, User $user)
    {
        $query = $user->quotes();

        if ($quoteIds = $request->input('quote_ids')) {
            $query->whereIn('quote_id', explode(',', $quoteIds));
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

        $quotes = $query->get();

        return !is_null($count) ? compact('user', 'quotes', 'count') : compact('user', 'quotes');
    }
}
