<?php

use Illuminate\Database\Seeder;
use App\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'id' => 1,
            'name' => 'Jordan Walker',
            'email' => 'walker.jlg@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('secret123'), // password
            'remember_token' => Str::random(10),
        ]);

        factory('App\User', 4)->create();
    }
}
