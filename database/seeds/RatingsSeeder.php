<?php

use Illuminate\Database\Seeder;
use App\Rating;
use Illuminate\Support\Facades\DB;

class RatingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $book_ids = [
            46787,
            227463,
            168668,
            52036,
            323355,
            355697,
            6900,
            7613,
            1923820,
            1934
        ];

        Rating::insert(array_map(function ($book_id) {
            return [
                'rating' => DB::raw('CEIL(RAND() * 5)'),
                'book_id' => $book_id,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $book_ids));
    }
}
