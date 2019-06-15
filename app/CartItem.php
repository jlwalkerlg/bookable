<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $table = 'cart_items';

    protected $fillable = ['cart_id', 'book_id', 'quantity'];

    public function book()
    {
        return $this->belongsTo('App\Book');
    }
}
