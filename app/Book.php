<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $table = 'books';

    protected $casts = [
        'price' => 'float'
    ];

    protected $appends = ['avg_rating'];

    public $timestamps = false;

    public function getPublicationDateAttribute($value)
    {
        return date('d M Y', jdtounix($value));
    }

    public function getAvgRatingAttribute($value)
    {
        return $value ?? $this->attributes['ratings_sum'] / $this->attributes['ratings_count'];
    }

    public function author()
    {
        return $this->belongsTo('App\Author');
    }

    public function reviews()
    {
        return $this->hasMany('App\Review');
    }

    public function addReview(Review $review)
    {
        $this->ratings_sum += $review->rating;
        $this->ratings_count++;
        return $this->save();
    }

    public function updateReview(Review $review, $newRating)
    {
        $this->ratings_sum += ($newRating - $review->rating);
        return $this->save();
    }
}
