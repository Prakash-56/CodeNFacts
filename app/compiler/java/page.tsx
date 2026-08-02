import PlaceholderEditor from "../../components/PlaceholderEditor";

export default function JavaCompilerPage() {
  return (
    <PlaceholderEditor
      language="Java Compiler"
      filename="Main.java"
      gradient="from-cyan-500 to-emerald-500"
      sample={`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`}
    />
  );
}