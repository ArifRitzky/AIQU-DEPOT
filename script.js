// --- 1. KONFIGURASI HARGA & GAJI ---
const HARGA_AQUA = 5000;
const HARGA_LEMINERALE = 4000;
const HARGA_GALON_KOSONG = 45000;
const GAJI_ABI_PER_ITEM = 1000;
const GAJI_BILA_PER_ITEM = 2000;

// ⚠️ WAJIB GANTI DENGAN LINK KAMU:
const scriptURL = 'https://script.google.com/macros/s/AKfycbwvVSi2FrACWtnnBMYgRVFCAQ20q1h2RP0k94aSd4UtTKleFcZEjvciyaxGQXmpVMwwjg/exec';

// --- 2. NAVIGASI, GEMBOK PIN, & FITUR SAPU BERSIH ---
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.form-section');

function pindahMenu(btnId) {
    // Sapu Bersih Data Sebelumnya (Biar Aman & Rapi!)
    document.getElementById('hasil-ringkasan').style.display = 'none';
    document.getElementById('hasil-laporan').style.display = 'none';
    document.getElementById('bulan_ringkasan').value = '';
    document.getElementById('input_tgl_laporan').value = '';
    document.getElementById('input_bln_laporan').value = '';

    navLinks.forEach(l => l.classList.remove('active'));
    document.getElementById(btnId).classList.add('active');
    
    sections.forEach(sec => sec.classList.remove('active'));
    const target = btnId.replace('btn-', 'form-');
    document.getElementById(target).classList.add('active');
}

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        if (this.id === 'btn-ringkasan') {
            document.getElementById('popup-pin').style.display = 'flex';
            document.getElementById('input-pin').value = ''; 
            return; 
        }
        pindahMenu(this.id);
    });
});

document.getElementById('btn-submit-pin').addEventListener('click', function() {
    const pin = document.getElementById('input-pin').value;
    if (pin === '2133') {
        document.getElementById('popup-pin').style.display = 'none'; 
        pindahMenu('btn-ringkasan'); 
    } else {
        alert('PIN Salah! Hayo mau ngintip ya? 💀');
        document.getElementById('input-pin').value = ''; 
    }
});

// --- 3. PREVIEW OTOMATIS (TANPA POTONG GAJI DI LAYAR) ---
const inputsPenjualan = ['qty_aqua', 'qty_leminerale', 'qty_botol_galon', 'cash_out'];
inputsPenjualan.forEach(id => {
    document.getElementById(id).addEventListener('input', hitungPreview);
});

function hitungPreview() {
    let qtyAqua = Number(document.getElementById('qty_aqua').value) || 0;
    let qtyLeMin = Number(document.getElementById('qty_leminerale').value) || 0;
    let qtyGalon = Number(document.getElementById('qty_botol_galon').value) || 0;
    let cashOut = Number(document.getElementById('cash_out').value) || 0;

    let ketOpsInput = document.getElementById('ket_ops');
    if (cashOut > 0) {
        ketOpsInput.required = true;
        ketOpsInput.placeholder = "Wajib diisi! Contoh: Beli Bensin";
    } else {
        ketOpsInput.required = false;
        ketOpsInput.placeholder = "Opsional (Wajib jika ada Ops)";
    }

    let totalQty = qtyAqua + qtyLeMin + qtyGalon;
    let totalOmset = (qtyAqua * HARGA_AQUA) + (qtyLeMin * HARGA_LEMINERALE) + (qtyGalon * HARGA_GALON_KOSONG);
    
    // SISA KAS MURNI UNTUK TAMPIL DI LAYAR (Omset - Ops saja)
    let sisaKasTampil = totalOmset - cashOut;

    // GAJI DIHITUNG DIAM-DIAM UNTUK EXCEL
    let totalGaji = totalQty * (GAJI_ABI_PER_ITEM + GAJI_BILA_PER_ITEM);
    let labaBersihDapur = totalOmset - cashOut - totalGaji;

    document.getElementById('preview-omset').innerText = 'Rp ' + totalOmset.toLocaleString('id-ID');
    document.getElementById('preview-owner').innerText = 'Rp ' + sisaKasTampil.toLocaleString('id-ID');

    return { totalQty, totalOmset, sisaKasTampil, labaBersihDapur };
}

// --- 4. KIRIM DATA KE GOOGLE EXCEL ---
function kirimData(formId, tipeForm, textButton) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.innerHTML = '⏳ Tunggu Bentar...';
        btn.disabled = true;

        const data = new FormData();
        data.append('tipe_form', tipeForm);

        if (tipeForm === 'penjualan') {
            const h = hitungPreview();
            data.append('tanggal', document.getElementById('tanggal_jual').value);
            data.append('aqua', document.getElementById('qty_aqua').value || 0);
            data.append('leminerale', document.getElementById('qty_leminerale').value || 0);
            data.append('galon', document.getElementById('qty_botol_galon').value || 0);
            data.append('cashout', document.getElementById('cash_out').value || 0);
            data.append('ket_ops', document.getElementById('ket_ops').value || "");
            
            data.append('qty', h.totalQty);
            data.append('omset', h.totalOmset);
            data.append('gaji_abi', h.totalQty * GAJI_ABI_PER_ITEM);
            data.append('gaji_bila', h.totalQty * GAJI_BILA_PER_ITEM);
            
            // Yang dikirim ke Excel adalah Laba Bersih yang sudah dipotong gaji
            data.append('laba_owner', h.labaBersihDapur); 
        } 
        else if (tipeForm === 'kasbon') {
            data.append('tanggal', document.getElementById('tanggal_kasbon').value);
            data.append('nama', document.getElementById('nama_karyawan').value);
            data.append('nominal', document.getElementById('nominal_kasbon').value || 0);
            data.append('keterangan', document.getElementById('keterangan_kasbon').value || "");
        } 
        else if (tipeForm === 'hapus_kasbon') {
            data.append('tanggal', document.getElementById('tanggal_hapus').value);
            data.append('nama', document.getElementById('nama_hapus').value);
        }

        fetch(scriptURL, { method: 'POST', body: data })
            .then(res => {
                document.getElementById('popup-sukses').style.display = 'flex';
                form.reset();
                if (tipeForm === 'penjualan') hitungPreview();
                btn.innerHTML = textButton;
                btn.disabled = false;
            })
            .catch(err => {
                alert('Gagal: ' + err.message);
                btn.innerHTML = textButton;
                btn.disabled = false;
            });
    });
}

kirimData('formDataPenjualan', 'penjualan', 'Simpan Penjualan 🎀');
kirimData('formDataKasbon', 'kasbon', 'Simpan Kasbon 📝');
kirimData('formDataHapus', 'hapus_kasbon', 'Hapus Data 🗑️');

// --- 5. LOGIKA MENU LAPORAN (HARIAN vs BULANAN) ---
document.getElementById('tipe_laporan').addEventListener('change', function() {
    if (this.value === 'harian') {
        document.getElementById('input_tgl_laporan').style.display = 'inline-block';
        document.getElementById('input_bln_laporan').style.display = 'none';
    } else {
        document.getElementById('input_tgl_laporan').style.display = 'none';
        document.getElementById('input_bln_laporan').style.display = 'inline-block';
    }
});

// --- 6. TOMBOL TARIK DATA (RINGKASAN INTERNAL) ---
document.getElementById('btn-tarik-ringkasan').addEventListener('click', function() {
    const bulan = document.getElementById('bulan_ringkasan').value;
    if (!bulan) return alert("Pilih bulannya dulu ya! 🎀");
    
    const btn = this;
    btn.innerHTML = '⏳ Cek Dapur...'; btn.disabled = true;

    fetch(scriptURL + '?tipe=ringkasan&bulan=' + bulan)
        .then(res => res.json())
        .then(data => {
            btn.innerHTML = 'Cek Dapur 🎀'; btn.disabled = false;
            if (data.status === 'kosong') return alert(data.pesan);
            
            document.getElementById('dash-omset').innerText = data.omset || 'Rp 0';
            document.getElementById('dash-abi').innerText = data.abi || 'Rp 0';
            document.getElementById('dash-bila').innerText = data.bila || 'Rp 0';
            document.getElementById('dash-laba-owner').innerText = data.laba_owner || 'Rp 0';
            document.getElementById('hasil-ringkasan').style.display = 'block';
        }).catch(err => { alert('Gagal narik data!'); btn.innerHTML = 'Cek Dapur 🎀'; btn.disabled = false; });
});

// --- 7. TOMBOL TARIK DATA (LAPORAN OWNER) ---
document.getElementById('btn-tarik-laporan').addEventListener('click', function() {
    const tipe = document.getElementById('tipe_laporan').value;
    const tgl = document.getElementById('input_tgl_laporan').value;
    const bln = document.getElementById('input_bln_laporan').value;

    let param = `?tipe=laporan_${tipe}`;
    if (tipe === 'harian' && !tgl) return alert("Pilih tanggalnya dulu! 🎀");
    if (tipe === 'bulanan' && !bln) return alert("Pilih bulannya dulu! 🎀");

    param += (tipe === 'harian') ? `&tanggal=${tgl}` : `&bulan=${bln}`;

    const btn = this;
    btn.innerHTML = '⏳ Menyiapkan...'; btn.disabled = true;

    fetch(scriptURL + param)
        .then(res => res.json())
        .then(data => {
            btn.innerHTML = 'Lihat Laporan 🎀'; btn.disabled = false;
            if (data.status === 'kosong') return alert(data.pesan);
            
            document.getElementById('lap-aqua').innerText = data.aqua || '0';
            document.getElementById('lap-lemin').innerText = data.lemin || '0';
            document.getElementById('lap-galon').innerText = data.galon || '0';
            document.getElementById('lap-omset-owner').innerText = data.omset || 'Rp 0';
            document.getElementById('lap-ops-owner').innerText = data.ops || 'Rp 0';
            document.getElementById('lap-sisa-owner').innerText = data.sisa_kas || 'Rp 0';

            document.getElementById('hasil-laporan').style.display = 'block';
        }).catch(err => { alert('Gagal narik data!'); btn.innerHTML = 'Lihat Laporan 🎀'; btn.disabled = false; });
});