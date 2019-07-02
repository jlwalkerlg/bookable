<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('payment_intent_id');
            $table->string('card_brand');
            $table->string('card_last_four', 4);
            $table->integer('amount');
            $table->timestamp('charged_at');
            $table->string('street_address');
            $table->string('city');
            $table->string('postcode', 8);
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('cart_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('cart_id')->references('id')->on('carts');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
