<?php

namespace App\Http\Controllers;

use App\Models\PatrolBase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatrolBaseController extends Controller
{
    public function index()
    {
        $patrol_bases = PatrolBase::all();
        return Inertia::render('patrol_bases/index', compact('patrol_bases'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'command_officer' => 'nullable|string|max:255',
        ]);

        PatrolBase::create($request->only('name', 'location', 'command_officer'));

        return Inertia::location(route('patrol-bases.index'));
    }

    public function show(PatrolBase $patrolBase)
    {
        return view('patrol_bases.show', compact('patrolBase'));
    }

    public function edit(PatrolBase $patrolBase)
    {
        return view('patrol_bases.edit', compact('patrolBase'));
    }

    public function update(Request $request, PatrolBase $patrolBase)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $patrolBase->update($request->only('name'));

        return redirect()->route('patrol-bases.index');
    }

    public function destroy(PatrolBase $patrolBase)
    {
        $patrolBase->delete();

        return redirect()->route('patrol-bases.index');
    }

    public function restore($id)
    {
        $patrolBase = PatrolBase::withTrashed()->findOrFail($id);
        $patrolBase->restore();

        return redirect()->route('patrol-bases.index');
    }

    public function forceDelete($id)
    {
        $patrolBase = PatrolBase::withTrashed()->findOrFail($id);
        $patrolBase->forceDelete();

        return redirect()->route('patrol-bases.index');
    }
}
