<?php

use Illuminate\Database\Seeder;
use App\Review;
use Illuminate\Support\Facades\DB;

class ReviewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $bookIds = [7604, 8852, 11486];

        foreach ($bookIds as $id) {
            factory('App\Review')->create(['book_id' => $id]);
        }
    }
}
