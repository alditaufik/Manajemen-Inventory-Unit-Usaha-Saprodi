# Aplikasi Manajemen Inventory Unit Usaha Saprodi Koperasi Produsen Najafarm Berkah
Ini adalah proyek aplikasi web berbasis google appcript yang saya buat dan saya gunakan untuk membantu pekerjaan saya dalam mengelola inventori unit usaha saprodi koperasi produsen najafarm berkah.

## Kenapa menggunakan Appscript?
- sesuai dengan kebutuhan aplikasi yang tidak begitu kompleks.
- tidak rumit dalam pembuatan karena hanya menggunakan javacript dan kode appcript sebagai frontend maupun backend.
- tentu saja gratis.

## Fitur
- Mengelola stok inventori (menambahkan nama barang, harga jual satuan, unit type)
- Melakukan penambahan stok melalui pembelian
- Melacak pengurangan stok akibat pembeelian
- Melacak order anggota untuk saran pembelian barang

## Instalasi
- buat 1 file spreadsheet yang  terdiri dari beberapa sheet
  -  sheet Product_list dengan kolom Nama barang,	harga satuan,	satuan,	Stok Tersedia.
  -  sheet Anggota_Koperasi dengan kolom Nama Lengkap,	No HP, 	Alamat.
  -  sheet OrderSaprodiAnggota dengan kolom Tanggal Order,	Nama Anggota,	Produk order,	Jumlah Order.
  -  sheet PembelianBarang dengan kolom tanggal beli,	nama produk,	nama penyedia barang,	jumlah beli,	total harga beli.
  -  sheet PenjualanProdukAnggota dengan kolom Tanggal,	Nama Anggota,	Nama Produk,	Jumlah pembelian,	Total harga.
  -  sheet LaporanBulanan dengan kolom Bulan,	Tahun,	Produk,	Stok Awal,	Pemeblian (jumlah),	pembelian (harga),	Penjualan (jumlah),	Penjualan (Harga),	Stok Akhir,
- buat 1 proyek google appcript baru. pada google spreadsheet klik menu ekstensi, dan pilih appcript.
- copy file kode.gs yang akan berfungsi sebagai backend dan index.html yang akan berfungsi sebagai frontend aplikasi kedalam proyek
- lakukan deployment sebagai aplikasi web dan aplikasi siap digunakan.
anda dapat melakukan beberapa perubahan pada kode untuk menyesuaikan dengan kebutuhan
