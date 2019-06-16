<?php

namespace App\Policies;

use App\User;
use App\ShelfItem;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Shelf;

class ShelfItemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can delete the shelf item.
     *
     * @param  \App\User  $user
     * @param  \App\ShelfItem  $shelfItem
     * @return mixed
     */
    public function delete(User $user, ShelfItem $item, Shelf $shelf)
    {
        return $user->id === $shelf->user_id && $shelf->id === $item->shelf_id;
    }
}
