<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        $members = Member::all();
        return Inertia::render('members/index', [
            'members' => $members,
        ]);
    }

    public function show(Member $member)
    {
        return Inertia::render('members/show', [
            'member' => $member->load('attachments')
        ]);
    }

    public function store(Request $request)
    {
        $validated_data = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'tin_number' => 'nullable|string|max:255|unique:members,tin_number',
            'birth_date' => 'required|date',
            'gender' => 'required',
            'civil_status' => 'required',
            'educational_attainment' => 'nullable|string|max:255',
            'occupation' => 'nullable|string|max:255',
            'number_of_dependents' => 'nullable|integer|min:0',
            'religion' => 'nullable',
            'annual_income' => 'nullable|numeric|min:0',
            'membership_number' => 'nullable|string|max:255|unique:members,membership_number',
            'bod_resolution_number' => 'nullable|string|max:255|unique:members,bod_resolution_number',
            'membership_type' => 'nullable|string|max:255',
            'initial_capital_subscription' => 'nullable|numeric|min:0',
            'initial_paid_up' => 'nullable|numeric|min:0',
            'afp_issued_id' => 'nullable|string|max:255|unique:members,afp_issued_id',
        ]);

        $member = Member::create($validated_data);

        // Validate attachments if they exist
        if ($request->hasFile('attachments')) {
            $request->validate([
                'attachments.*' => 'file|max:5120',
            ]);

            foreach ($request->file('attachments') as $index => $file) {
                if ($file && $file->isValid()) {
                    // get file name
                    $originalName = $request->input("attachments.{$index}.file_name")
                        ?? $file->getClientOriginalName();

                    $extension = $file->getClientOriginalExtension();
                    $maxLength = 50;

                    // reserve space for the dot + extension
                    $baseLength = $maxLength - (strlen($extension) + 1);

                    // cut the base name safely
                    $baseName = pathinfo($originalName, PATHINFO_FILENAME);
                    $baseName = Str::limit($baseName, $baseLength, '');

                    // put it back together
                    $file_name = $baseName . '.' . $extension;

                    // Generate a unique filename with the original extension
                    $unique_name = Str::uuid() . '.' . $file->getClientOriginalExtension();

                    // Store the file
                    $path = $file->storeAs('attachments', $unique_name, 'public');

                    // Create the attachment record
                    $member->attachments()->create([
                        'file_name' => $file_name,
                        'file_path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                    ]);
                }
            }
        }

        return Inertia::location(route('members.index'));
    }

    public function edit(Member $member)
    {
        return Inertia::render('members/edit', [
            'member' => $member
        ]);
    }

    public function update(Request $request, Member $member)
    {
        $validated_data = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'tin_number' => 'nullable|string|max:255|unique:members,tin_number,' . $member->id,
            'birth_date' => 'required|date',
            'gender' => 'required',
            'civil_status' => 'required',
            'educational_attainment' => 'nullable|string|max:255',
            'occupation' => 'nullable|string|max:255',
            'number_of_dependents' => 'nullable|integer|min:0',
            'religion' => 'nullable',
            'annual_income' => 'nullable|numeric|min:0',
            'membership_number' => 'nullable|string|max:255|unique:members,membership_number,' . $member->id,
            'bod_resolution_number' => 'nullable|string|max:255|unique:members,bod_resolution_number,' . $member->id,
            'membership_type' => 'nullable|string|max:255',
            'initial_capital_subscription' => 'nullable|numeric|min:0',
            'initial_paid_up' => 'nullable|numeric|min:0',
            'afp_issued_id' => 'nullable|string|max:255|unique:members,afp_issued_id,' . $member->id,
        ]);

        $member->update($validated_data);

        return redirect()->back();
    }

    public function destroy(Member $member)
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

    public function addAttachments(Request $request, Member $member)
    {
        $request->validate([
            'attachments.*' => 'required|file|mimes:jpg,jpeg,png,pdf,docx|max:5120',
        ]);

        foreach ($request->file('attachments', []) as $index => $file) {
            if ($file && $file->isValid()) {
                // Get original or provided filename
                $originalName = $request->input("attachments.{$index}.file_name")
                    ?? $file->getClientOriginalName();

                $extension = $file->getClientOriginalExtension();
                $maxLength = 50;

                // Reserve space for dot + extension
                $baseLength = $maxLength - (strlen($extension) + 1);

                // Cut the base name safely
                $baseName = pathinfo($originalName, PATHINFO_FILENAME);
                $baseName = Str::limit($baseName, $baseLength, '');

                // Final safe name
                $file_name = $baseName . '.' . $extension;

                // Generate unique stored filename
                $unique_name = Str::uuid() . '.' . $extension;

                // Store the file in storage/app/public/attachments
                $path = $file->storeAs('attachments', $unique_name, 'public');

                // Save record
                $member->attachments()->create([
                    'file_name' => $file_name,
                    'file_path' => '/storage/' . $path, // accessible via browser
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        return redirect()->back()->with('success', 'Files uploaded successfully');
    }

    public function removeAttachment(Attachment $attachment)
    {
        // Delete the file from storage if it exists
        if (Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        // Delete the record from the database
        $attachment->forceDelete();

        return redirect()->back()->with('success', 'Attachment removed successfully.');
    }
}