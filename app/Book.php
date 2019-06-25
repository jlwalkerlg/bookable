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

    public function categories()
    {
        return $this->belongsToMany('App\Category', 'category_book');
    }

    public function quotes()
    {
        return $this->hasMany('App\Quote');
    }
}
