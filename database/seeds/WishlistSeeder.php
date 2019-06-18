<?php

use Illuminate\Database\Seeder;
use App\WishlistItem;
use App\Wishlist;

class WishlistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $wishlist = Wishlist::create(['user_id' => 1]);

        $book_ids = [1381, 2956, 3836, 52036];

        WishlistItem::insert(
            array_map(function ($book_id) use ($wishlist) {
                return [
                    'book_id' => $book_id,
                    'wishlist_id' => $wishlist->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $book_ids)
        );
    }
}
