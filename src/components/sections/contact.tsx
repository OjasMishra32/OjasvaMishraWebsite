"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContactForm from "../ContactForm";
import { config } from "@/data/config";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";

const ContactSection = () => {
  return (
    <SectionWrapper id="contact" className="min-h-screen max-w-7xl mx-auto ">
      <SectionHeader id='contact' className="relative mb-14" title={
        <>
          LET&apos;S BUILD <br />
          SOMETHING
        </>} />
      <div className="grid grid-cols-1 md:grid-cols-2 z-[9999] mx-4">
        <Card className="min-w-7xl bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-xl mt-10 md:mt-20">
          <CardHeader>
            <CardTitle className="text-4xl">Contact Form</CardTitle>
            <CardDescription>
              Email me directly at{" "}
              <a
                href={`mailto:${config.email}`}
                className="underline underline-offset-4 cursor-can-hover rounded-lg hover:text-foreground"
              >
                {config.email}
              </a>{" "}
              (or{" "}
              <a
                href={`mailto:${config.altEmail}`}
                className="underline underline-offset-4 cursor-can-hover rounded-lg hover:text-foreground"
              >
                {config.altEmail}
              </a>
              ) — or drop your info here and I&apos;ll come back to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
};
export default ContactSection;
