<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Auth (Optional for now, but good to have)
    // Route::post('/login', [AuthController::class, 'login']);

    // Residents
    Route::apiResource('residents', ResidentController::class);

    // Houses
    Route::apiResource('houses', HouseController::class);
    Route::post('houses/{house}/assign-resident', [HouseController::class, 'assignResident']);
    Route::post('houses/{house}/remove-resident', [HouseController::class, 'removeResident']); // Or PUT/PATCH
    Route::get('houses/{house}/history', [HouseController::class, 'history']);

    // Payments
    Route::apiResource('payments', PaymentController::class);
    Route::get('payments-summary', [PaymentController::class, 'summary']); // Monthly/Yearly summary
    Route::get('payments-status', [PaymentController::class, 'status']); // Lunas/Belum

    // Expenses
    Route::apiResource('expenses', ExpenseController::class);
    Route::get('expenses-summary', [ExpenseController::class, 'summary']);

    // Reports (Charts & Details)
    Route::get('reports/dashboard', [ReportController::class, 'dashboard']); // 1 year chart
    Route::get('reports/monthly', [ReportController::class, 'monthly']); // Detail per month
});
