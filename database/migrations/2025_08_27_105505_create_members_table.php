<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('address');
            $table->string('tin_number', 15)->nullable()->unique();
            $table->date('birth_date')->nullable();
            $table->foreignId('gender_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('civil_status_id')->nullable()->constrained()->onDelete('set null');
            $table->string('educational_attainment', 50)->nullable();
            $table->string('occupation', 100)->default('Unemployed');
            $table->integer('number_of_dependents')->default(0);
            $table->foreignId('religion_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('annual_income', 12, 2)->nullable();
            $table->string('membership_number')->unique();
            $table->string('bod_resolution_number')->nullable();
            $table->string('membership_type')->nullable();
            $table->decimal('initial_capital_subscription', 12, 2)->default(0);
            $table->decimal('initial_paid_up', 12, 2)->default(0);
            $table->string('afp_id_issued')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
