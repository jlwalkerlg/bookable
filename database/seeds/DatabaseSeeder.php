<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->truncateAll();

        $this->call(UsersTableSeeder::class);
        $this->call(GoodreadsSeeder::class);
        $this->call(WishlistSeeder::class);
        $this->call(CartSeeder::class);
        $this->call(ShelfSeeder::class);
        $this->call(RatingsSeeder::class);
        $this->call(CategoriesSeeder::class);
        $this->call(UserQuotesSeeder::class);
        $this->call(ReviewsSeeder::class);
    }

    private function truncateAll()
    {
        $tables = ['transactions', 'wishlist_items', 'wishlists', 'cart_items', 'carts', 'shelf_items', 'shelves', 'user_quote', 'ratings', 'reviews', 'users', 'category_book', 'category_quote', 'categories', 'quotes', 'books', 'authors'];
        foreach ($tables as $table) {
            DB::statement("DELETE FROM $table");
            DB::statement("ALTER TABLE $table AUTO_INCREMENT = 1");
        }
    }
}
