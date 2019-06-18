<?php

namespace App\Policies;

use App\User;
use App\WishlistItem;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Wishlist;

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
    public function delete(User $user, WishlistItem $item, Wishlist $wishlist)
    {
        return $user->id === $wishlist->user_id && $wishlist->id === $item->wishlist_id;
    }
}
