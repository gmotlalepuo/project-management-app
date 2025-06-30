<?php

namespace App\Http\Controllers;

use App\Models\documents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DocumentController extends Controller
{
    public function store(Request $request)
    {
        // $request->validate([
        //     'title' => 'required|string|max:255',
        //     'revenue' => 'required|numeric',
        //     'year' => 'required|integer|min:1900|max:' . date('Y'), // Ensures it's a valid year
        //     'tax' => 'required|numeric|min:0',
        //     'expenses' => 'required|numeric|min:0',
        //     'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10048',
        // ]);

        $file = $request->file('file');
        $filePath = $file->store('documents', 'public');
        $fileType = $file->getClientMimeType();

        $gross_profit_total = $request->input('revenue') - $request->input('expenses');

        $net_profit_total = $gross_profit_total - $request->input('tax');

        $documents = documents::create([
            'title' => $request->input('title'),
            'revenue' => $request->input('revenue'),
            'net_profit' => $net_profit_total,
            'gross_profit' => $gross_profit_total,
            'year' => $request->input('year'),
            'tax' => $request->input('tax'),
            'expenses' => $request->input('expenses'),
            'file_path' => $filePath,
            'file_type' => $fileType,
        ]);

        $documents->save();

        return response($documents, 201)->header('Content-Type', 'application/json');
    }

    public function show($id)
    {
        $documents = DB::select('select * FROM documents where id=?', [$id]);
        
        //return response()->json($documents);
        return response($documents, 201)->header('Content-Type', 'application/json');
    }

    public function getList()
    {
        //$documents = DB::select('select * FROM documents order by DESC');
        $documents = DB::select('select * FROM documents ORDER BY id DESC');

        return response($documents, 201)->header('Content-Type', 'application/json');
    }

    public function download($id)
    {   
        $merge_path = 'documents/'.$id;
        $documents = DB::select('select * FROM documents where file_path=?', [$merge_path]);

        $filePath = storage_path('app/public/documents/' . $id);
        //return $filePath;
        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found.'], 404);
        }

        return response()->download($filePath);
    }

    public function destroy($id)
    {
        DB::table('documents')->where('id',$id)->delete();

        # teacher_registrationDeleted::dispatch($id)->onQueue('main_queue');

        $delete_msg = "Record has been deleted successfully!";
        $json_delete_message = json_encode(array('message' => $delete_msg,'id' => $id));

        return response($json_delete_message, 201)->header('Content-Type', 'application/json');

    }
}
