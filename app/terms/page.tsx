import { Section } from "@/components/section";

export default function TermsPage() {
  return (
    <>
      <Section
        eyebrow="Legal"
        title="Terms of Service"
        kicker="Plain-language terms for working with Next Forge Pro."
      >
        <div className="space-y-4 text-sm text-slate-200 md:text-base">
          <p>
            All design work is provided by Next Forge Pro (Edgardo Lopez) on a
            project or retainer basis as agreed in writing (proposal, email, or
            signed contract).
          </p>
          <p>
            Unless otherwise stated, project invoices are due within 14 days of
            issue. Late payments may delay delivery or future work.
          </p>
          <p>
            You receive usage rights to the final approved design deliverables
            for your business. I reserve the right to showcase non-confidential
            work in my portfolio and marketing materials.
          </p>
          <p>
            If youâ€™d like to negotiate different terms for a specific project,
            we can document that in a separate written agreement.
          </p>
          <p>
            Questions? Reach out at{" "}
            <a
              href="mailto:contact@nextforgepro.com"
              className="text-sky-300 hover:text-sky-200"
            >
              contact@nextforgepro.com
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
