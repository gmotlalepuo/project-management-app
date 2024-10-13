import { Link } from "@inertiajs/react";

type Props = {
  links: any[]; // Adjust the type as needed
};

export default function Pagination({ links }: Props) {
  return (
    <nav className="mt-4 text-center">
      {links.map((link) => (
        <Link
          preserveScroll
          key={`${link.label}-${link.url}`}
          href={link.url || ""}
          className={`${link.active ? "bg-gray-900" : ""} ${!link.url ? "cursor-not-allowed !text-gray-500" : "hover:bg-gray-900"} mx-0.5 inline-block rounded-lg px-3 py-2 text-xs text-gray-200`}
          dangerouslySetInnerHTML={{ __html: link.label }}
        ></Link>
      ))}
    </nav>
  );
}
