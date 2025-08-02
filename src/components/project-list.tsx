import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ZippedProject } from "@/lib/parth";
import {
  CollapsibleTrigger,
  Collapsible,
  CollapsibleContent,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";

export function ProjectList({ projects }: { projects: ZippedProject[] }) {
  return (
    <Card className="grow">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>All projects created by this user</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex gap-8 flex-col">
          {projects.map((project) => (
            <Card key={project.id}>
              <Collapsible>
                <CardHeader>
                  <CardTitle>
                    <Link
                      className="underline"
                      href={
                        "https://summer.hackclub.com/projects/" + project.id
                      }
                    >
                      {project.title}
                    </Link>
                    {project.devlogs.length !== 0 && (
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 size-8"
                        >
                          <ChevronsUpDown />
                          <span className="sr-only">Toggle devlogs</span>
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {project.ai_chance.toFixed(2)}% chance AI
                  </CardDescription>
                </CardHeader>
                <CollapsibleContent className="mt-4">
                  <CardContent>
                    <ul className="flex flex-col gap-4">
                      {project.devlogs.map((devlog) => (
                        <Link
                          href={
                            "https://summer.hackclub.com/projects/" +
                            devlog.project_id +
                            "#devlog_" +
                            devlog.id
                          }
                          key={devlog.id}
                        >
                          <Card>
                            <CardHeader>
                              <CardDescription>
                                {devlog.ai_chance.toFixed(2)}% chance AI
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <pre className="whitespace-pre-wrap break-words">
                                {devlog.text}
                              </pre>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </ul>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
