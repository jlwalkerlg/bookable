<?php

namespace App\Policies;

use App\User;
use App\Cart;
use Illuminate\Auth\Access\HandlesAuthorization;

class CartPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the wishlist.
     *
     * @param  \App\User  $user
     * @param  \App\Wishlist  $wishlist
     * @return mixed
     */
    public function view(User $user, Cart $cart)
    {
        return $user->id === $cart->user_id;
    }

    /**
     * Determine whether the user can update the cart.
     *
     * @param  \App\User  $user
     * @param  \App\Cart  $cart
     * @return mixed
     */
    public function update(User $user, Cart $cart)
    {
        return $user->id === $cart->user_id;
    }
}
