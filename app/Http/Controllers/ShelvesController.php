<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Shelf;

class ShelvesController extends Controller
{
    public function index(Request $request)
    {
        $query = Shelf::query();

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        if ($bookId = $request->input('book_id')) {
            $shelfItems = DB::table('shelf_items')->select('shelf_id')->where('book_id', $bookId);
            $query->joinSub($shelfItems, 'shelf_items', function ($join) {
                $join->on('shelves.id', '=', 'shelf_items.shelf_id');
            });
        }

        if ($with = $request->input('with')) {
            $query->with(explode(',', $with));
        }

        $shelves = $query->get();

        return compact('shelves');
    }
}
