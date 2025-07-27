import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Form from "next/form";

export function SearchBar({ query }: { query?: string }) {
  return (
    <Form action="/search" className="flex gap-2">
      <Input
        name="q"
        placeholder="Search..."
        defaultValue={query}
        className="w-full"
      />
      <Button type="submit">Search</Button>
    </Form>
  );
}
