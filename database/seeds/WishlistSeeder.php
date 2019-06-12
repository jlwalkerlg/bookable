<?php

use Illuminate\Database\Seeder;
use App\WishlistItem;

class WishlistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $book_ids = [1381, 2956, 3836, 52036];

        WishlistItem::insert(
            array_map(function ($book_id) {
                return [
                    'book_id' => $book_id,
                    'user_id' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $book_ids)
        );
    }
}
