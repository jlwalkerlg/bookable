<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Cart extends Model
{
    protected $table = 'carts';

    public function cartItems()
    {
        return $this->hasMany('App\CartItem');
    }

    public function addItem(Request $request)
    {
        return $this->cartItems()->create([
            'book_id' => $request->post('book_id'),
            'quantity' => $request->post('quantity')
        ]);
    }
}
