<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\User;

class ApiAuthController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) return response(['message' => 'User does not exist.'], 422);

        if (!Hash::check($request->password, $user->password)) {
            return response(['message' => 'Password mismatch.'], 422);
        }

        $token = $user->createToken('BookOn Personal Access Client')->accessToken;

        return response($token)->cookie('laravel_token', $token, 100, '/', null, config('app.env') !== 'local', true);
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response(['message' => 'You have been successfully logged out!'])->cookie('laravel_token', null, -1);
    }

    public function register(Request $request)
    {
        $credentials = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);
        $credentials['password'] = Hash::make($credentials['password']);

        $user = User::create($credentials);

        $token = $user->createToken('BookOn Personal Access Client')->accessToken;

        return response($token)->cookie('laravel_token', $token, 100, '/', null, config('app.env') !== 'local', true);
    }
}
