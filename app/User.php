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

    public function wishlist()
    {
        return $this->hasOne('App\Wishlist');
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

    public function ratings()
    {
        return $this->hasMany('App\Rating');
    }

    public function quotes()
    {
        return $this->hasMany('App\UserQuote');
    }
}
