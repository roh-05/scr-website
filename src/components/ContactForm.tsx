// src/components/ContactForm.tsx
"use client";

import { useState } from "react";
import { submitContactForm } from "@/actions/contact";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage("");
    
    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);

    if (result.success) {
      setFormStatus("success");
      (e.target as HTMLFormElement).reset(); 
      setTimeout(() => setFormStatus("idle"), 4000);
    } else {
      setFormStatus("error");
      setErrorMessage(result.error || "Failed to send message.");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  return (
    <>
      {formStatus === "error" && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-start gap-3 border border-red-100">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold text-surrey-blue">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              required
              disabled={formStatus === "submitting"}
              className="w-full bg-surrey-beige/50 border border-surrey-grey/40 text-surrey-blue rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all disabled:opacity-50"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-surrey-blue">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              required
              disabled={formStatus === "submitting"}
              className="w-full bg-surrey-beige/50 border border-surrey-grey/40 text-surrey-blue rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all disabled:opacity-50"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-bold text-surrey-blue">Subject</label>
          <select 
            id="subject"
            name="subject"
            disabled={formStatus === "submitting"}
            className="w-full bg-surrey-beige/50 border border-surrey-grey/40 text-surrey-blue rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all appearance-none disabled:opacity-50"
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Recruitment & Applications">Recruitment & Applications</option>
            <option value="Corporate Partnership">Corporate Partnership</option>
            <option value="Alumni Relations">Alumni Relations</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-bold text-surrey-blue">Message</label>
          <textarea 
            id="message" 
            name="message"
            rows={5}
            required
            disabled={formStatus === "submitting"}
            className="w-full bg-surrey-beige/50 border border-surrey-grey/40 text-surrey-blue rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all resize-none disabled:opacity-50"
            placeholder="How can we help you?"
          ></textarea>
        </div>

        <button 
          type="submit"
          disabled={formStatus === "submitting" || formStatus === "success"}
          className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            formStatus === "success" 
              ? "bg-green-600 text-white" 
              : "bg-surrey-blue text-surrey-light hover:bg-surrey-blue/90 shadow-md"
          } disabled:opacity-70`}
        >
          {formStatus === "idle" && <><Send size={18} /> Send Message</>}
          {formStatus === "error" && <><Send size={18} /> Try Again</>}
          {formStatus === "submitting" && "Sending..."}
          {formStatus === "success" && <><CheckCircle2 size={18} /> Message Sent Successfully</>}
        </button>
      </form>
    </>
  );
}
