<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $table = 'cart_items';

    public function book()
    {
        return $this->belongsTo('App\Book');
    }
}
