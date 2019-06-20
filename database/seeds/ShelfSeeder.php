<?php

use Illuminate\Database\Seeder;
use App\Shelf;
use App\ShelfItem;
use App\Book;
use App\User;

class ShelfSeeder extends Seeder
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
            $readShelf = Shelf::create([
                'name' => 'Read',
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $toReadShelf = Shelf::create([
                'name' => 'To Read',
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            ShelfItem::insert(
                $bookIds->random(30)->map(function ($bookId) use ($readShelf) {
                    return [
                        'book_id' => $bookId,
                        'shelf_id' => $readShelf->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->all()
            );
            ShelfItem::insert(
                $bookIds->random(30)->map(function ($bookId) use ($toReadShelf) {
                    return [
                        'book_id' => $bookId,
                        'shelf_id' => $toReadShelf->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->all()
            );
        }
    }
}
