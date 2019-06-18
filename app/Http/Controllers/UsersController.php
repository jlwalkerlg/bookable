<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->load('wishlist.items.book.author', 'cart.items.book.author');
    }

    public function shelves(User $user)
    {
        return $user->shelves;
    }

    public function shelfItems(Request $request, User $user, $shelfId = null)
    {
        $query = $shelfId ? $user->shelfItems()->where('shelf_id', $shelfId) : $user->shelfItems();

        $count = (clone $query)->count();

        if ($limit = $request->input('limit')) {
            $query->limit($limit);
        }

        if ($offset = $request->input('offset')) {
            $query->offset($offset);
        }

        $shelfItems = $query->with('book.author')->get();

        return compact('shelfItems', 'count');
    }
}
