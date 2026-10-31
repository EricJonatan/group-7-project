import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function AccountMenu() {
  return (
    <div className="account-menu">
      <Link className="mobile-account-item" to="/pesanan-saya">
        <span>
          Pesanan saya<small>Lihat pesanan dan informasi pembayaran.</small>
        </span>
        <ArrowRight size={18} />
      </Link>
      <Link className="mobile-account-item" to="/favorit">
        <span>
          Cemilan favorit<small>Cemilan yang sudah kamu simpan.</small>
        </span>
        <ArrowRight size={18} />
      </Link>
      <Link to="/dapur-labuibu">
        <span>
          Dapur Labuibu<small>Kenali bahan dan proses pembuatan kami.</small>
        </span>
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
