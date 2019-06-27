<?php

use Illuminate\Database\Seeder;
use App\Book;
use App\User;
use App\Review;

class ReviewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();

        $bookIds = Book::select('id')->get()->map(function ($book) {
            return $book->id;
        });
        $userIds = User::select('id')->orderBy('id', 'asc')->get()->map(function ($user) {
            return $user->id;
        });

        foreach ($userIds as $userId) {
            Review::insert(
                $bookIds->random(10)->map(function ($bookId) use ($userId, $faker) {
                    return [
                        'review' => $faker->text(600),
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
