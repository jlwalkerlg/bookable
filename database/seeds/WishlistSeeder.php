<?php

use Illuminate\Database\Seeder;
use App\WishlistItem;
use App\Wishlist;
use App\Book;
use App\User;

class WishlistSeeder extends Seeder
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
            $wishlist = Wishlist::create(['user_id' => $userId]);

            WishlistItem::insert(
                $bookIds->random(10)->map(function ($bookId) use ($wishlist) {
                    return [
                        'book_id' => $bookId,
                        'wishlist_id' => $wishlist->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->all()
            );
        }
    }
}
