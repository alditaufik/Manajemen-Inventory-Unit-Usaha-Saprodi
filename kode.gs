function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


//daftar produk

function getProductsList() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product_list");
    if (!sheet) return {};

    var data = sheet.getDataRange().getValues();
    var products = {};

    for (var i = 1; i < data.length; i++) {
        products[data[i][0]] = {
            price: data[i][1] || 0,
            unitType: data[i][2] || "Unit Tidak Ditentukan",
            stock: data[i][3] || 0
        };
    }
    console.log(products);
    return products;
}

function getProductsListAsArray() {
    let products = getProductsList();
    return Object.keys(products).map(name => ({
        name: name,
        price: products[name].price,
        unitType: products[name].unitType,
        stock: products[name].stock
    }));
}


//tambah daftar barang
function addItemProduct(productName, priceSale, qtyType, stock){
  var productsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product_list")

  productsheet.appendRow([productName, priceSale, qtyType, stock]);
  
    
        return `Item ${productName} berhasil ditambahkan!`;
        
    
}

//edit item daftar barang

function editItemProduct(rowIndex, productName, priceSale, qtyType, stock) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var productsheet = spreadsheet.getSheetByName("Product_list");
    
    if (!productsheet) {
        throw new Error("Lembar Product_list tidak ditemukan!");
    }
    
    if (isNaN(rowIndex) || rowIndex < 1) {
        throw new Error("Index produk tidak valid!");
    }

    productsheet.getRange(rowIndex, 1).setValue(productName);
    productsheet.getRange(rowIndex, 2).setValue(priceSale);
    productsheet.getRange(rowIndex, 3).setValue(qtyType);
    productsheet.getRange(rowIndex, 4).setValue(stock);

    return `Item produk telah diperbaharui.`;
}

//hapus daftar produk
function deleteProductItem(productName) {
    var productsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product_list");
    if (!productsheet) {
        throw new Error("Lembar Product_list tidak ditemukan!");
    }

    var productData = productsheet.getDataRange().getValues();
    var rowIndex = -1;

    for (var i = 1; i < productData.length; i++) { // Mulai dari indeks 1 karena baris 0 adalah header
        if (productData[i][0] === productName) {
            rowIndex = i + 1; // Menyesuaikan dengan indeks Spreadsheet
            break;
        }
    }

    if (rowIndex === -1) {
        throw new Error(`Produk "${productName}" tidak ditemukan.`);
    }

    productsheet.deleteRow(rowIndex);
    return `Produk "${productName}" telah dihapus dengan sukses.`;
}




//load nama anggota koperasi

function getMemberKoperasi(){
 var memberSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Anggota_Koperasi"); 
 if (!memberSheet) return [];
 var data = memberSheet.getDataRange().getValues();
 var member = [];

  for (var i = 1; i < data.length; i++){
    member.push({
      id : i,
      name : data[i][0],
      phoneNumber : data[i][1] || "tambahkan nomor HP",
      address : data[i][2] || "tambahkan alamat",
    });    
  }
  
  return member;
}

    //fungsi pesanan anggota
    function saveOrderSaprodi(orderDate, memberName, productName, productQty) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("OrderSaprodiAnggota");
    var productsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product_list");

    if (!sheet || !productsheet) return "Sheet tidak ditemukan!";

    sheet.appendRow([orderDate, memberName, productName, productQty]);

    var product = productsheet.getRange("A2:A").getValues().flat();
    if (!product.includes(productName)){
      productsheet.appendRow([productName, "", "", ""]);
    }return "Order berhasil disimpan!";
}
    

    
function getOrderSaprodiList() {
    var orderSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("OrderSaprodiAnggota");
    var productSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product_list");

    if (!orderSheet || !productSheet) return [];

    var orderData = orderSheet.getDataRange().getValues();
    var productData = productSheet.getDataRange().getValues();

    var productUnits = {}; // Simpan unitType berdasarkan nama produk
    for (var i = 1; i < productData.length; i++) {
        productUnits[productData[i][0]] = productData[i][2]; // Ambil unitType dari kolom ke-3
    }

    var orders = [];
    for (var i = 1; i < orderData.length; i++) {
        let orderDate = Utilities.formatDate(new Date(orderData[i][0]), Session.getTimeZone(), "yyyy-MM-dd");
        let memberName = orderData[i][1];
        let productName = orderData[i][2];
        let quantity = parseInt(orderData[i][3]) || 0;
        let unitType = productUnits[productName] || "Unit Tidak Ditentukan";

        orders.push({
            date: orderDate,
            member: memberName,
            product: productName,
            quantity: quantity,
            unitType: unitType
        });
    }

    return orders;
}



//fitur beli barang
function savePurchaseRecord(purchaseDate, productName, supplierName, purchaseQty, totalPrice) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PembelianBarang");
    var productSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product_list");

    if (!sheet || !productSheet) return "Sheet tidak ditemukan!";

    // Simpan pembelian ke sheet PembelianBarang
    sheet.appendRow([purchaseDate, productName, supplierName, purchaseQty, totalPrice]);

    // Tambahkan stok produk di Product_list
    var productData = productSheet.getDataRange().getValues();
    for (var i = 1; i < productData.length; i++) { 
        if (productData[i][0] === productName) { 
            productSheet.getRange(i + 1, 4).setValue(Number(productData[i][3]) + Number(purchaseQty));
            return "Pembelian berhasil dicatat dan stok diperbarui!";
        }
    }

    return "Pembelian berhasil dicatat!";
}

//tampilkan daftar produk yang diorder anggota
function getOrderedProducts() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("OrderSaprodiAnggota");
    if (!sheet) return [];

    var data = sheet.getDataRange().getValues();
    var orderedProducts = new Set(); // Menghindari duplikasi produk

    for (var i = 1; i < data.length; i++) {
        if (data[i][2]) orderedProducts.add(data[i][2]); // Produk ada di kolom ke-3
    }

    return Array.from(orderedProducts); // Kembalikan sebagai array
}


//tampilkan data supplier
function getSupplierList() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PembelianBarang");
    if (!sheet) return [];

    var data = sheet.getDataRange().getValues();
    var suppliers = new Set(); // Gunakan Set agar tidak ada duplikasi

    for (var i = 1; i < data.length; i++) { // Lewati header
        if (data[i][2]) suppliers.add(data[i][2]); // Ambil nama penyedia produk (kolom ke-3)
    }

    return Array.from(suppliers); // Kembalikan sebagai array
}

//data order per anggota
function getMemberOrderList() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("OrderSaprodiAnggota");
    if (!sheet) return [];

    var data = sheet.getDataRange().getValues();
    var memberOrders = {};

    for (var i = 1; i < data.length; i++) {
        let member = data[i][1];
        let product = data[i][2];
        let quantity = parseInt(data[i][3]);

        if (!memberOrders[member]) {
            memberOrders[member] = {};
        }
        if (!memberOrders[member][product]) {
            memberOrders[member][product] = 0;
        }
        memberOrders[member][product] += quantity;
    }
    return memberOrders;
}

//total harga jual berdasarkan harga satuan
function getProductPrices() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product_list");
    if (!sheet) return {};

    var data = sheet.getDataRange().getValues();
    var productPrices = {};

    for (var i = 1; i < data.length; i++) {
        productPrices[data[i][0]] = parseFloat(data[i][1]); // Harga jual ada di kolom ke-2
    }
    return productPrices;
}

//fitur penjualan
function saveSalesRecord(memberName, productName, quantitySold, totalPrice) {
    var salesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PenjualanProdukAnggota");
    var productSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product_list");
    var orderSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("OrderSaprodiAnggota");

    if (!salesSheet || !productSheet || !orderSheet) {
        throw new Error("Salah satu sheet tidak ditemukan! Pastikan nama sheet benar.");
    }

    // Periksa jumlah stok produk sebelum melakukan penjualan
    var productData = productSheet.getDataRange().getValues();
    var currentStock = null;

    for (var i = 1; i < productData.length; i++) {
        if (productData[i][0] === productName) {
            currentStock = parseInt(productData[i][3]); // Stok ada di kolom ke-4
            break;
        }
    }

    if (currentStock === null) {
        return `Produk "${productName}" tidak ditemukan dalam daftar stok!`;
    }

    if (currentStock < quantitySold) {
        return `Stok tidak mencukupi! Tersedia hanya ${currentStock} unit dari ${quantitySold} unit yang ingin dijual.`;
    }

    try {
        // Simpan penjualan
        salesSheet.appendRow([new Date(), memberName, productName, quantitySold, totalPrice]);

        // Kurangi stok produk
        var newStock = currentStock - quantitySold;
        for (var i = 1; i < productData.length; i++) {
            if (productData[i][0] === productName) {
                productSheet.getRange(i + 1, 4).setValue(newStock);
                break;
            }
        }

        // Hapus order jika sudah terpenuhi
        var orderData = orderSheet.getDataRange().getValues();
        for (var i = 1; i < orderData.length; i++) {
            if (orderData[i][1] === memberName && orderData[i][2] === productName) {
                orderSheet.deleteRow(i + 1);
                break;
            }
        }

        return "Penjualan berhasil disimpan!";
    } catch (error) {
        Logger.log(`Terjadi kesalahan: ${error}`);
        return `Terjadi kesalahan saat menyimpan penjualan: ${error}`;
    }
}

function getSalesRecords() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PenjualanProdukAnggota");
    if (!sheet) return [];

    var data = sheet.getDataRange().getValues();
    var salesData = {};

    for (var i = 1; i < data.length; i++) {
        let date = Utilities.formatDate(new Date(data[i][0]), Session.getTimeZone(), "yyyy-MM-dd");
        let member = data[i][1];
        let product = data[i][2];
        let quantity = data[i][3];
        let totalPrice = data[i][4];

        if (!salesData[member]) {
            salesData[member] = {};
        }
        if (!salesData[member][date]) {
            salesData[member][date] = [];
        }
        salesData[member][date].push({ product, quantity, totalPrice });
    }

    return salesData;
}

function generateInvoice(memberName, transactionDate) {
    var salesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PenjualanProdukAnggota");
    if (!salesSheet) return "Sheet tidak ditemukan!";
    
    var data = salesSheet.getDataRange().getValues();
    var doc = DocumentApp.create(`Struk Penjualan - ${memberName} (${transactionDate})`);
    var body = doc.getBody();
    
    body.appendParagraph(`Struk Penjualan`).setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph(`Nama Anggota: ${memberName}`);
    body.appendParagraph(`Tanggal Transaksi: ${transactionDate}`);
    body.appendParagraph(`--------------------------------------`);
    
    var totalAmount = 0;
    
    for (var i = 1; i < data.length; i++) {
        let date = Utilities.formatDate(new Date(data[i][0]), Session.getTimeZone(), "yyyy-MM-dd");
        let member = data[i][1];
        let product = data[i][2];
        let quantity = data[i][3];
        let price = data[i][4];

        if (member === memberName && date === transactionDate) {
            body.appendParagraph(`${product} - ${quantity} unit - Rp${price}`);
            totalAmount += price;
        }
    }

    body.appendParagraph(`--------------------------------------`);
    body.appendParagraph(`Total Pembayaran: Rp${totalAmount}`);

    var fileUrl = doc.getUrl();
    return fileUrl;
}



//update fungsi laporan bulanan


function getMonthlyReport(month, year) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var reportSheet = ss.getSheetByName("LaporanBulanan");
    var purchaseSheet = ss.getSheetByName("PembelianBarang");
    var salesSheet = ss.getSheetByName("PenjualanProdukAnggota");
    var productSheet = ss.getSheetByName("Product_list");

    if (!purchaseSheet || !salesSheet || !productSheet || !reportSheet) {
        console.error("Salah satu sheet tidak ditemukan!");
        return { products: [], totalExpense: 0, totalRevenue: 0, profitLoss: 0, totalFinalStockPrice: 0 };
    }

    var productData = productSheet.getDataRange().getValues();
    var productUnits = {};
    var productPrices = {};

    for (var i = 1; i < productData.length; i++) {
        productUnits[productData[i][0]] = productData[i][2]; // UnitType
        productPrices[productData[i][0]] = Number(productData[i][1]) || 0; // Harga jual satuan
    }

    var report = { products: [], totalExpense: 0, totalRevenue: 0, profitLoss: 0, totalFinalStockPrice: 0 };
    var productInfo = {};

    var previousMonth = month === 1 ? 12 : month - 1;
    var previousYear = month === 1 ? year - 1 : year;
    var previousReportData = reportSheet.getDataRange().getValues();

    previousReportData.forEach(row => {
        let reportMonth = row[0];
        let reportYear = row[1];
        if (reportMonth == previousMonth && reportYear == previousYear) {
            let productName = row[2];
            let finalStock = (row[8]) || 0;
            let unitType = productUnits[productName] || "Unit Tidak Ditentukan";

            productInfo[productName] = {
                initialStock: finalStock,
                purchases: 0,
                purchaseCost: 0,
                sales: 0,
                salesRevenue: 0,
                unitType: unitType
            };
        }
    });

    // **Proses pembelian dan penjualan**
    var purchaseData = purchaseSheet.getDataRange().getValues();
    var salesData = salesSheet.getDataRange().getValues();

    for (var i = 1; i < purchaseData.length; i++) {
        let purchaseDate = new Date(purchaseData[i][0]);
        if (purchaseDate.getMonth() + 1 === month && purchaseDate.getFullYear() === year) {
            let productName = purchaseData[i][1];
            let quantity = Number(purchaseData[i][3]) || 0;
            let totalPrice = Number(purchaseData[i][4]) || 0;
            let unitType = productUnits[productName] || "Unit Tidak Ditentukan";

            if (!productInfo[productName]) {
                productInfo[productName] = { initialStock: 0, purchases: 0, purchaseCost: 0, sales: 0, salesRevenue: 0, unitType: unitType };
            }

            productInfo[productName].purchases += quantity;
            productInfo[productName].purchaseCost += totalPrice;
            report.totalExpense += totalPrice;
        }
    }

    for (var i = 1; i < salesData.length; i++) {
        let salesDate = new Date(salesData[i][0]);
        if (salesDate.getMonth() + 1 === month && salesDate.getFullYear() === year) {
            let productName = salesData[i][2];
            let quantity = Number(salesData[i][3]) || 0;
            let totalPrice = Number(salesData[i][4]) || 0;
            let unitType = productUnits[productName] || "Unit Tidak Ditentukan";

            if (!productInfo[productName]) {
                productInfo[productName] = { initialStock: 0, purchases: 0, purchaseCost: 0, sales: 0, salesRevenue: 0, unitType: unitType };
            }

            productInfo[productName].sales += quantity;
            productInfo[productName].salesRevenue += totalPrice;
            report.totalRevenue += totalPrice;
        }
    }

    // **Filter produk yang harus ditampilkan dalam laporan**
    Object.keys(productInfo).forEach(productName => {
        let item = productInfo[productName];
        let finalStock = item.initialStock + item.purchases - item.sales;
        let finalStockPrice = finalStock * (productPrices[productName] || 0);

        // **Hanya tambahkan produk yang memiliki stok awal, pembelian, atau penjualan**
        if ( item.purchases > 0 || item.sales > 0) {
            report.products.push({
                 product: productName,
            initialStock: `${item.initialStock} ${item.unitType}`,
            purchases: `${item.purchases} ${item.unitType}`,
            purchaseCost: item.purchaseCost,
            sales: `${item.sales} ${item.unitType}`,
            salesRevenue: item.salesRevenue,
            finalStock: `${finalStock} ${item.unitType}`
            });

            report.totalFinalStockPrice += finalStockPrice;
        }
    });

    report.profitLoss = report.totalRevenue + report.totalFinalStockPrice - report.totalExpense;


    Logger.log(report);
    return report;
}


function debugMonthlyReport() {
    var month = 5; // Ganti dengan bulan yang ingin diuji (1 = Januari, 12 = Desember)
    var year = 2025; // Ganti dengan tahun yang ingin diuji

    var report = getMonthlyReport(month, year);
    Logger.log(report); // Log hasil laporan untuk debugging
}

function saveMonthlyReport(month, year, report) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var reportSheet = ss.getSheetByName("LaporanBulanan") || ss.insertSheet("LaporanBulanan");

    // Pastikan sheet memiliki header jika kosong
    if (reportSheet.getLastRow() === 0) {
        reportSheet.appendRow(["Bulan", "Tahun", "Produk", "Stok Awal", "Pembelian (Jumlah)", "Pembelian (Harga)", "Penjualan (Jumlah)", "Penjualan (Harga)", "Stok Akhir"]);
    }

    // Simpan setiap produk dalam laporan
    report.products.forEach(item => {
        reportSheet.appendRow([
            month, 
            year, 
            item.product, 
            parseInt(item.initialStock), 
            parseInt(item.purchases), 
            item.purchaseCost, 
            parseInt(item.sales), 
            item.salesRevenue, 
            parseInt(item.finalStock)
        ]);
    });

    Logger.log("Laporan bulanan disimpan untuk " + month + "/" + year);
}

function autoSaveReport(){
  var today = new Date();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var report = getMonthlyReport(month, year);
  saveMonthlyReport(month, year, report);
}
function createMonthlyReportTrigger() {
  ScriptApp.newTrigger("autoSaveReport")
    .timeBased()
    .onMonthDay(28) // Menjalankan setiap tanggal 28 (agar aman untuk Februari)
    .atHour(23) // Pukul 23:00 WIB
    .create();
}





//riwayat penjualan ke anggota
function getMonthlySalesByMember(month, year) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var salesSheet = ss.getSheetByName("PenjualanProdukAnggota");
    var productSheet = ss.getSheetByName("Product_list");

    if (!salesSheet || !productSheet) {
        console.error("Salah satu sheet tidak ditemukan!");
        return [];
    }

    var salesData = salesSheet.getDataRange().getValues();
    var productData = productSheet.getDataRange().getValues();

    var productUnits = {}; // Simpan unitType berdasarkan nama produk
    for (var i = 1; i < productData.length; i++) {
        productUnits[productData[i][0]] = productData[i][2]; // Ambil unitType dari kolom ke-3
    }

    var memberSales = {}; // Gabungkan total penjualan per anggota

    // **Proses data penjualan**
    for (var i = 1; i < salesData.length; i++) {
        let salesDate = new Date(salesData[i][0]);
        if (isNaN(salesDate.getTime())) continue;

        if (salesDate.getMonth() + 1 === month && salesDate.getFullYear() === year) {
            let memberName = salesData[i][1];
            let productName = salesData[i][2];
            let quantity = parseInt(salesData[i][3]) || 0;
            let totalPrice = parseInt(salesData[i][4]) || 0;
            let unitType = productUnits[productName] || "Unit Tidak Ditentukan";

            if (!memberSales[memberName]) {
                memberSales[memberName] = { totalPurchase: 0, products: [] };
            }

            memberSales[memberName].products.push({
                product: productName,
                quantity: `${quantity} ${unitType}`,
                subtotal: totalPrice
            });

            memberSales[memberName].totalPurchase += totalPrice;
        }
    }

    // **Urutkan berdasarkan total pembelian terbanyak**
    let sortedMembers = Object.keys(memberSales)
        .map(member => ({
            member: member,
            totalPurchase: memberSales[member].totalPurchase,
            products: memberSales[member].products
        }))
        .sort((a, b) => b.totalPurchase - a.totalPurchase);

    Logger.log(sortedMembers);
    return sortedMembers;
}
//export laporan ke spreadsheet
function exportMonthlyReportToSpreadsheet(month, year) {
    var ss = SpreadsheetApp.create(`Laporan Bulanan ${month}-${year}`);
    var sheet = ss.getActiveSheet();
    sheet.appendRow(["Laporan Bulanan", `Bulan: ${month}`, `Tahun: ${year}`]);
    sheet.appendRow([""]);

    // **Tambahkan Laporan Pembelian**
    sheet.appendRow(["Laporan Pembelian"]);
    sheet.appendRow(["Produk", "Jumlah Dibeli", "Unit Type", "Total Harga"]);
    var purchaseData = getMonthlyReport(month, year).purchases;

    purchaseData.forEach(purchase => {
        sheet.appendRow([purchase.product, purchase.quantity.split(" ")[0], purchase.quantity.split(" ")[1], `Rp ${purchase.totalPrice.toLocaleString()}`]);
    });

    sheet.appendRow(["Total Pembelian", "", "", `Rp ${getMonthlyReport(month, year).totalExpense.toLocaleString()}`]);
    sheet.appendRow([""]);

    // **Tambahkan Laporan Penjualan**
    sheet.appendRow(["Laporan Penjualan"]);
    sheet.appendRow(["Produk", "Jumlah Terjual", "Unit Type", "Total Harga"]);
    var salesData = getMonthlyReport(month, year).sales;

    salesData.forEach(sale => {
        sheet.appendRow([sale.product, sale.quantity.split(" ")[0], sale.quantity.split(" ")[1], `Rp ${sale.totalPrice.toLocaleString()}`]);
    });

    sheet.appendRow(["Total Penjualan", "", "", `Rp ${getMonthlyReport(month, year).totalRevenue.toLocaleString()}`]);
    sheet.appendRow([""]);

    // **Tambahkan Keuntungan atau Kerugian**
    var profitLoss = getMonthlyReport(month, year).profitLoss;
    var status = profitLoss >= 0 ? "Selisih +" : "Selisih -";
    sheet.appendRow([status, "", "", `Rp ${Math.abs(profitLoss).toLocaleString()}`]);

    Logger.log(`Laporan telah diekspor ke spreadsheet: ${ss.getUrl()}`);
    return ss.getUrl();
}

//export laporan ke spreadsheet
function exportMonthlyReportToDocs(month, year) {
    var doc = DocumentApp.create(`Laporan Bulanan ${month}-${year}`);
    var body = doc.getBody();

    body.appendParagraph(`Laporan Bulanan - ${month}/${year}`).setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph("").setHeading(DocumentApp.ParagraphHeading.NORMAL);

    // **Tambahkan Laporan Pembelian**
    body.appendParagraph("Laporan Pembelian").setHeading(DocumentApp.ParagraphHeading.HEADING2);
    var purchaseData = getMonthlyReport(month, year).purchases;

    purchaseData.forEach(purchase => {
        body.appendParagraph(`${purchase.product}: ${purchase.quantity} - Rp ${purchase.totalPrice.toLocaleString()}`);
    });

    body.appendParagraph(`Total Pembelian: Rp ${getMonthlyReport(month, year).totalExpense.toLocaleString()}`);
    body.appendParagraph("");

    // **Tambahkan Laporan Penjualan**
    body.appendParagraph("Laporan Penjualan").setHeading(DocumentApp.ParagraphHeading.HEADING2);
    var salesData = getMonthlyReport(month, year).sales;

    salesData.forEach(sale => {
        body.appendParagraph(`${sale.product}: ${sale.quantity} - Rp ${sale.totalPrice.toLocaleString()}`);
    });

    body.appendParagraph(`Total Penjualan: Rp ${getMonthlyReport(month, year).totalRevenue.toLocaleString()}`);
    body.appendParagraph("");

    // **Tambahkan Keuntungan atau Kerugian**
    var profitLoss = getMonthlyReport(month, year).profitLoss;
    var status = profitLoss >= 0 ? "Keuntungan" : "Kerugian";
    body.appendParagraph(`${status}: Rp ${Math.abs(profitLoss).toLocaleString()}`);

    doc.saveAndClose();
    Logger.log(`Laporan telah diekspor ke Google Docs: ${doc.getUrl()}`);
    return doc.getUrl();
}



