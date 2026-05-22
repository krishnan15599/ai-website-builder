import Link from "next/link";
import Button from "@/components/ui/Button";

export default function EditorNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <h1 className="text-2xl font-bold text-foreground">Project not found</h1>
      <p className="text-muted mt-2 text-sm">
        This project does not exist or you do not have access.
      </p>
      <Link href="/dashboard" className="mt-6">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
