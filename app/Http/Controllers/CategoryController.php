<?php

namespace App\Http\Controllers;

use App\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        if ($orderBy = $request->input('order_by')) {
            if ($column = $this->getOrderByColumn($orderBy)) {
                $direction = $this->getOrderByDirection($request->input('order_dir'));
                $query->orderBy($column, $direction);
            }
        }

        if ($with = $request->input('with')) {
            $query->with(explode(',', $with));
        }

        $categories = $query->get();

        return compact('categories');
    }

    /**
     * Get column appropriate to requested column.
     * @return string
     */
    private function getOrderByColumn($column)
    {
        $columns = [
            'random' => DB::raw('RAND()')
        ];

        return $columns[$column] ?? null;
    }

    private function getOrderByDirection($direction = null)
    {
        $directions = ['asc', 'desc'];
        $direction = strtolower($direction ?? 'desc');
        return in_array($direction, $directions) ? $direction : 'desc';
    }

    public function show(Category $category)
    {
        return $category;
    }
}
