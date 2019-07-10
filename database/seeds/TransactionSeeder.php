<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Transaction;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Transaction::insert(array_map(function () {
            $now = date('Y-m-d H:i:s');
            return [
                'payment_intent_id' => Str::random(),
                'card_brand' => 'visa',
                'card_last_four' => 4242,
                'amount' => 9200,
                'charged_at' => $now,
                'street_address' => '10 Mt. Olympus',
                'city' => 'Athens',
                'postcode' => 'LS21L12',
                'user_id' => 1,
                'cart_id' => 1,
                'created_at' => $now,
                'updated_at' => $now
            ];
        }, range(0, 10)));
    }
}
