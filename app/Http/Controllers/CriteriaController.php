<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CriteriaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');

        $query = Criteria::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('type', 'like', '%' . $search . '%');
            });
        }

        $criterias = $query->orderBy('id')->get();

        return Inertia::render('criterias', [
            'criterias' => $criterias,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Criteria $criteria)
    {
        //
    }

    public function edit(Criteria $criteria)
    {
        //
    }

    public function update(Request $request, Criteria $criteria)
    {
        //
    }

    public function destroy(Criteria $criteria)
    {
        //
    }
}
