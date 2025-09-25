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
            $table->decimal('previous_payment', 12, 2)->nullable();
            $table->decimal('principal_deduction', 12, 2);
            $table->decimal('monthly_interest', 12, 2);
            $table->decimal('unpaid_share_capital', 12, 2);
            $table->decimal('balance', 12, 2)->nullable();
            $table->decimal('share', 12, 2)->nullable(); // Accumulated unpaid share capital
            $table->decimal('zampen_benefits', 12, 2)->nullable();
            $table->decimal('processing_fee', 12, 2)->nullable();
            $table->decimal('total_deduction', 12, 2);
            $table->decimal('monthly_payment', 12, 2);
            $table->enum('status', ['Pending', 'Open', 'Rejected', 'Paid'])->default('Pending'); // Loan Status
            $table->date('date_approved')->nullable();
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
