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
    }

    private function truncateAll()
    {
        $tables = ['users', 'books', 'authors', 'wishlists', 'wishlist_items', 'carts', 'cart_items', 'shelves', 'shelf_items', 'ratings'];
        foreach ($tables as $table) {
            DB::statement("DELETE FROM $table");
            DB::statement("ALTER TABLE $table AUTO_INCREMENT = 1");
        }
    }
}
