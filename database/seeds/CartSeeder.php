<?php

use Illuminate\Database\Seeder;
use App\Cart;
use App\CartItem;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $book_ids = [168668, 157993, 386162];

        Cart::create(['user_id' => 1]);

        CartItem::insert(
            array_map(function ($book_id) {
                return [
                    'quantity' => rand(1, 3),
                    'cart_id' => 1,
                    'book_id' => $book_id
                ];
            }, $book_ids)
        );
    }
}
