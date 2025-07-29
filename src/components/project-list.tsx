import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Project } from "@/lib/parth";

export function ProjectList({ projects }: { projects: Project[] }) {
  return <Card>
    <CardHeader>
      <CardTitle>Projects</CardTitle>
      <CardDescription>All projects created by this user</CardDescription>
    </CardHeader>
    <CardContent>
      <ul>
        {projects.map(x => <li key={x.id}>
          <Link className="underline" href={"https://summer.hackclub.com/projects/" + x.id}>{x.title}</Link>
        </li>)}
      </ul>
    </CardContent>
  </Card>
}
