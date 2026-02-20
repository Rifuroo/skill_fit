<?php
include 'vendor/autoload.php';
$app = include 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\House;

$houses = House::all();
foreach ($houses as $h) {
    echo "ID:{$h->id} | Name:{$h->nomor_rumah}\n";
}
