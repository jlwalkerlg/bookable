<?php

namespace App\Policies;

use App\User;
use App\ShelfItem;
use Illuminate\Auth\Access\HandlesAuthorization;

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
    public function delete(User $user, ShelfItem $item)
    {
        $shelf = $item->shelf;
        return $user->id === $shelf->user_id && $shelf->id === $item->shelf_id;
    }
}
