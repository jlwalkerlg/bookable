<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function wishlistItems()
    {
        return $this->hasMany('App\WishlistItem');
    }

    public function addToWishlist(Book $book)
    {
        return $this->wishlistItems()->create(['book_id' => $book->id]);
    }

    public function cart()
    {
        return $this->hasOne('App\Cart');
    }

    public function shelves()
    {
        return $this->hasMany('App\Shelf');
    }

    public function shelfItems()
    {
        return $this->hasManyThrough('App\ShelfItem', 'App\Shelf');
    }
}
