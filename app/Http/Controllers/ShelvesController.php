<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShelvesController extends Controller
{
    public function index(Request $request, User $user)
    {
        $query = $user->shelves();

        if ($bookId = $request->input('book_id')) {
            $shelfItems = DB::table('shelf_items')->select('shelf_id')->where('book_id', $bookId);
            $query->joinSub($shelfItems, 'shelf_items', function ($join) {
                $join->on('shelves.id', '=', 'shelf_items.shelf_id');
            });
        }

        return $query->get();
    }
}
