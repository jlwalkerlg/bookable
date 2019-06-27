<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Shelf;

class UsersController extends Controller
{
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
        return $user->only(['id', 'name']);
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

        return $count ? compact('user', 'ratings', 'count') : compact('user', 'ratings');
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

        return $count ? compact('user', 'reviews', 'count') : compact('user', 'reviews');
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

        return $count ? compact('user', 'items', 'count') : compact('user', 'items');
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

        return $count ? compact('user', 'quotes', 'count') : compact('user', 'quotes');
    }
}
