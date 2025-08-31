<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return Inertia::render('users/index', [
            'users' => $users
        ]);
    }

    public function show(User $user)
    {
        return Inertia::render('users/show', [
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => [
                'required',
                Rule::exists('roles', 'name')->whereNot('name', 'Admin'),
            ], // Validate that the role exists and is not 'Admin'
        ]);

        $request['password'] = bcrypt($request['password']);

        $user = User::create($request->only('name', 'username', 'email', 'password'));
        $user->assignRole($request->role);

        return Inertia::location(route('users.index'));
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => $roles
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => [
                'required',
                Rule::exists('roles', 'name')->where(function ($query) {
                    $query->where('name', '!=', 'admin');
                }),
            ], // Validate that the role exists and is not 'admin'
        ]);

        $data = $request->only('name', 'email');

        if ($request->filled('password')) {
            $data['password'] = $request->input('password');
        }

        $user->update($data);
        $user->syncRoles($request->role);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    public function restore($id)
    {
        $user = User::withTrashed()->find($id);
        $user->restore();

        return redirect()->route('users.index')->with('success', 'User restored successfully.');
    }

    public function forceDelete($id)
    {
        $user = User::withTrashed()->find($id);
        $user->forceDelete();

        return redirect()->route('users.index')->with('success', 'User permanently deleted.');
    }
}
