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

    public function delete(User $user, $quoteId)
    {
        $result = UserQuote::where([
            'user_id' => $user->id,
            'quote_id' => $quoteId
        ])->limit(1)->delete();
        return $result ? response(null, 204) : response(null, 404);
    }
}
