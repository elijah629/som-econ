import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ZippedProject } from "@/lib/parth";

export function ProjectList({ projects }: { projects: ZippedProject[] }) {
  return <Card className="grow">
    <CardHeader>
      <CardTitle>Projects</CardTitle>
      <CardDescription>All projects created by this user</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="flex gap-8 flex-col">
        {projects.map(project =>
          <Card key={project.id}>
    <CardHeader>
      <CardTitle>
          <Link className="underline" href={"https://summer.hackclub.com/projects/" + project.id}>{project.title}</Link>
        </CardTitle>
      <CardDescription>{project.ai_chance}% chance of AI</CardDescription>
    </CardHeader>
             </Card>
        )}
      </ul>
    </CardContent>
  </Card>
}
