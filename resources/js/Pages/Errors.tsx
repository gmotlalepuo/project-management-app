import { Head, Link } from "@inertiajs/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Home } from "lucide-react";

const statusMessages: { [key: number]: { title: string; message: string } } = {
  400: {
    title: "400 Bad Request",
    message: "Sorry, the request could not be understood by the server.",
  },
  401: {
    title: "401 Unauthorized",
    message: "Sorry, you are not authenticated.",
  },
  403: {
    title: "403 Forbidden",
    message: "Sorry, you are not authorized to access this page.",
  },
  404: {
    title: "404 Not Found",
    message: "Sorry, the page you are looking for could not be found.",
  },
  405: {
    title: "405 Method Not Allowed",
    message: "Sorry, the method is not allowed.",
  },
  419: {
    title: "419 Page Expired",
    message: "Sorry, your session has expired.",
  },
  429: {
    title: "429 Too Many Requests",
    message: "Sorry, you are making too many requests.",
  },
  500: {
    title: "500 Internal Server Error",
    message: "Sorry, something went wrong on our end.",
  },
  503: {
    title: "503 Service Unavailable",
    message: "Sorry, the service is currently unavailable.",
  },
};

export default function Errors({ status }: { status: number }) {
  const { title, message } = statusMessages[status] || {
    title: "Error",
    message: "An unexpected error has occurred.",
  };

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Card className="m-4 shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <ApplicationLogo className="mb-4 h-12 w-12 fill-primary" />
            <CardTitle className="text-4xl font-bold text-destructive">
              {status}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">{message}</CardContent>
          <CardFooter className="justify-center">
            <Link
              href="/"
              prefetch
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <Home className="h-5 w-5" />
              <span>Go back home</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
