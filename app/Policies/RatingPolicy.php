<?php

namespace App\Policies;

use App\User;
use App\Rating;
use Illuminate\Auth\Access\HandlesAuthorization;

class RatingPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the rating.
     *
     * @param  \App\User  $user
     * @param  \App\Rating  $rating
     * @return mixed
     */
    public function update(User $user, Rating $rating)
    {
        return $user->id === $rating->user_id;
    }
}
