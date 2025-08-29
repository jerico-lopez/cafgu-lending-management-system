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
        Schema::create('loan_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->unsignedInteger('month_no');
            $table->date('due_date');
            $table->decimal('principal_deduction', 12, 2)->nullable(); // 20% of principal loan
            $table->decimal('monthly_interest', 12, 2)->nullable(); // 3% of principal loan
            $table->decimal('unpaid_share_capital', 12, 2)->nullable(); // 2% of principal loan
            $table->decimal('total_deduction', 12, 2)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_schedules');
    }
};
