import PlaceholderEditor from "../../components/PlaceholderEditor";

export default function CCompilerPage() {
  return (
    <PlaceholderEditor
      language="C Compiler"
      filename="main.c"
      gradient="from-emerald-500 via-teal-500 to-cyan-500"
      sample={`#include <stdio.h>

int main() {
    printf("Hello, world!\\n");
    return 0;
}`}
    />
  );
}