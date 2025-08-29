<?php

namespace App\Http\Controllers;

use App\Models\CivilStatus;
use App\Models\Gender;
use App\Models\Member;
use App\Models\Religion;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        return Inertia::render('members/index');
    }

    public function show(Member $member)
    {
        return Inertia::render('members/show', [
            'member' => $member
        ]);
    }

    public function create()
    {
        $civil_statuses = CivilStatus::all();
        $genders = Gender::all();
        $religions = Religion::all();
        return Inertia::render('members/create', [
            'civil_statuses' => $civil_statuses,
            'genders' => $genders,
            'religions' => $religions
        ]);
    }

    public function store(Request $request)
    {
        $validated_data = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'tin_number' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'gender_id' => 'required|exists:genders,id',
            'civil_status_id' => 'required|exists:civil_statuses,id',
            'educational_attainment' => 'required|string|max:255',
            'occupation' => 'required|string|max:255',
            'number_of_dependents' => 'required|integer|min:0',
            'religion_id' => 'required|exists:religions,id',
            'annual_income' => 'required|numeric|min:0',
            'membership_number' => 'required|string|max:255',
            'bod_relationship' => 'required|string|max:255',
            'membership_type' => 'required|string|max:255',
            'initial_capital_subscription' => 'required|numeric|min:0',
            'initial_paid_up' => 'required|numeric|min:0',
            'afp_id_issued' => 'required|string|max:255',
        ]);

        $member = Member::create($validated_data);

        $request->validate([
            'attachments.*' => 'file|max:2048',
            'attachment_names.*' => 'string|max:255'
        ]);

        $attachments = $request->file('attachments');
        $names = $request->input('attachment_names');

        if ($attachments) {
            foreach ($attachments as $index => $file) {
                $file_name = $names[$index] ?? $file->getClientOriginalName(); // Title of the attachment

                $unique_name = Str::uuid() . '_' . $file->getClientOriginalExtension(); // Unique name for the attachment path
                $path = $file->storeAs('attachments', $unique_name, 'public'); // Store the attachment

                // Create the attachment record
                $member->attachments()->create([
                    'file_name' => $file_name,
                    'file_path' => $path
                ]);
            }
        }

        return redirect()->route('members.index');
    }

    public function edit(Member $member)
    {
        $civil_statuses = CivilStatus::all();
        $genders = Gender::all();
        $religions = Religion::all();
        return Inertia::render('members/edit', [
            'member' => $member,
            'civil_statuses' => $civil_statuses,
            'genders' => $genders,
            'religions' => $religions
        ]);
    }

    public function update(Request $request, Member $member)
    {
        $validated_data = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'tin_number' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'gender_id' => 'required|exists:genders,id',
            'civil_status_id' => 'required|exists:civil_statuses,id',
            'educational_attainment' => 'required|string|max:255',
            'occupation' => 'required|string|max:255',
            'number_of_dependents' => 'required|integer|min:0',
            'religion_id' => 'required|exists:religions,id',
            'annual_income' => 'required|numeric|min:0',
            'membership_number' => 'required|string|max:255',
            'bod_relationship' => 'required|string|max:255',
            'membership_type' => 'required|string|max:255',
            'initial_capital_subscription' => 'required|numeric|min:0',
            'initial_paid_up' => 'required|numeric|min:0',
            'afp_id_issued' => 'required|string|max:255',
        ]);

        $member->update($validated_data);

        return redirect()->route('members.index');
    }

    public function delete(Member $member)
    {
        $member->delete();

        return redirect()->route('members.index');
    }

    public function restore($id)
    {
        $member = Member::withTrashed()->find($id);
        $member->restore();

        return redirect()->route('members.index');
    }

    public function forceDelete($id)
    {
        $member = Member::withTrashed()->find($id);
        $member->forceDelete();

        return redirect()->route('members.index');
    }
}