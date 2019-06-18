<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ShelfItem extends Model
{
    protected $table = 'shelf_items';

    protected $fillable = ['book_id', 'shelf_id'];

    public function book()
    {
        return $this->belongsTo('App\Book');
    }

    public function shelf()
    {
        return $this->belongsTo('App\Shelf');
    }
}
