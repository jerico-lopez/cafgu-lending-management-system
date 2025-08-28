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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->foreignId('patrol_base_id')->constrained()->onDelete('cascade');
            $table->decimal('principal_loan', 12, 2); // The loan amount
            $table->decimal('previous_payment', 12, 2)->default(0); // Payments already made
            
            // Deductions & computations
            $table->decimal('principal_deduction', 12, 2)->nullable(); // 20% of principal loan
            $table->decimal('monthly_interest', 12, 2)->nullable(); // 3% of principal loan
            $table->decimal('unpaid_share_capital', 12, 2)->nullable(); // 2% of principal loan
            $table->decimal('balance', 12, 2)->nullable(); // Remaining loan balance
            $table->decimal('share', 12, 2)->nullable(); // Accumulated unpaid share capital
            $table->decimal('zampen_benefits', 12, 2)->nullable();
            $table->decimal('processing_fee', 12, 2)->nullable();
            $table->decimal('total_deduction', 12, 2)->nullable();
            $table->foreignId('loan_status_id')->constrained()->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
