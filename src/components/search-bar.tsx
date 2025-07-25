import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function SearchBar({ query }: { query?: string }) {
  return (
    <form method="GET" action="/search" className="flex gap-2">
      <Input
        name="q"
        placeholder="Search..."
        defaultValue={query}
        className="w-full"
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
