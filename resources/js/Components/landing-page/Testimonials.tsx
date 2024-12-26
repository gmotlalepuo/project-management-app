import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://i.pravatar.cc/150?img=32",
    name: "Sarah Chen",
    userName: "Tech Lead at DevCorp",
    comment:
      "TeamSync has revolutionized how we handle project workflows. The task management and labeling system is incredibly intuitive.",
  },
  {
    image: "https://i.pravatar.cc/150?img=41",
    name: "Alex Rivera",
    userName: "Product Manager",
    comment:
      "The real-time collaboration features have made our remote team feel more connected than ever. Great tool for modern teams.",
  },
  {
    image: "https://i.pravatar.cc/150?img=15",
    name: "Emma Thompson",
    userName: "Scrum Master",
    comment:
      "The task discussion feature keeps all our project communications organized. No more lost feedback in endless email threads.",
  },
  {
    image: "https://i.pravatar.cc/150?img=54",
    name: "James Wilson",
    userName: "DevOps Engineer",
    comment:
      "Clean interface, powerful features, and excellent team collaboration tools. Exactly what we needed for our agile workflow.",
  },
  {
    image: "https://i.pravatar.cc/150?img=24",
    name: "Maria Garcia",
    userName: "Frontend Developer",
    comment:
      "The customizable labels and task organization have made our sprint planning so much more efficient.",
  },
  {
    image: "https://i.pravatar.cc/150?img=60",
    name: "David Kim",
    userName: "Engineering Manager",
    comment:
      "TeamSync has significantly improved our team's productivity. The ability to track tasks and collaborate in real-time is invaluable.",
  },
];

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="container mx-auto max-w-7xl px-4 py-16 sm:py-24"
    >
      <h2 className="text-3xl font-bold md:text-4xl">
        Trusted by Teams{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">
          Worldwide
        </span>
      </h2>

      <p className="pb-8 pt-4 text-xl text-muted-foreground">
        See how TeamSync helps teams collaborate better and deliver projects faster
      </p>

      <div className="mx-auto grid columns-2 space-y-4 sm:block md:grid-cols-2 lg:columns-3 lg:grid-cols-4 lg:gap-6 lg:space-y-6">
        {testimonials.map(({ image, name, userName, comment }: TestimonialProps) => (
          <Card
            key={userName}
            className="max-w-max overflow-hidden md:break-inside-avoid"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage alt="" src={image} />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>{userName}</CardDescription>
              </div>
            </CardHeader>

            <CardContent>{comment}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
