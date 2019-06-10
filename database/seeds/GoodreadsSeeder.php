<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GoodreadsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::unprepared(file_get_contents(__DIR__ . '/goodreads_2019-06-10.sql'));
    }
}
