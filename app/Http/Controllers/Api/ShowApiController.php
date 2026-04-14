<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Resources\ShowResource;
use App\Models\Show;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ShowApiController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ShowResource::collection(Show::with('location')->paginate(15));
    }

    public function show(Show $show): ShowResource
    {
        return new ShowResource($show->load('location'));
    }
}
