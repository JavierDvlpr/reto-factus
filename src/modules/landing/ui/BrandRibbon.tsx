export default function BrandRibbon() {
  const brands = ["APPLE", "ASUS ROG", "NVIDIA", "SONY", "SAMSUNG", "LOGITECH"];
  return (
    <section className="bg-black text-white py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-8 sm:gap-12 opacity-90">
          {brands.map((brand, i) => (
            <span
              key={brand}
              className={`font-extrabold text-2xl sm:text-3xl tracking-widest ${
                i % 3 === 0 ? "font-serif" : i % 3 === 1 ? "font-mono" : "font-sans"
              } ${i >= 5 ? "hidden md:inline" : ""}`}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
