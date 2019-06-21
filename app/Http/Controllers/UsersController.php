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
}
