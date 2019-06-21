<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    protected $table = 'wishlists';

    protected $fillable = ['user_id'];

    public function items()
    {
        return $this->hasMany('App\WishlistItem');
    }
}
