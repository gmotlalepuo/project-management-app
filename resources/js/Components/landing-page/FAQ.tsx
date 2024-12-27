import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Is TeamSync free to use?",
    answer:
      "Yes! TeamSync is completely free to use with all features included. No credit card required, no hidden fees, and no usage limits.",
    value: "pricing",
  },
  {
    question: "How do project roles work in TeamSync?",
    answer:
      "Each project has two roles: Project Managers and Project Members. Project Managers can invite members, manage tasks, and promote/demote other members. Project Members can create and manage their own tasks, participate in discussions, and use all collaboration features.",
    value: "roles",
  },
  {
    question: "Can I invite people to my projects?",
    answer:
      "Yes! You can invite as many team members as you need to your projects. Simply enter their email address, and they'll receive an invitation to join your project. They can then create an account if they don't have one already.",
    value: "invitations",
  },
  {
    question: "How does task discussion work?",
    answer:
      "Every task has its own discussion section where team members can communicate, share updates, and provide feedback. This keeps all task-related communications organized and in one place, eliminating the need for separate chat tools or email threads.",
    value: "discussions",
  },
  {
    question: "How do I organize tasks in TeamSync?",
    answer:
      "TeamSync offers multiple ways to organize tasks: custom labels for categorization, priority settings, due dates, and assignees. You can filter and search tasks using any of these parameters to quickly find what you need.",
    value: "organization",
  },
  {
    question: "Can I use TeamSync for multiple projects?",
    answer:
      "Absolutely! You can create and manage multiple projects, each with its own team members, tasks, and discussions. There's no limit to the number of projects you can create.",
    value: "multiple-projects",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <h2 className="mb-4 text-3xl font-bold md:text-4xl">
        Common{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">
          Questions
        </span>{" "}
        About TeamSync
      </h2>

      <Accordion type="single" collapsible className="AccordionRoot w-full">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">{question}</AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="mt-4 font-medium">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="mailto:contact@teamsync.vip"
          title="Contact us"
          className="dark:text-primary-light dark:border-primary-light border-primary text-primary transition-all hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
