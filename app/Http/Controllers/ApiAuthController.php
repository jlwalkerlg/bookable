<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\User;
use Illuminate\Support\Facades\DB;
use App\Notifications\AccountCreated;

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

        return $this->respondWithToken($token);
    }

    public function logout(Request $request)
    {
        if ($request->user()) $request->user()->token()->revoke();
        return response()->json(['message' => 'You have been successfully logged out!'])->cookie('laravel_token', null, -1);
    }

    public function register(Request $request)
    {
        $credentials = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
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

        $user->notify(new AccountCreated);

        return $this->respondWithToken($token);
    }

    private function respondWithToken($token)
    {
        // TODO: https only cookie in production after buying SSL certificate
        // $secure = config('app.env') !== 'local';
        $secure = false;
        return response()->json(['token' => $token])->cookie('laravel_token', $token, 100, '/', null, $secure, true);
    }
}
