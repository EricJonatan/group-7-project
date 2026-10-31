import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, HandHeart, House, Wheat } from 'lucide-react';
import './about.css';
const values = [
  { Icon: Wheat, title: 'Labu asli premium', text: 'Dibeli langsung dari petani labu.' },
  { Icon: Leaf, title: 'Tanpa perasa buatan', text: 'Rasa dari bahan-bahan alami.' },
  { Icon: HandHeart, title: 'Dibuat dengan tangan', text: 'Disiapkan dan dibentuk satu per satu.' },
  { Icon: House, title: 'Dari dapur rumah', text: 'Diolah sesuai resep setiap cemilan.' },
];
const steps = [
  {
    number: '01',
    title: 'Pilih labu',
    text: 'Labu premium dibeli langsung dari petani, lalu diperiksa sebelum diolah.',
  },
  {
    number: '02',
    title: 'Siapkan bahan',
    text: 'Labu dicuci, dikupas, dan disiapkan. Bahan alami lainnya ditimbang sesuai resep.',
  },
  {
    number: '03',
    title: 'Olah dengan tangan',
    text: 'Adonan dicampur, dibagi, dan dibentuk dengan tangan, lalu dimasak sesuai jenis cemilan.',
  },
  {
    number: '04',
    title: 'Periksa & kemas',
    text: 'Hasil olahan diperiksa dan dikemas. Penyimpanan serta pengiriman mengikuti kebutuhan produknya.',
  },
];
export default function About() {
  return (
    <main className="page kitchen-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span aria-current="page">Dapur Labuibu</span>
      </div>
      <section className="kitchen-intro" aria-labelledby="kitchen-title">
        <div className="kitchen-copy">
          <span className="eyebrow">DAPUR LABUIBU</span>
          <h1 id="kitchen-title">
            Dari petani labu.
            <br />
            <em>Dibuat di rumah.</em>
          </h1>
          <p>Berbahan utama labu asli premium, tanpa perasa buatan.</p>
          <p>
            Kami membeli labu langsung dari petani dan mengolahnya di dapur rumah. Bahan-bahan alami
            disiapkan dengan tangan menjadi cemilan yang kamu suka.
          </p>
          <Link className="button" to="/produk">
            Pilih Cemilanmu <ArrowRight size={17} />
          </Link>
        </div>
        <figure className="kitchen-photo">
          <img src="/images/story.jpg" alt="Ilustrasi tangan menyiapkan labu segar di dapur" />
          <figcaption>
            Foto ilustrasi, bukan dokumentasi dapur atau petani mitra Labuibu.
          </figcaption>
        </figure>
      </section>
      <section className="kitchen-values" aria-label="Bahan dan cara membuat">
        {values.map(({ Icon, title, text }) => (
          <article key={title}>
            <Icon size={22} strokeWidth={1.5} />
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="kitchen-process" aria-labelledby="process-title">
        <div className="kitchen-section-heading">
          <span className="eyebrow">PROSES PEMBUATAN</span>
          <h2 id="process-title">Empat langkah dari dapur kami.</h2>
          <p>Bahan pilihan dan sentuhan tangan di setiap tahap.</p>
        </div>
        <div className="kitchen-steps">
          {steps.map((step) => (
            <article key={step.number}>
              <span className="kitchen-step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="kitchen-info">
        <div>
          <span className="eyebrow">PILIH DENGAN INFORMASI YANG JELAS</span>
          <h2>Kenali bahan sebelum membeli.</h2>
          <p>
            Komposisi, alergen, dan petunjuk penyimpanan tersedia di halaman produk. Pilih jenis dan
            varian yang sesuai untukmu.
          </p>
        </div>
        <Link className="button outline" to="/produk">
          Lihat Semua Produk <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}
