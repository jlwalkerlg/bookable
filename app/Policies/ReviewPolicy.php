<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Review;

class ReviewPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the review.
     *
     * @param  \App\User  $user
     * @param  \App\Review  $review
     * @return mixed
     */
    public function update(User $user, Review $review)
    {
        return $user->id === $review->user_id;
    }
}
