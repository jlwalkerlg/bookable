<?php

use Illuminate\Database\Seeder;
use App\Shelf;
use App\ShelfItem;

class ShelfSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Shelf::create([
            'id' => 1,
            'name' => 'Read',
            'user_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Shelf::create([
            'id' => 2,
            'name' => 'To Read',
            'user_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $readIds = [320, 656, 1934];
        $toReadIds = [3636, 8127, 7604];

        ShelfItem::insert(
            array_map(function ($bookId) {
                return [
                    'book_id' => $bookId,
                    'shelf_id' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $readIds)
        );

        ShelfItem::insert(
            array_map(function ($bookId) {
                return [
                    'book_id' => $bookId,
                    'shelf_id' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $toReadIds)
        );
    }
}
