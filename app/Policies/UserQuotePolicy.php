<?php

namespace App\Policies;

use App\User;
use App\UserQuote;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserQuotePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the user quote.
     *
     * @param  \App\User  $user
     * @param  \App\UserQuote  $userQuote
     * @return mixed
     */
    public function view(User $user, UserQuote $userQuote)
    {
        //
    }

    /**
     * Determine whether the user can create user quotes.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the user quote.
     *
     * @param  \App\User  $user
     * @param  \App\UserQuote  $userQuote
     * @return mixed
     */
    public function update(User $user, UserQuote $userQuote)
    {
        //
    }

    /**
     * Determine whether the user can delete the user quote.
     *
     * @param  \App\User  $user
     * @param  \App\UserQuote  $userQuote
     * @return mixed
     */
    public function delete(User $user, UserQuote $userQuote)
    {
        return $user->id === $userQuote->user_id;
    }

    /**
     * Determine whether the user can restore the user quote.
     *
     * @param  \App\User  $user
     * @param  \App\UserQuote  $userQuote
     * @return mixed
     */
    public function restore(User $user, UserQuote $userQuote)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the user quote.
     *
     * @param  \App\User  $user
     * @param  \App\UserQuote  $userQuote
     * @return mixed
     */
    public function forceDelete(User $user, UserQuote $userQuote)
    {
        //
    }
}
