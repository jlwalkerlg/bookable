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

        $token = $user->createToken('Bookable Personal Access Client')->accessToken;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'token' => $token,
        ];
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return ['message' => 'You have been successfully logged out!'];
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

        $token = $user->createToken('Bookable Personal Access Client')->accessToken;

        Cookie::se

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'token' => $token,
        ];
    }
}
