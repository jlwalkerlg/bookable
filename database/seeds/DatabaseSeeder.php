<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UsersTableSeeder::class);
        $this->call(GoodreadsSeeder::class);
        $this->call(WishlistSeeder::class);
        $this->call(CartSeeder::class);
        $this->call(ShelfSeeder::class);
        $this->call(ReviewsSeeder::class);
    }
}
