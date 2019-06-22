<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCategoryQuoteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_quote', function (Blueprint $table) {
            $table->unsignedBigInteger('quote_id');
            $table->unsignedBigInteger('category_id');

            $table->unique(['quote_id', 'category_id']);

            $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('category_quotes');
    }
}
