"use client";

type SpecialHeroProps = {
  name?: string;
};

export default function SepcialHero({ name = "Partner" }: SpecialHeroProps) {
    const handleScroll = (id : string)=>{
       const element = document.getElementById(id)
       element?.scrollIntoView({
        block : "start",
        behavior : "smooth"
       })
    }
  return (
    <section className="relative flex h-[600px] w-full items-center overflow-hidden bg-[#eeeee9] px-6 md:h-[820px] md:px-12">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKR1uYLal6X-2cyAJT2IYqL1SS3XLaWI66TrgW08e8TiHWoCHQk7AFs69Ta6-dtIMycTile33mMTK8VqISgMPfRX0iDt_0yq37C3oy75odMMekJgl9af10a1100OOLTS6xyBT8rUFSRmYreiYvv4yOt-1L1Ap9xr9LpfWVS7ZohZafF0lIa2FMiWDdYo5NE_MvW_0frCtYzeD4JWyk2vneoznOgaw9Tw7ZvCvtzGU-_GOiJg4lYGkEmR2iuJmFFzaCKWOMpvg6eEM"
        alt="Luxurious silk drape"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#fafaf5] via-[#fafaf5]/50 to-transparent" />

      <div className="relative z-10 max-w-2xl">
        <p
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Private Partner Access
        </p>

        <h2
          className="mb-6 text-4xl leading-[1.05] text-[#01010f] md:text-6xl"
          style={{ fontFamily: "Newsreader, Georgia, serif" }}
        >
          Welcome back, <br />
          <span className="text-[#6a5d3e]">{name}.</span>
        </h2>

        <p
          className="mb-10 max-w-md text-base font-light leading-relaxed text-slate-500 md:text-lg"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Exclusive access to curated collections reserved for your private
          studio. Explore the season&apos;s rarest weaves.
        </p>

        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <button
          onClick={()=>handleScroll("special-new-arrivals")}
            className="rounded-sm bg-[#01010f] px-8 py-4 text-[11px] uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#1a1b2e]"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Explore New Arrivals
          </button>
          <a
            href="/special/products"
            className="border-b border-[#01010f] px-2 py-1 text-lg text-[#01010f] transition-all duration-300 hover:pl-4"
            style={{ fontFamily: "Newsreader, Georgia, serif" }}
          >
            Continue Your Collection
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 right-12 hidden items-center gap-4 md:flex">
        <div className="h-px w-16 bg-slate-300" />
        <p
          className="text-[10px] uppercase tracking-[0.3em] text-slate-400"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Season Archive 2024
        </p>
      </div>
    </section>
  );
}
