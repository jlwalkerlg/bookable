<?php

use Illuminate\Database\Seeder;
use App\Rating;
use App\Book;
use App\User;

class RatingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $bookIds = Book::select('id')->inRandomOrder()->get()->map(function ($book) {
            return $book->id;
        });
        $userIds = User::select('id')->inRandomOrder()->get()->map(function ($user) {
            return $user->id;
        });

        foreach ($userIds as $userId) {
            Rating::insert(
                $bookIds->random(30)->map(function ($bookId) use ($userId) {
                    return [
                        'rating' => rand(1, 5),
                        'book_id' => $bookId,
                        'user_id' => $userId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->all()
            );
        }
    }
}
