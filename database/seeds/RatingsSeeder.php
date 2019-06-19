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
            18405,
            656,
            233093,
            890,
            1381,
            7126,
            1420,
            157993,
            41865,
            6,
            33574273,
            46787,
            5297,
            2657,
            15881,
            3636,
            14891,
            19063,
            39988,
            17245,
            6185,
            1617,
            323355,
            18135,
            2998,
            1923820,
            24178,
            24280,
            2767052,
            5326,
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

        Rating::insert(array_map(function ($book_id) {
            return [
                'rating' => DB::raw('CEIL(RAND() * 5)'),
                'book_id' => $book_id,
                'user_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $book_ids));
    }
}
