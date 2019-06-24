<?php

use Illuminate\Database\Seeder;
use App\Quote;
use App\Quotelist;
use App\QuotelistItem;
use App\User;

class QuotelistsSeeder extends Seeder
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

        $userIds = User::select('id')->orderBy('id', 'asc')->get()->map(function ($user) {
            return $user->id;
        });

        foreach ($userIds as $userId) {
            $quotelist = Quotelist::create(['user_id' => $userId]);

            QuotelistItem::insert(
                $quoteIds->random(20)->map(function ($quoteId) use ($quotelist) {
                    return [
                        'quote_id' => $quoteId,
                        'quotelist_id' => $quotelist->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->all()
            );
        }
    }
}
