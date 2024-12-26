import { Head } from "@inertiajs/react";
import { Hero } from "@/Components/landing-page/Hero";
import { HowItWorks } from "@/Components/landing-page/HowItWorks";
import { FAQ } from "@/Components/landing-page/FAQ";
import { Team } from "@/Components/landing-page/Team";
import { Testimonials } from "@/Components/landing-page/Testimonials";
import { Footer } from "@/Components/landing-page/Footer";
import { Navbar } from "@/Components/landing-page/Navbar";
import { About } from "@/Components/landing-page/About";
import { Features } from "@/Components/landing-page/Features";
import { Services } from "@/Components/landing-page/Services";
import { Cta } from "@/Components/landing-page/Cta";
import { ScrollToTop } from "@/Components/landing-page/ScrollToTop";

export default function Welcome() {
  return (
    <>
      <Head title="Welcome" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Features />
        <Services />
        <Cta />
        <Testimonials />
        <Team />
        <FAQ />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
