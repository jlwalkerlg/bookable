<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Review;
use Faker\Generator as Faker;

$factory->define(Review::class, function (Faker $faker) {
    return [
        'review' => $faker->text(),
        'rating' => $faker->numberBetween(1, 5),
        'user_id' => 1,
        'created_at' => now(),
        'updated_at' => now()
    ];
});
