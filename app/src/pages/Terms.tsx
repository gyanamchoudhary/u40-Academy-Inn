import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#102235]">
      <Header forceScrolled />
      <main id="main-content" className="mx-auto max-w-[90rem] px-5 pb-20 pt-28 sm:px-8 sm:py-32 lg:px-10">
        <h1 className="text-[2.75rem] font-semibold tracking-[-0.04em] sm:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-[#60646c]">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>

        <section className="mt-10 max-w-3xl space-y-6 text-base leading-7 text-[#33373f] sm:mt-12">
          <p>
            By using the U40 Academy Inn website, you agree to these terms. If you do not agree, please do not use the site.
          </p>

          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Website use</h2>
          <p>
            The content on this website is for general information and admission inquiry purposes only. We may update information at any time without notice.
          </p>

          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Admission inquiries</h2>
          <p>
            Submitting an online inquiry does not guarantee admission or a residential seat. Final admission is completed only after document verification, counselling, and fee payment at the campus.
          </p>

          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Intellectual property</h2>
          <p>
            All content, images, and branding on this site are owned by U40 Academy Inn and may not be reused without permission.
          </p>

          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Limitation of liability</h2>
          <p>
            U40 Academy Inn is not liable for any loss or damage arising from the use of this website or reliance on its content.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
