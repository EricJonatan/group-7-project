import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Leaf, PackageCheck } from 'lucide-react';
import { useShop } from '../store.tsx';
import { money } from '../data.ts';
import { Pumpkin } from '../components/Brand.tsx';
import { CatalogState, Grid } from '../components/ProductGrid.tsx';

export function Home() {
  const { products, loading, catalogError } = useShop();
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> ANEKA CEMILAN LABU PREMIUM
          </div>
          <h1>
            <span className="home-headline">
              Cemilan enak
              <br className="desktop-headline-break" /> dan sehat?
            </span>
            <br />
            <em>Ya, Labuibu!</em>
          </h1>
          <p>
            Berbahan utama labu asli premium, tanpa perasa buatan. Dari keripik, kukis, dan biji
            labu panggang sampai puding dan jajanan tradisional.
          </p>
          <Link to="/produk" className="button">
            Belanja Camilan <ArrowRight size={17} />
          </Link>
          <div className="hero-footnote">
            <span className="little-star">✳</span>{' '}
            {products.length > 0 ? (
              <>
                <span className="price-amount">
                  {money(Math.min(...products.map((p) => p.price)))}
                </span>{' '}
                · Banyak pilihan rasa
              </>
            ) : (
              'Pilih rasa dan porsi sesuai seleramu'
            )}
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="/images/hero-assortment.jpg"
            alt="Ilustrasi aneka camilan: donat, keripik, kukis, dan bolu tersusun di meja"
            fetchPriority="high"
          />
          <div className="hero-stamp">
            <span>LABU ASLI</span>
            <Pumpkin />
            <span>PREMIUM</span>
          </div>
          <div className="hero-caption">
            <span>CAMILAN LABUIBU</span>
            <span>Pilih yang gurih atau manis.</span>
          </div>
        </div>
        <div className="vertical-label">PUMPKIN CHIPS, DONUTS & CAKE.</div>
      </section>
      <section className="trust-strip" aria-label="Nilai Labuibu">
        <div>
          <Leaf size={27} strokeWidth={1.3} />
          <p>
            Labu asli premium<strong>Bahan utama pilihan Labuibu</strong>
          </p>
        </div>
        <div>
          <Heart size={27} strokeWidth={1.3} />
          <p>
            Tanpa perasa buatan<strong>Rasa dari bahan yang digunakan</strong>
          </p>
        </div>
        <div>
          <PackageCheck size={27} strokeWidth={1.3} />
          <p>
            Banyak pilihan rasa<strong>Dari gurih original sampai cokelat</strong>
          </p>
        </div>
        <span className="trust-flower">✳</span>
      </section>
      <section className="section favorites-section">
        <div className="section-heading">
          <div>
            <h2>
              Mau ngemil <em>apa?</em>
            </h2>
          </div>
          <Link className="text-link desktop-collection-link" to="/produk">
            Lihat semua camilan <ArrowRight size={18} />
          </Link>
        </div>
        {loading || catalogError ? <CatalogState /> : <Grid products={products.slice(0, 8)} />}
        <Link className="button mobile-collection-link" to="/produk">
          Lihat semua camilan <ArrowRight size={17} />
        </Link>
      </section>
      <section className="editorial" id="cerita">
        <div className="editorial-image">
          <img
            src="/images/story.jpg"
            alt="Labu segar sebagai bahan utama camilan rumahan"
            loading="lazy"
          />
          <span>BAHAN UTAMA · LABU KUNING</span>
        </div>
        <div className="editorial-copy">
          <div className="eyebrow">
            <span /> KENAPA LABUIBU?
          </div>
          <h2>
            Enak pilihannya.
            <br />
            <em>Jelas bahannya.</em>
          </h2>
          <p>
            Mau yang gurih? Ada keripik original, balado, keju, dan rumput laut. Suka manis? Pilih
            donat, bolu, brownies, atau muffin labu.
          </p>
          <p>
            Kenali bahan yang kamu makan. Setiap produk dilengkapi komposisi, informasi alergen, dan
            ukuran kemasan. Pilih rasa dan porsi sesuai kebutuhanmu.
          </p>
          <Link to="/dapur-labuibu" className="text-link">
            Kenali Bahan & Proses Kami <ArrowRight size={18} />
          </Link>
          <span className="editorial-flower">✳</span>
        </div>
      </section>
      <section className="closing">
        <span className="eyebrow">GURIH ATAU MANIS, TINGGAL PILIH</span>
        <h2>
          <span className="home-headline">Cemilan enak dan sehat?</span>
          <br />
          <em>Ya, Labuibu!</em>
        </h2>
        <Link className="button" to="/produk">
          Pilih Varian Favoritmu <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}
