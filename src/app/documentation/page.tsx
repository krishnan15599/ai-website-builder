import type { Metadata } from "next";
import DocumentationPage from "@/components/documentation/DocumentationPage";

export const metadata: Metadata = {
  title: "Documentation | Aetheria",
  description:
    "Study guide for the Aetheria AI Website Builder — architecture, APIs, database, and file map.",
};

export default function DocumentationRoute() {
  return <DocumentationPage />;
}
