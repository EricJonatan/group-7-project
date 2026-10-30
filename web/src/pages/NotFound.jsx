import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Empty } from '../components/Commerce.jsx';

export function NotFound() {
  return (
    <main className="page">
      <Empty
        title="Sepertinya salah dapur."
        text="Halaman yang kamu cari belum tersedia."
        action={
          <Link to="/" className="button">
            Kembali ke Home <ArrowRight size={17} />
          </Link>
        }
      />
    </main>
  );
}
