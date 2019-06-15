<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $table = 'carts';

    public function cartItems()
    {
        return $this->hasMany('App\CartItem');
    }
}
