<?php

namespace App\Policies;

use App\User;
use App\Wishlist;
use Illuminate\Auth\Access\HandlesAuthorization;

class WishlistPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the wishlist.
     *
     * @param  \App\User  $user
     * @param  \App\Wishlist  $wishlist
     * @return mixed
     */
    public function update(User $user, Wishlist $wishlist)
    {
        return $user->id === $wishlist->user_id;
    }
}
