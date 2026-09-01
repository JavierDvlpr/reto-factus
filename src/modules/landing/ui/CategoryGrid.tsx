import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    label: "Gaming",
    href: "/productos?cat=Laptops",
    image: "/images/category_gaming.jpg",
    alt: "Equipos para Gaming y Streaming",
    span: "md:col-span-5",
  },
  {
    label: "Productividad",
    href: "/productos?cat=Monitores",
    image: "/images/category_office.jpg",
    alt: "Oficina y Productividad Profesional",
    span: "md:col-span-7",
  },
  {
    label: "Audio & Hi-Fi",
    href: "/productos?cat=Audio",
    image: "/images/category_audio.jpg",
    alt: "Audio profesional y auriculares",
    span: "md:col-span-7",
  },
  {
    label: "Periféricos",
    href: "/productos?cat=Periféricos",
    image: "/images/category_peripherals.jpg",
    alt: "Teclados mecánicos y periféricos",
    span: "md:col-span-5",
  },
];

export default function CategoryGrid() {
  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-[#F0F0F0] rounded-[32px] sm:rounded-[40px] p-6 sm:p-14">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black font-sans">
            Explora por estilo tecnológico
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {categories.map(({ label, href, image, alt, span }) => (
            <Link
              key={label}
              href={href}
              className={`${span} group relative h-[240px] sm:h-[290px] rounded-[24px] bg-black overflow-hidden p-6 flex flex-col justify-between hover:shadow-xl transition-all`}
            >
              <span className="font-extrabold text-2xl sm:text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] z-10">
                {label}
              </span>
              <Image
                src={image}
                alt={alt}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
