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

        $quote = $user->quotes()->create($attributes);

        if ($with = $request->input('with')) {
            $quote->load(explode(',', $with));
        }

        return $quote;
    }

    public function delete(UserQuote $userQuote)
    {
        $userQuote->delete();
        return response(null, 204);
    }
}
