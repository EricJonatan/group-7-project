import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { money } from '../data.js';
import { BankTransferInfo } from '../components/BankTransferInfo.jsx';

export function Success() {
  let receipt;
  try {
    receipt = JSON.parse(sessionStorage.getItem('labuibu-receipt'));
  } catch {}
  if (!receipt) return <Navigate to="/produk" replace />;
  const bankTransfer =
    (receipt.paymentMethod || (receipt.demo ? 'bank_transfer' : undefined)) === 'bank_transfer';
  return (
    <main className="page success-page">
      <CheckCircle2 size={48} strokeWidth={1.3} />
      <span className="eyebrow">{receipt.demo ? 'SIMULASI SELESAI' : 'PESANAN DITERIMA'}</span>
      <h1>
        Pesananmu
        <br />
        <em>sudah masuk.</em>
      </h1>
      <p>
        {receipt.demo
          ? 'Pesanan demo berhasil dibuat. Tidak ada pembayaran atau pengiriman sungguhan.'
          : bankTransfer
            ? 'Lanjutkan pembayaran sesuai instruksi untuk memproses pesananmu.'
            : 'Terima kasih sudah memilih Labuibu. Penjual akan mengonfirmasi pesananmu.'}
      </p>
      <div className="receipt">
        <span>
          {receipt.demo ? 'NOMOR DEMO' : 'NOMOR PESANAN'} · {receipt.id}
        </span>
        {receipt.items.map((i, index) => (
          <div className="summary-row" key={index}>
            <span>
              {i.quantity} × {i.name}
            </span>
            <span>
              <span className="price-amount">{money(i.quantity * i.price)}</span>
            </span>
          </div>
        ))}
        <div className="summary-row">
          <span>Ongkir</span>
          <span>
            <span className="price-amount">
              {money(
                receipt.shipping ??
                  receipt.total - receipt.items.reduce((sum, i) => sum + i.quantity * i.price, 0),
              )}
            </span>
          </span>
        </div>
        <div className="summary-total">
          <span>Total pembayaran</span>
          <strong>
            <span className="price-amount">{money(receipt.total)}</span>
          </strong>
        </div>
      </div>
      {bankTransfer && <BankTransferInfo total={receipt.total} />}
      <Link to="/pesanan-saya" className="button">
        Lihat pesanan saya <ArrowRight size={17} />
      </Link>
    </main>
  );
}
