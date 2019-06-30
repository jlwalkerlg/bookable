<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Stripe\PaymentIntent;

class Cart extends Model
{
    protected $table = 'carts';

    protected $fillable = ['user_id', 'intent_id'];

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

    public function addIntent(PaymentIntent $intent)
    {
        return $this->update(['intent_id' => $intent->id]);
    }
}
