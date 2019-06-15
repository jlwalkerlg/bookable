<?php

namespace App\Policies;

use App\User;
use App\CartItem;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Cart;

class CartItemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can delete the cart item.
     *
     * @param  \App\User  $user
     * @param  \App\CartItem  $cartItem
     * @return mixed
     */
    public function delete(User $user, CartItem $item, Cart $cart)
    {
        return $user->id === $cart->user_id && $cart->id === $item->cart_id;
    }
}
