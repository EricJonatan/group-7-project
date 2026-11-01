import { money } from '../data.ts';
import { demoBankAccount } from '@labuibu/contracts';

export function BankTransferInfo({ total }: { total: number }) {
  return (
    <section className="bank-transfer-info" aria-label="Informasi transfer bank">
      <span className="bank-label">TRANSFER BANK · REKENING DUMMY</span>
      <h2>Transfer ke rekening BCA</h2>
      <dl>
        <div>
          <dt>Nomor rekening</dt>
          <dd className="bank-account-number">{demoBankAccount.accountNumber}</dd>
        </div>
        <div>
          <dt>Atas nama</dt>
          <dd>{demoBankAccount.accountHolder}</dd>
        </div>
        <div className="bank-payment-total">
          <dt>Jumlah pembayaran</dt>
          <dd>
            <span className="price-amount">{money(total)}</span>
          </dd>
        </div>
      </dl>
      <p>Rekening contoh untuk simulasi. Tidak perlu melakukan transfer.</p>
    </section>
  );
}
