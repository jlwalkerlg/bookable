<?php

namespace App\Policies;

use App\User;
use App\WishlistItem;
use Illuminate\Auth\Access\HandlesAuthorization;

class WishlistItemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can delete the wishlist item.
     *
     * @param  \App\User  $user
     * @param  \App\WishlistItem  $wishlistItem
     * @return mixed
     */
    public function delete(User $user, WishlistItem $wishlistItem)
    {
        return $user->id === $wishlistItem->user_id;
    }
}
