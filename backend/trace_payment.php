<?php
include 'vendor/autoload.php';
$app = include 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\House;
use App\Models\Payment;
use Illuminate\Http\Request;
use App\Http\Controllers\PaymentController;

$house = House::where('nomor_rumah', 'A-1')->first();
if (!$house) {
    echo "ERROR: House A-1 not found\n";
    exit;
}

$request = new Request([
    'house_id' => $house->id,
    'year' => 2026
]);

$controller = new PaymentController();
$response = $controller->status($request);

echo "API_RESPONSE_START\n";
echo json_encode($response->getData(), JSON_PRETTY_PRINT);
echo "\nAPI_RESPONSE_END\n";

echo "DATABASE_DUMP_START\n";
$payments = Payment::where('house_id', $house->id)->where('tahun', 2026)->get();
foreach ($payments as $p) {
    echo "ID:{$p->id} | House:{$p->house_id} | Type:{$p->jenis_iuran} | Month:{$p->bulan} | Year:{$p->tahun}\n";
}
echo "DATABASE_DUMP_END\n";
