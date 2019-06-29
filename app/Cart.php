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

    public function books()
    {
        return Book::join('cart_items', 'cart_items.book_id', '=', 'books.id')->where('cart_items.cart_id', $this->id)->select('books.*');
    }

    public function getAmount()
    {
        return $this->books()->sum('price');
    }
}
