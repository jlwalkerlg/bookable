<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title', 255);
            $table->text('description');
            $table->string('publication_date', 10);
            $table->string('publisher', 255);
            $table->string('image_url', 255);
            $table->string('small_image_url', 255);
            $table->string('large_image_url', 255)->nullable();
            $table->integer('num_pages');
            $table->integer('ratings_sum');
            $table->integer('ratings_count');
            $table->unsignedBigInteger('author_id')->nullable();

            $table->foreign('author_id')->references('id')->on('authors');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('books');
    }
}
