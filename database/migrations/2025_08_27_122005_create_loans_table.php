<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
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
            $table->decimal('previous_payment', 12, 2)->default(0);
            $table->unsignedInteger('loan_term')->default(5); // Loan term in months
            $table->decimal('interest_rate', 5, 2)->default(3.00); // Interest rate
            $table->decimal('share_capital_rate', 5, 2)->default(2.00); // Share capital rate
            $table->foreignId('loan_status_id')->constrained()->onDelete('cascade'); // Loan Status
            $table->decimal('share', 12, 2)->nullable(); // Accumulated unpaid share capital
            $table->decimal('zampen_benefits', 12, 2)->nullable();
            $table->decimal('processing_fee', 12, 2)->nullable();
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
