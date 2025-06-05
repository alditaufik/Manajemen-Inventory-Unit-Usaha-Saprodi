# Aplikasi Manajemen Inventory Unit Usaha Saprodi Koperasi Produsen Najafarm Berkah
Ini adalah proyek aplikasi web berbasis google appcript yang saya buat dan saya gunakan untuk membantu pekerjaan saya dalam mengelola inventori unit usaha saprodi koperasi produsen najafarm berkah.

![Cuplikan layar 2025-06-05 103342](https://github.com/user-attachments/assets/276c8076-fe4a-467e-bf10-0fb0e444491c)

data yang ditampilkan dalam screenshoot adalah dummy untuk test aplikasi


## Kenapa menggunakan Appscript?
- sesuai dengan kebutuhan pendataan yang tidak begitu kompleks namun mampu melakukan pekejaan repetitif seperti menghitung stok dan membuat lapran bulanan menjadi otomatis
- tidak rumit dalam pembuatan karena hanya menggunakan HTML, css bootstrap dan javacript pada frontend dan untuk backend menggunakan javascript dan kode appcript.
- tentu saja gratis.

## Fitur
- Mengelola stok inventori (menambahkan nama barang, harga jual satuan, unit type) ![Cuplikan layar 2025-06-05 110248](https://github.com/user-attachments/assets/7c62468b-5228-48df-ab92-73173fdbec06)

  
- Melakukan penambahan stok melalui pembelian ![Cuplikan layar 2025-06-05 110427](https://github.com/user-attachments/assets/fbea9e3b-56db-44af-bb91-43f05ae35771)

- Melacak pengurangan stok akibat penjualan  ![Cuplikan layar 2025-06-05 110356](https://github.com/user-attachments/assets/a0ab9917-3959-4400-8fba-f050f8632ae2)

- Melacak order anggota untuk saran pembelian barang ![Cuplikan layar 2025-06-05 110337](https://github.com/user-attachments/assets/64754113-1f31-476a-83a0-48cb446f1dfd)

- dashboard untuk melihat pergerakan stok secara realtime pada bulan berjalan ![Cuplikan layar 2025-06-05 111822](https://github.com/user-attachments/assets/4f7fa837-3110-4787-a50d-d770b35ad73b)


## Instalasi
- buat 1 file google spreadsheet yang  terdiri dari beberapa sheet
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
