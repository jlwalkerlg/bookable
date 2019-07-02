<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\User;
use Illuminate\Support\Facades\DB;

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

        return response()->json(['token' => $token])->cookie('laravel_token', $token, 100, '/', null, config('app.env') !== 'local', true);
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json(['message' => 'You have been successfully logged out!'])->cookie('laravel_token', null, -1);
    }

    public function register(Request $request)
    {
        $credentials = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);
        $credentials['password'] = Hash::make($credentials['password']);

        try {
            DB::beginTransaction();
            $user = User::create($credentials);
            $user->carts()->create();
            $user->wishlist()->create();
            $user->shelves()->create(['name' => 'Read']);
            $user->shelves()->create(['name' => 'To Read']);
            $token = $user->createToken('Bookable Personal Access Client')->accessToken;
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw $th;
        }

        return response()->json(['token' => $token])->cookie('laravel_token', $token, 100, '/', null, config('app.env') !== 'local', true);
    }
}
