<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Shelf extends Model
{
    protected $table = 'shelves';

    protected $fillable = ['name', 'user_id'];

    public function items()
    {
        return $this->hasMany('App\ShelfItem');
    }

    public function addItem(Request $request)
    {
        return $this->items()->updateOrCreate([
            'book_id' => $request->post('book_id')
        ]);
    }
}
