import { Section } from "@/components/section";

export default function PrivacyPage() {
  return (
    <>
      <Section
        eyebrow="Legal"
        title="Privacy Policy"
        kicker="How Next Forge Pro collects, uses, and protects your information."
      >
        <div className="space-y-4 text-sm text-slate-200 md:text-base">
          <p>
            This site is operated by Next Forge Pro (Edgardo Lopez). I collect
            only the information you choose to share, such as details submitted
            through the contact form or emails you send directly.
          </p>
          <p>
            I use this information solely to respond to inquiries, provide
            proposals, and deliver design services. I do not sell your data or
            share it with third parties for marketing purposes.
          </p>
          <p>
            Basic analytics may be used to understand traffic patterns (for
            example, which pages are viewed most often). These are used to
            improve the site experience.
          </p>
          <p>
            If you have any questions about how your information is handled,
            contact{" "}
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
