import { Head } from "@inertiajs/react";
import { Hero } from "@/Components/landing-page/Hero";
import { FAQ } from "@/Components/landing-page/FAQ";
import { Testimonials } from "@/Components/landing-page/Testimonials";
import { Footer } from "@/Components/landing-page/Footer";
import { Navbar } from "@/Components/landing-page/Navbar";
import { About } from "@/Components/landing-page/About";
import { Cta } from "@/Components/landing-page/Cta";
import { ScrollToTop } from "@/Components/landing-page/ScrollToTop";
import { Features } from "@/Components/landing-page/Features";

export default function Home() {
  return (
    <>
      <Head title="Home" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Testimonials />
        <FAQ />
        <Cta />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
