<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Cart extends Model
{
    protected $table = 'carts';

    public function items()
    {
        return $this->hasMany('App\CartItem');
    }
}
