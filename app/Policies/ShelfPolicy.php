<?php

namespace App\Policies;

use App\User;
use App\Shelf;
use Illuminate\Auth\Access\HandlesAuthorization;

class ShelfPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the shelf.
     *
     * @param  \App\User  $user
     * @param  \App\Shelf  $shelf
     * @return mixed
     */
    public function update(User $user, Shelf $shelf)
    {
        return $user->id === $shelf->user_id;
    }
}
