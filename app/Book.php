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
}
