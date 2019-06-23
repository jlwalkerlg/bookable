<?php

use Illuminate\Database\Seeder;
use App\Cart;
use App\CartItem;
use App\Book;
use App\User;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $bookIds = Book::select('id')->get()->map(function ($book) {
            return $book->id;
        });

        $userIds = User::select('id')->orderBy('id', 'asc')->get()->map(function ($user) {
            return $user->id;
        });

        foreach ($userIds as $userId) {
            $cart = Cart::create(['user_id' => $userId]);

            CartItem::insert(
                $bookIds->random(8)->map(function ($bookId) use ($cart) {
                    return [
                        'quantity' => rand(1, 3),
                        'book_id' => $bookId,
                        'cart_id' => $cart->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->all()
            );
        }
    }
}
