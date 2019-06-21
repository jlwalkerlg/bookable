<?php

use Illuminate\Database\Seeder;
use App\Category;
use App\CategoryBook;
use App\Book;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $bookIds = Book::select('id')->get()->map(function ($book) {
            return $book->id;
        });

        $categories = [
            'Classics', 'Fiction', 'History', 'Philosophy', 'Prehistory', 'Anthropology', 'Fantasy', 'Comedy', 'Science', 'Travel', 'Thriller', 'Spirituality', 'Nonfiction'
        ];

        Category::insert(array_map(function ($name) {
            return ['name' => $name];
        }, $categories));

        $count = count($categories);

        foreach ($bookIds as $bookId) {
            $categoryIds = collect(range(1, $count))->shuffle()->take(rand(3, 6))->all();
            CategoryBook::insert(array_map(function ($categoryId) use ($bookId) {
                return ['book_id' => $bookId, 'category_id' => $categoryId];
            }, $categoryIds));
        }
    }
}
