<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WishlistItem extends Model
{
    protected $table = 'wishlist_items';

    protected $fillable = ['book_id', 'user_id'];

    public function book()
    {
        return $this->belongsTo('App\Book');
    }
}
