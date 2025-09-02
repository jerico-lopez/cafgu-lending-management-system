<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Member;
use App\Models\PatrolBase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BorrowerController extends Controller
{
    public function index()
    {
        $members = Member::all();
        $patrol_bases = PatrolBase::all();
        $loans = Loan::with('member', 'schedules', 'patrolBase')->latest()->get();
        return Inertia::render('borrowers/index', [
            'members' => $members,
            'loans' => $loans,
            'patrol_bases' => $patrol_bases,
        ]);
    }
}
