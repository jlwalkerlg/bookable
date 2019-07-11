<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\UserQuote;
use App\User;

class UserQuotesController extends Controller
{
    public function store(Request $request, User $user)
    {
        $attributes = $request->validate([
            'quote_id' => 'required|int'
        ]);
        $attributes['user_id'] = $user->id;

        $userQuote = UserQuote::create($attributes);

        if ($with = $request->input('with')) {
            $userQuote->load(explode(',', $with));
        }

        return $userQuote;
    }

    public function delete(Request $request, User $user)
    {
        $request->validate([
            'quote_id' => 'required|int'
        ]);

        $user->quotes()->where('quote_id', $request->quote_id)->limit(1)->delete();
        return response(null, 204);
    }
}
