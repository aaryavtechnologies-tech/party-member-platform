import { InnerPageHeader } from "@/components/layout/InnerPageHeader";

export default function ContactPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Contact Us" 
        description="We are here to listen. Reach out to our national headquarters or find your local representatives."
        breadcrumbs={[
          { label: "Contact", href: "/contact" }
        ]}
      />
      <div className="py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Get in Touch</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
            For direct inquiries, please use the contact form located in the footer of this website. Our dedicated support team responds to all queries within 48 hours.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-900/5">
              <h3 className="font-bold text-lg mb-2">Headquarters</h3>
              <p className="text-slate-600 dark:text-slate-400">123 National Assembly Marg<br />New Delhi, India 110001</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-900/5">
              <h3 className="font-bold text-lg mb-2">Toll-Free Helpline</h3>
              <p className="text-slate-600 dark:text-slate-400">1800-XXX-XXXX<br />Available 8AM - 8PM</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-900/5">
              <h3 className="font-bold text-lg mb-2">Media Enquiries</h3>
              <p className="text-slate-600 dark:text-slate-400">media@organization.in<br />press@organization.in</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
