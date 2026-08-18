import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#102235]">
      <Header forceScrolled />
      <main id="main-content" className="mx-auto max-w-[90rem] px-5 pb-20 pt-28 sm:px-8 sm:py-32 lg:px-10">
        <h1 className="text-[2.75rem] font-semibold tracking-[-0.04em] sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-[#60646c]">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>

        <section className="mt-10 max-w-3xl space-y-6 text-base leading-7 text-[#33373f] sm:mt-12">
          <p>
            U40 Academy Inn respects your privacy. This policy explains how we collect, use, and protect the information you provide when using our website or admission inquiry form.
          </p>

          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Information we collect</h2>
          <p>
            When you submit an admission inquiry, we collect the student name, guardian name, phone number, email address, date of birth, current class, course of interest, board, school name, previous academic percentage, residential address, and any message you choose to include.
          </p>

          <h2 className="text-2xl font-semibold tracking-[-0.03em]">How we use your information</h2>
          <p>
            We use this information only to contact you about admission counselling, campus visits, and enrolment. We do not sell or share personal information with third parties for marketing purposes.
          </p>

          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Data security</h2>
          <p>
            Your inquiry is stored securely and accessed only by the U40 admissions team. We use reasonable technical and organisational measures to protect your data.
          </p>

          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Contact us</h2>
          <p>
            If you have questions about this privacy policy or your data, please contact us by phone or visit the campus.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
