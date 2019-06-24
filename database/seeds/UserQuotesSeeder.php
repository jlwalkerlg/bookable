<?php

use Illuminate\Database\Seeder;
use App\Quote;

class UserQuotesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $quoteIds = Quote::select('id')->get()->map(function ($quote) {
            return $quote->id;
        });
        $userIds = App\User::select('id')->orderBy('id', 'asc')->get()->map(function ($user) {
            return $user->id;
        });

        foreach ($userIds as $userId) {
            App\UserQuote::insert(
                $quoteIds->random(30)->map(function ($quoteId) use ($userId) {
                    return [
                        'quote_id' => $quoteId,
                        'user_id' => $userId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->all()
            );
        }
    }
}
